import React from 'react';

import { Button, Card, Col, Container, Form, Modal, PageItem, Row, Spinner, Table } from 'react-bootstrap'
// import { usePagination } from '@table-library/react-table-library/pagination'
// import { useTable } from 'react-table'

import 'bootstrap/dist/css/bootstrap.min.css'

import { formatFloatToString } from './NASANeoSupportFunctions.js'
import { getNASANeoDataViaAPI } from './NASANeoAPICalls.js'

export default function NASANeoMainContent() {

    const [neoInputState, setNeoInputState] = React.useState(JSON.parse(localStorage.getItem('neoInputStateStorage'))                                                || [] )

    const [allNEOsArray, setAllNEOsArray] = React.useState(JSON.parse(localStorage.getItem('neosArrayStorage'))
                                                || [] )

    const [errorMessage, setErrorMessage] = React.useState(
        {
            responseStatus:     200,
            responseType:       "",
            responseStatusText: ""
        })

    React.useEffect(() => {
            localStorage.setItem('neosArrayStorage', JSON.stringify(allNEOsArray))
        }, [allNEOsArray]
    );

    React.useEffect(() => {
            localStorage.setItem('neoInputStateStorage', JSON.stringify(neoInputState))
        }, [neoInputState]
    );

    function clearLocalStorage() {
        localStorage.clear();
    }

    /*
    Getting this error message in Console 3/10 to 3/14/22:

    "Uncaught (in promise) Error: The message port closed before a response was received."

    It happens when the actor just touches the Input fields even if the field is not changed.  i.e. the input field gains focus.

    When a change does happen to input field, i.e. a character added or deleted the Error doesn't occur.
    */
    function handleChange(event) {
        const {name, value} = event.target

        console.log("   ---   handleChange")
        setNeoInputState(prevNEOInputState => {
            return {
                ...prevNEOInputState,
                [name]: value
            }
        })

        setErrorMessage(prevErrorMessage => {
            return { 
                responseStatus:     200,
                responseType:       "",
                responseStatusText: ""
            }
        })
    
    }


    function startNEOSearch(event) {

        // Start Spinning Solar System the infamous "Please Wait" gif.

        getNASANeoDataViaAPI(neoInputState, setAllNEOsArray, setErrorMessage)

    }

    function getNeoDetails(props) {

        console.dir(props)

    }

        // Only show top 10 results
/*    const pagination = usePagination(allNEOsArray, {
        state: {
            page: 0,
            size: 2,
        },
        })
*/
    function NEOElementsToRender() {

        console.log("   IN function NEOElementsToRender")

        const dateNEOsArray = allNEOsArray.near_earth_objects

        let allNEOsSortedToRender = []

        if (dateNEOsArray !== undefined) {
            console.log("                 (dateNEOsArray !== undefined)")

            console.log('\n   SORT Starting sort of NEO date via a.closest_approach_date_full.\n')

            dateNEOsArray.sort((a, b) => {
                const a_closest_approach_date_full = new Date(a.closest_approach_date_full)
                const b_closest_approach_date_full = new Date(b.closest_approach_date_full)

                // Sort by Closest Approach Date Full (Full has military time of day)
                return a_closest_approach_date_full.getTime() - b_closest_approach_date_full.getTime()

                // Sort by Miss Distance in Miles
                // return a.cad_miss_distance_miles - b.cad_miss_distance_miles

                // Sort by Relative Velocity in Miles per hour
                // return a.cad_relative_velocity_miles_per_hour - b.cad_relative_velocity_miles_per_hour

                // Sort by Diameter Max in Feet
                // return a.est_diameter_feet_est_diameter_max - b.est_diameter_feet_est_diameter_max
            })

            allNEOsSortedToRender = dateNEOsArray.map((neo) => {

                let classString
                (neo.is_potentially_hazardous_asteroid === true) ? classString = "text-danger py-1" : classString = "text-success py-1"

                return (
                    <tr className={classString}>
                        <td className={classString}>{neo.id}</td>
                        <td className={classString} xl={3}>{neo.name}</td>
                        <td className={classString}>{neo.is_potentially_hazardous_asteroid === true ? "*** NEO is Potentially Hazardous ***" : "NEO is Not Hazardous"}</td>
                        <td className={classString} xl={3}>Diameter {formatFloatToString(neo.est_diameter_feet_est_diameter_max)} Feet</td>
                        <td className={classString} xs={5}>{neo.closest_approach_date_full}</td>
                        <td className={classString} xs={5}>{formatFloatToString(+(neo.cad_relative_velocity_miles_per_hour))} Mi/Hr</td>
                        <td className={classString}>{neo.cad_orbiting_body} by {formatFloatToString(+(neo.cad_miss_distance_miles))} Miles</td>
                        <td className="pt-1" >
                            <button
                                onClick={() => getNeoDetails(neo.links_self)}
                                key={neo.id}
                                variant="outline-danger"
                                className=""
                                >NEO Details
                            </button>
                        </td>
                    </tr>
                )
            })

        }
        else {

            console.warn(`Returning this to Table Render <PageItem>No NASA NEOs for Date ${neoInputState.dateNeoSearchStart} to ${neoInputState.dateNeoSearchEnd}</PageItem>`)

            // 3/13/22 This does return proper React JSX, but when I put inside array ["<PageItem>etc."] it didn't return properly.
            allNEOsSortedToRender = (<PageItem>No NASA NEOs for Date {neoInputState.dateNeoSearchStart} to {neoInputState.dateNeoSearchEnd}</PageItem>)
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
                        <Form.Group controlId="formNeoDistance">
                            <Form.Label>NEO Distance in Miles</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="NEO Distance Miles"

                                onChange={handleChange}
                                name="neoDistanceKM"
                                value={neoInputState.neoDistanceKM} // This "value={}" is how to impliment React controlled components
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div class="d-flex flex-row">
                    
                    <Button
                        onClick={startNEOSearch}
                        size="sm"
                        variant="primary"
                        className="mx-5 p-2 my-1"
                        spacing="15"
                    >
                        <Spinner
                        display="none"
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                        Search 3 for NEOs
                    </Button>
                    <Button
                        onClick={clearLocalStorage}
                        size="sm"
                        variant="primary"
                        className="mx-5 p-2 my-1"
                        spacing="15"
                    >
                        Clear Local Storage
                    </Button>
                    { (errorMessage.responseStatus === 400 ) &&
                       <h3 className="error"> API Error Message ({errorMessage.responseStatus}) Type ({ errorMessage.responseType }) Error Message ({ errorMessage.responseStatusText }) </h3> }
                    
                </div>

            </Form>
            <Container>
                <Table striped bordered hover border={2} className="px-1">
                    <thead>
                        <tr>
                            <th>NEO ID</th>
                            <th>NEO Name</th>
                            <th>Is NEO Hazardous?</th>
                            <th>Diameter</th>
                            <th>Closest Approach on:</th>
                            <th>Relative Velocity:</th>
                            <th>Distance Missed from Body:</th>
                            <th>NEO Details</th>
                       </tr>
                    </thead>
                    <tbody>
                        {NEOElementsToRender()}
                    </tbody>
                </Table>
            </Container>

        </Card>
    )
}