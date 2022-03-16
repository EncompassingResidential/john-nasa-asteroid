import React from 'react';

import { Button, Card, Col, Container, Form, Modal, PageItem, Row, Table } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'

let initialneoInputState = {
    id: `${Date.now()}`,
    dateNeoSearchStart: Date("1/1/2021"),
    dateNeoSearchEnd: Date("1/10/2021"),
    neoDistanceKM: 0.0
}


export default function NASANeoMainContent() {

    const [neoInputState, setNeoInputState] = React.useState(JSON.parse(localStorage.getItem('neoInputStateStorage')) 
                                                || [] )

    const [allNEOsArray, setAllNEOsArray] = React.useState(JSON.parse(localStorage.getItem('neosArrayStorage'))
                                                || [] )

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

    function convert_to_float(b) {
        // Type conversion of string to float
        var floatValue = +(b);

        return floatValue;
    }

    /* 
    Getting this error message in Console 3/10 to 3/14/22:
    
    Uncaught (in promise) Error: The message port closed before a response was received.

    It happens when the actor just touches the Input fields Event if not changed.  i.e. field gains focus.
    
    When change does happen to input field the Error doesn't occur.
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
        
    }
    
    function formatFloatToString(floatNumber) {

       if (Number.isFinite(floatNumber) === true) {
            const fixedDecimals = floatNumber.toFixed(2)
            const formatedNumber = new Intl.NumberFormat("en-US", {
                style: "decimal",
                currency: "USD"
            }).format(fixedDecimals)

            return(formatedNumber)
        } else {

            return(`Error - $ floatNumber (${floatNumber}) is not number`)
        }
    }

    function datesDiffInDays(firstDateString, secondDateString) {
        const firstDate = new Date(firstDateString);
        const secondDate = new Date(secondDateString);
            
        const millisecondsDiff = secondDate.getTime() - firstDate.getTime();
            
        return ( millisecondsDiff / (1000 * 60 * 60 * 24) )
    }


    function flattenNASANeoData(dataNEOsFromNASA) {

        console.log("   IN function flattenNASANeoData(dataNEOsFromNASA)")

        const allNearEarthObjectsToFlatten_0 = dataNEOsFromNASA.near_earth_objects

        const numberOfDays = datesDiffInDays(neoInputState.dateNeoSearchStart, neoInputState.dateNeoSearchEnd)

        console.log(`- - -   numberOfDays is ${numberOfDays} between dates: ${neoInputState.dateNeoSearchStart} AND ${neoInputState.dateNeoSearchEnd} `)

        let flatAllNEOsArray_1 = []

        if (numberOfDays < 0) {

            console.error("Start Date is after End Date")

            flatAllNEOsArray_1 = [
                {
                    id:                         9999999999,
                    name:                       "End Date is before the Start Date",
                    links_self:                 "https://www.linkedin.com/in/johntritz/",
                    is_potentially_hazardous_asteroid:      false,
                    est_diameter_feet_est_diameter_max:     0,
                    closest_approach_date:                  "1000-01-01",
                    closest_approach_date_full:             "1000-01-01 1:11",
                    cad_relative_velocity_miles_per_hour:   "1.111",
                    cad_orbiting_body:                      "Ego Self",
                    cad_miss_distance_astronomical:         "1.0",
                    cad_miss_distance_kilometers:           "149597870",
                    cad_miss_distance_lunar:                "389",
                    cad_miss_distance_miles:                "92955806"
                }
            ]
            /*
            If do return here, then need to return either Null OR Error Reason OR empty NEO structure
            return (
                <PageItem>Start Date {neoInputState.dateNeoSearchStart} is after End Date {neoInputState.dateNeoSearchEnd}</PageItem>
                )
            */
        }
        else {

            console.log(` + + +    Loop through dates from ${neoInputState.dateNeoSearchStart} to ${neoInputState.dateNeoSearchEnd}`)

            let loopDate = ""
            let flatDateForLoopNEOs_2 = []

            for (let loopDaysToAdd = 0; loopDaysToAdd <= numberOfDays; loopDaysToAdd++) {

                /* 
                    new Date() is returning GMT time if I pass in "YYYY-MM-DD"  which ends up being -7 hrs for current Pacific Time Zone
                    and ends up being the day before.  If I pass in Date("2022-03-29")
                            Date() returns "Mon Mar 28 2022 17:00:00 GMT-0700 (Pacific Daylight Time)"
                    If I pass in Date("YYYY-MM-DD 0:00") then 
                            Date() returns "Tue Mar 29 2022 00:00:00 GMT-0700 (Pacific Daylight Time)"
                */
                loopDate = new Date(neoInputState.dateNeoSearchStart + " 0:00")

                loopDate.setDate(loopDate.getDate() + loopDaysToAdd)

                let loopDateMonthString = ((loopDate.getMonth() + 1 < 10) ? "0" : "") + (loopDate.getMonth() + 1).toString()
                let loopDayOfMonthString = ((loopDate.getDate() < 10) ? "0" : "") + (loopDate.getDate()).toString()

                // 2022-01-03 === YYYY-MM-DD
                const NEODateFormat = loopDate.getFullYear().toString() + '-' +
                    loopDateMonthString + '-' +
                    loopDayOfMonthString

                /*
                 Array from allNEOsArray.[0].near_earth_objects["2022-03-01"][]
                       from allNEOsArray.[0].near_earth_objects["2022-03-02"][]
                       from allNEOsArray.[0].near_earth_objects["2022-03-03"][]
                */
                let flatNEOsArrayForDate_3 = allNearEarthObjectsToFlatten_0[NEODateFormat].map((neoForDate) => {
                    return (
                        {
                            id:                         neoForDate.id,
                            name:                       neoForDate.name,
                            links_self:                 neoForDate.links.self,
                            is_potentially_hazardous_asteroid:      neoForDate.is_potentially_hazardous_asteroid,
                            est_diameter_feet_est_diameter_max:     neoForDate.estimated_diameter.feet.estimated_diameter_max,
                            closest_approach_date:                  neoForDate.close_approach_data[0].close_approach_date,
                            closest_approach_date_full:             neoForDate.close_approach_data[0].close_approach_date_full,
                            cad_relative_velocity_miles_per_hour:   neoForDate.close_approach_data[0].relative_velocity.miles_per_hour,
                            cad_orbiting_body:                      neoForDate.close_approach_data[0].orbiting_body,
                            cad_miss_distance_astronomical:         neoForDate.close_approach_data[0].miss_distance.astronomical,
                            cad_miss_distance_kilometers:           neoForDate.close_approach_data[0].miss_distance.kilometers,
                            cad_miss_distance_lunar:                neoForDate.close_approach_data[0].miss_distance.lunar,
                            cad_miss_distance_miles:                neoForDate.close_approach_data[0].miss_distance.miles
                        }
                    )
    
                })  // .map

                flatAllNEOsArray_1 = flatDateForLoopNEOs_2.concat(flatNEOsArrayForDate_3)

                flatDateForLoopNEOs_2 = flatAllNEOsArray_1

            } // for

        }  // else number Of Days >= 0
        
        return flatAllNEOsArray_1

    }  // function flattenNASANeoData


    async function getNASANeoDataViaAPI() {

        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoInputState.dateNeoSearchStart}&end_date=${neoInputState.dateNeoSearchEnd}&api_key=hk9dlTx899cmJzkwCDyLjxLbI1Apz2qh5IjGT3Ja`);

        if (response.status === 200) {

            console.log(`NASA API response.status is (${response.status})`); // 200
            console.log(`NASA API response.statusText (${response.statusText})`); // OK
    
            const dataNEOsFromNASA = await response.json();

            // Now it is array of all the dataNEOsFromNASA[0].near_earth_objects
            const flattenedNEOData = flattenNASANeoData(dataNEOsFromNASA)

            setAllNEOsArray(prevAllNEOsArray => {
                return { 
                    links               : dataNEOsFromNASA.links,
                    element_count       : dataNEOsFromNASA.element_count,
                    near_earth_objects  : flattenedNEOData
                }
            })
        }
        else {
            console.warn(`NASA NEO HTTP request attempted failed Status Code (${response.status}), here is response.type and .statusText`);
            console.warn(`(${response.type})`)
            console.warn(`(${response.statusText})`)
        }

    }

    function startNEOSearch(event) {

        // Start Spinning Solar System the infamous "Please Wait" gif.

        getNASANeoDataViaAPI()

    }

    function getNeoDetails(props) {

        console.dir(props)

    }


        // Only show top 10 results                
                

    function NEOElementsToRender() {
    
        console.log("   IN function NEOElementsToRender")

        /*
            id:                         neoForDate.id,
            name:                       neoForDate.name,
            links_self:                 neoForDate.links.self,
            is_potentially_hazardous_asteroid:      neoForDate.is_potentially_hazardous_asteroid,
            est_diameter_feet_est_diameter_max:     neoForDate.estimated_diameter.feet.estimated_diameter_max,
            closest_approach_date:                  neoForDate.close_approach_data[0].close_approach_date,
            closest_approach_date_full:             neoForDate.close_approach_data[0].close_approach_date_full,
            cad_relative_velocity_miles_per_hour:   neoForDate.close_approach_data[0].relative_velocity.miles_per_hour,
            cad_orbiting_body:                      neoForDate.close_approach_data[0].orbiting_body,
            cad_miss_distance_astronomical:         neoForDate.close_approach_data[0].miss_distance.astronomical,
            cad_miss_distance_kilometers:           neoForDate.close_approach_data[0].miss_distance.kilometers,
            cad_miss_distance_lunar:                neoForDate.close_approach_data[0].miss_distance.lunar,
            cad_miss_distance_miles:                neoForDate.close_approach_data[0].miss_distance.miles

        */
        const dateNEOsArray = allNEOsArray.near_earth_objects

        console.log('\n   SORT Starting sort of NEO date via a.closest_approach_date_full.\n')

        let allNEOsSortedToRender = []

        if (dateNEOsArray !== undefined) {
            console.log("                 (dateNEOsArray !== undefined)")

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
                    <Row key={neo.id} className={(neo.is_potentially_hazardous_asteroid === true) ? "dark" : "text-info py-1"} >
                        <Col className="px-5" xs={8} >
                        <Card body className="mx-1 my-1" border="success">
                            <Row className={classString} >
                                <Col xl={3}>NEO Name {neo.name}</Col>
                                <Col >{neo.is_potentially_hazardous_asteroid === true ? "*** NEO is Potentially Hazardous ***" : "NEO is Not Hazardous"}</Col>
                                <Col xl={3}>Diameter {formatFloatToString(neo.est_diameter_feet_est_diameter_max)} Feet</Col>
                            </Row >
                            <Row className={classString} >
                                <Col xs={5}
                                >Closest Approach on: {neo.closest_approach_date_full}</Col>
                                <Col xs={5} 
                                >Relative Velocity: {formatFloatToString(+(neo.cad_relative_velocity_miles_per_hour))} Mi/Hr</Col>
                            </Row>
                            <Row>
                            <Col className={classString}
                                >Miss Distance from {neo.cad_orbiting_body}: {formatFloatToString(+(neo.cad_miss_distance_miles))} Miles</Col>
                            </Row>
                        </Card>
                        </Col>
                        <Col className="pt-5" >
                            <Button
                                onClick={() => getNeoDetails(neo.links_self)}
                                key={neo.id}
                                variant="outline-danger"
                                className=""
                                >Get NEO reference Info<br />{neo.name}
                            </Button>
                        </Col>
                    </Row>
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
                <Row>
                </Row>
                
                <Button
                    onClick={startNEOSearch}
                    size="sm"
                    variant="primary"
                    className="mx-5 p-2 my-1"
                    spacing="15"
                >
                    Search for NEOs
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

            </Form>
            <Container>
                <Table responsive="md" border={2} className="px-1">
                    <PageItem>NEO Data Header</PageItem>
                    {NEOElementsToRender()}                  
                </Table>
            </Container>

        </Card>
    )
}