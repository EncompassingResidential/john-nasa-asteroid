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


    async  function startNEOSearch(event) {

        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoInputState.dateNeoSearchStart}&end_date=${neoInputState.dateNeoSearchEnd}&api_key=hk9dlTx899cmJzkwCDyLjxLbI1Apz2qh5IjGT3Ja`);

        if (response.status === 200) {

            console.log(`NASA API response.status is (${response.status})`); // 200
            console.log(`NASA API response.statusText (${response.statusText})`); // OK
    
            const dataNEOsFromNASA = await response.json();

            setAllNEOsArray(prevAllNEOsArray => {
                return [
                { 
                    links               : dataNEOsFromNASA.links,
                    element_count       : dataNEOsFromNASA.element_count,
                    near_earth_objects  : dataNEOsFromNASA.near_earth_objects
                } ]
            })
        }
        else {
            console.warn("NASA NEO HTTP request attempted failed, here is response.text and .statusText");
            console.warn(`(${response.text})`)
            console.warn(`(${response.statusText})`)
        }

    }

    function getNeoDetails(props) {

        console.dir(props)

    }

    function NEOElementsToRender() {
    
        console.log("   IN function NEOElementsToRender")
        const allNearEarthObjects = allNEOsArray[0].near_earth_objects

        let dateElementsToRender = []
        
        const numberOfDays = datesDiffInDays(neoInputState.dateNeoSearchStart, neoInputState.dateNeoSearchEnd)

        console.log(`- - -   numberOfDays is ${numberOfDays} between dates: ${neoInputState.dateNeoSearchStart} AND ${neoInputState.dateNeoSearchEnd} `)

        if (numberOfDays < 0) {

            console.error("Start Date is after End Date")
            return (
                <PageItem>Start Date {neoInputState.dateNeoSearchStart} is after End Date {neoInputState.dateNeoSearchEnd}</PageItem>
                )
        }

        console.log(` + + +    Loop through dates from ${neoInputState.dateNeoSearchStart} to ${neoInputState.dateNeoSearchEnd}`)

        let loopDate = ""
        let dateForLoopElements = []

        for (let loopDaysToAdd = 0; loopDaysToAdd <= numberOfDays; loopDaysToAdd++) {

            /* 
                new Date() is returning GMT time if I pass in "YYYY-MM-DD"  which ends up being -7 hrs for current Pacific Time Zone
                and ends up being the day before.  If I pass in Date("2022-03-29")
                        Date() returns "Mon Mar 28 2022 17:00:00 GMT-0700 (Pacific Daylight Time)"
                If I pass in Date("YYYY-MM-DD 0:00") then 
                        Date() returns "Tue Mar 29 2022 00:00:00 GMT-0700 (Pacific Daylight Time)"
            */
            loopDate = new Date(neoInputState.dateNeoSearchStart + " 0:00")

            loopDate.setDate(loopDate.getDate() + (loopDaysToAdd))

            let loopDateMonthString = ((loopDate.getMonth() + 1 < 10) ? "0" : "") + (loopDate.getMonth() + 1).toString()
            let loopDayOfMonthString = ((loopDate.getDate() < 10) ? "0" : "") + (loopDate.getDate()).toString()

            // 2022-01-03 === YYYY-MM-DD
            const NEODateFormat = loopDate.getFullYear().toString() + '-' +
                loopDateMonthString + '-' +
                loopDayOfMonthString

            console.log(`\n\n  IN FOR LOOP loopDate is (${loopDate.toDateString()}) NEODateFormat = (${NEODateFormat})`)
            let dateNEOsArray = allNearEarthObjects[NEODateFormat]

            if (dateNEOsArray !== undefined) {
                console.log("                 (dateNEOsArray !== undefined)")

                
                dateElementsToRender = dateForLoopElements.concat(dateNEOsArray.map((neo) => {

                    let classString
                    (neo.is_potentially_hazardous_asteroid === true) ? classString = "text-danger py-1" : classString = "text-success py-1"

                    return (
                        <Row key={neo.id} className={(neo.is_potentially_hazardous_asteroid === true) ? "dark" : "text-info py-1"} >
                            <Col className="px-5" xs={8} >
                            <Card body className="mx-1 my-1" border="success">
                                <Row className={classString} >
                                    <Col xl={3}>NEO Name {neo.name}</Col>
                                    <Col >{neo.is_potentially_hazardous_asteroid === true ? "*** NEO is Potentially Hazardous ***" : "NEO is Not Hazardous"}</Col>
                                    <Col xl={3}>Diameter {formatFloatToString(neo.estimated_diameter.feet.estimated_diameter_max)} Feet</Col>
                                </Row >
                                <Row className={classString} >
                                    <Col xs={5}
                                    >Closest Approach on: {neo.close_approach_data[0].close_approach_date}</Col>
                                    <Col xs={5} 
                                    >Relative Velocity: {formatFloatToString(+(neo.close_approach_data[0].relative_velocity.miles_per_hour))} Mi/Hr</Col>
                                </Row>
                                <Row>
                                <Col className={classString}
                                    >Miss Distance from {neo.close_approach_data[0].orbiting_body}: {formatFloatToString(+(neo.close_approach_data[0].miss_distance.miles))} Miles</Col>
                                </Row>
                            </Card>
                            </Col>
                            <Col className="pt-5" >
                                <Button
                                    onClick={() => getNeoDetails(neo.links.self)}
                                    key={neo.id}
                                    variant="outline-danger"
                                    className=""
                                    >Get NEO reference Info<br />{neo.name}
                                </Button>
                            </Col>
                        </Row>
                    )
                })
                )
            }
            else {

                console.warn(`Returning this to Table Render <PageItem>No NASA NEOs for Date ${NEODateFormat}</PageItem>`)

                // 3/13/22 This does return proper React JSX, but when I put inside array ["<PageItem>etc."] it didn't return properly.
                dateElementsToRender = dateForLoopElements.concat(<PageItem>No NASA NEOs for Date {NEODateFormat}</PageItem>)
            }
        
            dateForLoopElements = dateElementsToRender
        }

        return dateElementsToRender

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