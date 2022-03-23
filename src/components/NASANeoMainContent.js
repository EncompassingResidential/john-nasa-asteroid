import React                    from 'react';
import { useState, useEffect }  from 'react';

import { Button, ButtonGroup, Card, Col, Container, Form, Modal, PageItem, Row, Spinner, Table } from 'react-bootstrap'
// import { usePagination } from '@table-library/react-table-library/pagination'
// import { useTable } from 'react-table'

import 'bootstrap/dist/css/bootstrap.min.css'

import { formatFloatToString, sortNEOArray } from './NASANeoSupportFunctions.js'
import { getNASANeoDataViaAPI } from './NASANeoAPICalls.js'

import sort_up_arrow   from '../images/Up_Green_Arrow.jpg'
import sort_down_arrow from '../images/Down_Red_Arrow.jpg'
import sort_both_arrows   from '../images/Sort_Up_And_Down_Arrow.jpg'

export default function NASANeoMainContent() {

    const [neoInputState, setNeoInputState] = React.useState(JSON.parse(localStorage.getItem('neoInputStateStorage'))                                                || [] )

    const [allNEOsArray, setAllNEOsArray] = React.useState(JSON.parse(localStorage.getItem('neosArrayStorage'))
                                                || [] )

    const [sortColumn, setSortColumn] = React.useState("closest_approach_date_full")

    const [isSortAscending, setIsSortAscending] = React.useState(true)

    const [sortColumnImage, setSortColumnImage] = useState(sort_both_arrows)

    const [currentFirstRowShowing, setCurrentFirstRowShowing] = React.useState(0)

    const [neoAppStatus, setNeoAppStatus] = React.useState(
        {
            responseStatus:     200,
            responseType:       "",
            responseStatusText: ""
        })

    React.useEffect(() => {
            localStorage.setItem('neosArrayStorage', JSON.stringify(allNEOsArray))
        }, [allNEOsArray]
    )

    React.useEffect(() => {
            localStorage.setItem('neoInputStateStorage', JSON.stringify(neoInputState))
        }, [neoInputState]
    )

    function clearLocalStorage() {
        localStorage.clear();
    }

    /*
    Getting this error message in the Chrome Console 3/10 to 3/23/22:

    "Uncaught (in promise) Error: The message port closed before a response was received."

    It only occurs on Chrome browser (3/22/22 99.0.4844.74 64 bit) when the actor touches the Input fields even if the field is not changed.
    i.e. the input field gains focus.  When a change does happen to input field, i.e. a character added or deleted the Error doesn't occur.
    */
    function handleChange(event) {
        const {name, value} = event.target

        setNeoInputState(prevNEOInputState => {
            return {
                ...prevNEOInputState,
                [name]: (value < 1) ? 10 : value
            }
        })

        setNeoAppStatus(prevNeoAppStatus => {
            return {
                responseStatus:     200,
                responseType:       "",
                responseStatusText: ""
            }
        })

    }

    function handleSortingChange(tableColumnName) {

        setSortColumn(prevSortColumn => {
            return tableColumnName
        })

        setIsSortAscending(prevIsSortAscending => {
            return (prevIsSortAscending) ? false : true
        })

        // This lags behind current state
        setSortColumnImage(prevSortColumnImage => {
            let sorting_image = sort_both_arrows

            if (sortColumn === tableColumnName) {
                sorting_image = (isSortAscending) ? sort_down_arrow : sort_up_arrow
            }

            return sorting_image
        })

    }

    /* This results in too many renders
    function handleSortingImage(tableColumnName) {

        setSortColumnImage(prevSortColumnImage => {
            let sorting_image = sort_both_arrows
            console.log("  IN function handleSortingChange -> setSortColumnImage")
            console.log("     sorting_image = sort_both_arrows")
            console.log(`      NEXT is if (sortColumn ${sortColumn} === tableColumnName ${tableColumnName})`)
            if (sortColumn === tableColumnName) {
                console.log("     if (sortColumn === tableColumnName)")
                sorting_image = (isSortAscending) ? sort_down_arrow : sort_up_arrow
            }

            return sorting_image
        })
    }
    */

    function pageBackwardThroughRows(event) {
            // useState on currentFirstRowShowing PROPerty && currentFirstRowShowing's value
        const {name, value} = event.target

        setCurrentFirstRowShowing(prevCurrentFirstRowShowing => {
            const currentFirstRowShowingNumber = parseInt(value)
            const neoRowsToShowAsInteger = parseInt(neoInputState.neoRowsToShow)

                /*
                    neoRowsToShow = 5
                    50 - 5 = 45  so   50 - (50 > 5) = 50 - 5
                        5 - 5 =  5  so    5 - ( 5 > 5) =  5 - 0
                */
            let returnRowNumber = 0

            //  50 >= 50 then 50 - 50 = 0
                //   7 >=  5 then  7 -  5 = 2
            if (currentFirstRowShowingNumber >= neoRowsToShowAsInteger) {
                returnRowNumber = currentFirstRowShowingNumber - neoRowsToShowAsInteger
            }
                //  19 >= 50 then return 0
                //   2 >=  5 then return 0
            else {
                returnRowNumber = 0
            }

            return ( returnRowNumber.toString() )
        })

    }


    function pageForwardThroughRows(event) {
        const {name, value} = event.target

        setCurrentFirstRowShowing(prevCurrentFirstRowShowing => {
            const currentFirstRowShowingNumber = parseInt(value)
            const neoRowsToShowAsInteger = parseInt(neoInputState.neoRowsToShow)

            let returnRowNumber = 0
            /*
                (0 + 100 < 82) ? (0 + 100) : 82 - 100 returns -18
                then 2nd+ time pressing Forward button
                (-18 + 100 < 82) ? (-18 + 100) : 82 - 100 returns -18

                (0 + 81 < 82) ? (0 + 81) : 82 - 81 returns 81
                then 2nd+ time pressing Forward button
                (81 + 81 < 82) ? (81 + 81) : 82 - 81 returns 0 (I want to return 82 - 81 = 1)

                */
            if (currentFirstRowShowingNumber + neoRowsToShowAsInteger < allNEOsArray.element_count) {
                    returnRowNumber = currentFirstRowShowingNumber + neoRowsToShowAsInteger
            }
            else {
                returnRowNumber = allNEOsArray.element_count - neoRowsToShowAsInteger

                if (returnRowNumber < 0) {
                    returnRowNumber = 0
                }
            }

            return ( returnRowNumber.toString() )
        })

    }


    function neoHandleAppStatus() {

        if (neoAppStatus.responseStatus === 123) {
            return (<h3 className="error"> The Start Date {neoInputState.dateNeoSearchStart} is AFTER End Date {neoInputState.dateNeoSearchEnd}</h3>)
        }
        else if (neoAppStatus.responseStatus === 124) {
            return (<h3 className="information"> Enter in Start Date {neoInputState.dateNeoSearchStart} and End Date {neoInputState.dateNeoSearchEnd} then Please Press "Search for NEOs" Button.</h3>)
        }
        else if (neoAppStatus.responseStatus === 400 ) {
            return (<h5 className="error"> API Error Number ({neoAppStatus.responseStatus})
                        <text> - - - </text>Type ({ neoAppStatus.responseType })
                        <p>Error Message ({ neoAppStatus.responseStatusText }
                        {(neoAppStatus.responseType === "cors") ? `This "400 cors" usually means that there are too many days between the Start ${neoInputState.dateNeoSearchStart} & End Date ${neoInputState.dateNeoSearchEnd}` : ""})</p>
                        </h5>)
        }

            // responseStatus === 300 on 3/22/22 Start Search Status for "Please Wait" events
        else if (neoAppStatus.responseStatus === 300) {
            return (<h5 className="information">
                    { neoAppStatus.responseType }
                    { neoAppStatus.responseStatusText } </h5>)
        }

        else { return (<div></div>) }
    }

    function startNEOSearch(event) {

        if (neoInputState.neoRowsToShow === undefined || neoInputState.neoRowsToShow < 1 ) {

            setNeoInputState(prevNEOInputState => {
                return {
                    ...prevNEOInputState,
                    neoRowsToShow: 1
                }
            })
        }

        setNeoAppStatus(prevNeoAppStatus => {
            return {
                responseStatus:     300,
                responseType:       "Search ",
                responseStatusText: `Ringing up NASA NEO API Server - Please Wait...`
            }
        })

        getNASANeoDataViaAPI(neoInputState, setAllNEOsArray, setNeoAppStatus, setCurrentFirstRowShowing, setSortColumn)

    }

    // Start Spinning Solar System the infamous "Please Wait" gif.

    /*    const pagination = usePagination(allNEOsArray, {
        state: {
            page: 0,
            size: 2,
        },
    })
    */

    // Only show top 10 results
    // Pagination is part of this

    function NEOElementsToRender() {

        const dateNEOsArray = allNEOsArray.near_earth_objects

        let allNEOsSortedToRender = []

        if (dateNEOsArray !== undefined) {

            sortNEOArray(dateNEOsArray, sortColumn)

            const dateNEOsArraySliced =
                         dateNEOsArray.slice(parseInt(currentFirstRowShowing), parseInt(currentFirstRowShowing) + parseInt(neoInputState.neoRowsToShow))

            allNEOsSortedToRender = dateNEOsArraySliced.map((neo) => {

                let classString
                (neo.is_potentially_hazardous_asteroid === true) ? classString = "text-danger py-1" : classString = "text-success py-1"

                return (
                    <tr className={classString} key={neo.id}>
                        <td className={classString} xs={3}>{neo.id}</td>
                        <td className={classString} xs={3}>{neo.name}</td>
                        <td className={classString}>{neo.is_potentially_hazardous_asteroid === true ? "*** NEO is Potentially Hazardous ***" : "NEO is Not Hazardous"}</td>
                        <td className={classString} xl={3}>Diameter {formatFloatToString(neo.est_diameter_feet_est_diameter_max)} Feet</td>
                        <td className={classString} xs={5}>{neo.closest_approach_date_full}</td>
                        <td className={classString} xs={5}>{formatFloatToString(+(neo.cad_relative_velocity_miles_per_hour))} Mi/Hr</td>
                        <td className={classString}>{neo.cad_orbiting_body} by {formatFloatToString(+(neo.cad_miss_distance_miles))} Miles</td>
                    </tr>
                )
            })

        }
        else {
            // 3/13/22 This does return proper React JSX, but when I put inside array ["<PageItem>etc."] it didn't return properly.
            allNEOsSortedToRender = (<PageItem key="1234567890">Press "Search for NEOs" Button to get NASA data - {neoInputState.dateNeoSearchStart} to {neoInputState.dateNeoSearchEnd}</PageItem>)
        }

        return allNEOsSortedToRender

    }

    /* Spinner code
    I think needs useState variable
    - www options
    : CSS display:'none' https://til.hashrocket.com/posts/9d7e8e1a65-invisible-components-in-react-native
    : this.setState {isActive: true} https://reactgo.com/react-show-hide-elements/

    */

    return (
        <Card body className="mx-1 my-1" border="success">
            <Form
                noValidate
                className="mx-2 p-2 border"
            >
                <Row>
                    <Col md>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>NEO Search Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="NEO Start Date"

                                onChange={handleChange}
                                value={neoInputState.dateNeoSearchStart} // This "value={}" is how to impliment React controlled components
                                name="dateNeoSearchStart"

                                />
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>NEO Search End Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="NEO End Date"

                                onChange={handleChange}
                                value={neoInputState.dateNeoSearchEnd} // This "value={}" is how to impliment React controlled components
                                name="dateNeoSearchEnd"

                                />
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group controlId="formNeoRowsToShow">
                            <Form.Label>Rows of Data to Show</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Number of Rows to Display"

                                onChange={handleChange}
                                name="neoRowsToShow"
                                value={neoInputState.neoRowsToShow} // This "value={}" is how to impliment React controlled components
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex flex-row">
                    <ButtonGroup >
                        <Button
                            onClick={startNEOSearch}
                            size="sm"
                            variant="primary"
                            className="mx-5 p-2 my-1"
                            spacing="15"
                        >
                            {neoAppStatus.responseStatus === 300 && <Spinner
                            display="none"
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            /> }
                            {(neoAppStatus.responseStatus === 300) ? "Waiting on NASA" : "Search for NEOs"}
                        </Button>
                        { neoHandleAppStatus(neoAppStatus) }
                        <Button
                            onClick={pageBackwardThroughRows}
                            name="currentFirstRowShowing"
                            value={currentFirstRowShowing} // This "value={}" is how to impliment React controlled components
                            active
                            size="sm"
                            variant="success"
                            className="mx-5  my-2"
                            spacing="15"
                        >
                            Go Back {neoInputState.neoRowsToShow} Rows
                        </Button>
                        <Button
                            onClick={pageForwardThroughRows}
                            name="currentFirstRowShowing"
                            value={currentFirstRowShowing} // This "value={}" is how to impliment React controlled components
                            active
                            size="sm"
                            variant="info"
                            className="mx-5 my-2"
                            spacing="15"
                        >
                            Go Forward {neoInputState.neoRowsToShow} Rows
                        </Button>
                        {neoAppStatus.responseStatus === 200 && <text>Total of {allNEOsArray.element_count} NEOs starting {neoInputState.dateNeoSearchStart}</text>}
                    </ButtonGroup>

                </div>

            </Form>
            <Container>
                <Table  hover border={2} className="px-1">
                    <thead>
                        <tr>
                            <th xs={3} className="leftcolumn--data">NEO ID</th>
                            <th xs={3}><div className="d-flex flex-row">NEO Name:</div></th>
                            <th>Is NEO Hazardous? </th>
                            <th><div className="d-flex flex-row">Diameter:<button
                                onClick={() => handleSortingChange("est_diameter_feet_est_diameter_max")}
                                key={new Date().getMilliseconds()}
                                className="table--header"
                                ><img className="sort--image" src={(sortColumn === "est_diameter_feet_est_diameter_max") ? sort_down_arrow : sort_up_arrow} alt="Sort Direction" /></button></div></th>
                            <th><div className="d-flex flex-row">Closest Approach on:<button
                                onClick={() => handleSortingChange("closest_approach_date_full")}
                                key={new Date().getMilliseconds()}
                                className="table--header"
                                ><img className="sort--image" src={(sortColumn === "closest_approach_date_full") ? sort_down_arrow : sort_up_arrow} alt="Sort Direction" /></button></div></th>
                            <th><div className="d-flex flex-row">Relative Velocity:<button
                                onClick={() => handleSortingChange("cad_relative_velocity_miles_per_hour")}
                                key={new Date().getMilliseconds()}
                                className="table--header"
                                ><img className="sort--image" src={(sortColumn === "cad_relative_velocity_miles_per_hour") ? sort_down_arrow : sort_up_arrow} alt="Sort Direction" /></button></div></th>
                            <th><div className="d-flex flex-row">Distance Missed from Body:<button
                                onClick={() => handleSortingChange("cad_miss_distance_miles")}
                                key={new Date().getMilliseconds()}
                                className="table--header"
                                ><img className="sort--image" src={(sortColumn === "cad_miss_distance_miles") ? sort_down_arrow : sort_up_arrow} alt="Sort Direction" /></button></div></th>
                        </tr>
                    </thead>

                    <tbody>
                        {NEOElementsToRender()}
                    </tbody>
                </Table>
                <ButtonGroup className="d-flex flex-row">
                    <Button
                        onClick={pageBackwardThroughRows}
                        name="currentFirstRowShowing"
                        value={currentFirstRowShowing} // This "value={}" is how to impliment React controlled components

                        size="sm"
                        variant="success"
                        active
                        className="ml-5"

                    >
                        Back {neoInputState.neoRowsToShow} Rows
                    </Button>
                    <Button
                        onClick={pageForwardThroughRows}
                        name="currentFirstRowShowing"
                        value={currentFirstRowShowing} // This "value={}" is how to impliment React controlled components

                        size="sm"
                        variant="info"
                        active
                        className="mlg-5 p-2 my-1"
                        spacing="15"
                    >
                        Go Forward {neoInputState.neoRowsToShow} Rows
                    </Button>
                    {neoAppStatus.responseStatus === 200 && <text>Total of {allNEOsArray.element_count} NEOs starting {neoInputState.dateNeoSearchStart}</text>}
                </ButtonGroup>

            </Container>

        </Card>
    )
}