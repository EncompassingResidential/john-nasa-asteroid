import React, { useState, useEffect } from 'react'

import { Button, ButtonGroup, Card, Col, Container, PageItem, Row, Table } from 'react-bootstrap'
// import { usePagination } from '@table-library/react-table-library/pagination'
// import { useTable } from 'react-table'

import 'bootstrap/dist/css/bootstrap.min.css'

import { formatFloatToString, sortNEOArray } from './NASANeoSupportFunctions.js'
import NASANeoSearchForm from './NASANeoSearchForm.js'

import sort_up_arrow   from '../images/Up_Green_Arrow.jpg'
import sort_down_arrow from '../images/Down_Red_Arrow.jpg'
import sort_both_arrows   from '../images/Sort_Up_And_Down_Arrow.jpg'

const NASANeoMainContent = ( {neoInputState, setNeoInputState, allNEOsArray, setAllNEOsArray, neoAppStatus, setNeoAppStatus } ) => {

    const [tableState, setTableState] = React.useState(
        {
            sortColumn: "closest_approach_date_full",
            isSortAscending: true,
            sortColumnImage: sort_down_arrow,
            currentFirstRowShowing: 0
        }
    )

    /*
    const [currentFirstRowShowing, setCurrentFirstRowShowing] = React.useState(0)
    */

    React.useEffect(() => {
            localStorage.setItem('neosArrayStorage', JSON.stringify(allNEOsArray))
        }, [allNEOsArray]
    )

    function clearLocalStorage() {
        localStorage.clear();
    }


    function pageBackwardThroughRows(event) {
        
            // useState on tableState.currentFirstRowShowing PROPerty && tableState.currentFirstRowShowing's value
        const {name, value} = event.target

        setTableState(prevSetTableState => {
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

            return {
                ...prevSetTableState,
                [name]: returnRowNumber.toString()
            }
        })

    }


    function pageForwardThroughRows(event) {
        const {name, value} = event.target

        setTableState(prevSetTableState => {
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

            return {
                ...prevSetTableState,
                [name]: returnRowNumber.toString()
            }
        })

    }


    function NEOElementsToRender() {

        const dateNEOsArray = allNEOsArray.near_earth_objects

        let allNEOsSortedToRender = []

        if (dateNEOsArray !== undefined) {

            sortNEOArray(dateNEOsArray, tableState)

            const dateNEOsArraySliced =
                         dateNEOsArray.slice(parseInt(tableState.currentFirstRowShowing), parseInt(tableState.currentFirstRowShowing) + parseInt(neoInputState.neoRowsToShow))

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

            <NASANeoSearchForm neoInputState={neoInputState} setNeoInputState={setNeoInputState} allNEOsArray={allNEOsArray} setAllNEOsArray={setAllNEOsArray} neoAppStatus={neoAppStatus} setNeoAppStatus={setNeoAppStatus} tableState={tableState} setTableState={setTableState} pageBackwardThroughRows pageForwardThroughRows />

            <Container>
                <Table  hover border={2} className="px-1">
                    <thead>
                        <tr>
                            <th xs={3} className="leftcolumn--data">NEO ID</th>
                            <th xs={3}><div className="d-flex flex-row">NEO Name:</div></th>
                            <th>Is NEO Hazardous? </th>
                            <th><div className="d-flex flex-row">Diameter:<button
                                onClick={e => setTableState({...tableState, sortColumn: "est_diameter_feet_est_diameter_max", 
                                                                isSortAscending: !tableState.isSortAscending,
                                                                sortColumnImage: (tableState.isSortAscending) ? sort_down_arrow : sort_up_arrow })}
                                key={new Date().getMilliseconds()}
                                className="table--header"
                                ><img className="sort--image" src={ (tableState.sortColumn === "est_diameter_feet_est_diameter_max") ? tableState.sortColumnImage : sort_both_arrows } alt="Sort Direction" /></button></div></th>
                            <th><div className="d-flex flex-row">Closest Approach on:<button
                                onClick={e => setTableState({...tableState, sortColumn: "closest_approach_date_full", 
                                                                isSortAscending: !tableState.isSortAscending,
                                                                sortColumnImage: (tableState.isSortAscending) ? sort_down_arrow : sort_up_arrow })}
                                key={new Date().getMilliseconds()}
                                className="table--header"
                                ><img className="sort--image" src={ (tableState.sortColumn === "closest_approach_date_full") ? tableState.sortColumnImage : sort_both_arrows } alt="Sort Direction" /></button></div></th>
                            <th><div className="d-flex flex-row">Relative Velocity:<button
                                onClick={e => setTableState({...tableState, sortColumn: "cad_relative_velocity_miles_per_hour", 
                                                                            isSortAscending: !tableState.isSortAscending,
                                                                            sortColumnImage: (tableState.isSortAscending) ? sort_down_arrow : sort_up_arrow })}
                                key={new Date().getMilliseconds()}
                                className="table--header"
                                ><img className="sort--image" src={ (tableState.sortColumn === "cad_relative_velocity_miles_per_hour") ? tableState.sortColumnImage : sort_both_arrows } alt="Sort Direction" /></button></div></th>
                            <th><div className="d-flex flex-row">Distance Missed from Body:<button
                                onClick={e => setTableState({...tableState, sortColumn: "cad_miss_distance_miles", 
                                                                            isSortAscending: !tableState.isSortAscending,
                                                                            sortColumnImage: (tableState.isSortAscending) ? sort_down_arrow : sort_up_arrow })}
                                key={new Date().getMilliseconds()}
                                className="table--header"
                                ><img className="sort--image" src={ (tableState.sortColumn === "cad_miss_distance_miles" )  ? tableState.sortColumnImage : sort_both_arrows } alt="Sort Direction" /></button></div></th>
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
                        value={tableState.currentFirstRowShowing} // This "value={}" is how to impliment React controlled components

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
                        value={tableState.currentFirstRowShowing} // This "value={}" is how to impliment React controlled components

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

export default NASANeoMainContent