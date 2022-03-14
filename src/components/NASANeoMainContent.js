import React from 'react';

import { Button, Card, Col, Container, Form, Modal, PageItem, Row, Table } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'

let initialneoInputState = {
    id: `${Date.now()}`,
    dateNeoSearchStart: Date("1/1/2021"),
    dateNeoSearchEnd: Date("1/10/2021"),
    neoDistanceKM: 0.0,
    neoNameStr: "",
    neoDescription: "",
    yagni: true
}


export default function NASANeoMainContent() {

    const [neoInputState, setNeoInputState] = React.useState(JSON.parse(localStorage.getItem('neoInputStateStorage')) || [])

    const [allNEOsArray, setAllNEOsArray] = React.useState(JSON.parse(localStorage.getItem('neosArrayStorage')) || 
    [])

console.log("In NASANeoMainContent")

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

            return("Error - $ neoDistanceKM is not number")
        }
    }

    function datesDiffInDays(firstDateString, secondDateString) {
        const firstDate = new Date(firstDateString);
        const secondDate = new Date(secondDateString);
            
        const millisecondsDiff = secondDate.getTime() - firstDate.getTime();
            
        return ( millisecondsDiff / (1000 * 60 * 60 * 24) )
    }

    function printOutArrays() {
        console.log("    function printOutArrays")
        console.log(Date.now() + " \n\nJSON.stringify(neoInputState)")
        console.log(JSON.stringify(neoInputState))
    
        console.log("\nJSON.stringify(allNEOsArray)")
        console.log(JSON.stringify(allNEOsArray))
        console.log()
    }
 
    async  function startNEOSearch(event) {

        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoInputState.dateNeoSearchStart}&end_date=${neoInputState.dateNeoSearchEnd}&api_key=hk9dlTx899cmJzkwCDyLjxLbI1Apz2qh5IjGT3Ja`);

        console.log(response.status); // 200
        console.log(response.statusText); // OK

        if (response.status === 200) {

            const dataNEOsFromNASA = await response.json();

            console.log("About to show data {dataNEOsFromNASA}")
            console.dir({dataNEOsFromNASA}); // show as arrow object
            
            // console.dir(dataNEOsFromNASA !== undefined, "NEO Data from NASA is undefined");

            // console.dir(`dataNEOsFromNASA.length = ${dataNEOsFromNASA.length}`);
            console.dir(`dataNEOsFromNASA.links = ${dataNEOsFromNASA.links}`);
            console.log(`dataNEOsFromNASA.element_count = ${dataNEOsFromNASA.element_count}`);
            
            const tempNEO = dataNEOsFromNASA.near_earth_objects[neoInputState.dateNeoSearchStart]
            // says undefined
            console.log(`dataNEOsFromNASA.near_earth_objects[${neoInputState.dateNeoSearchStart}].length = ${tempNEO.length}`);

            console.log(`next dataNEOsFromNASA.near_earth_objects[${neoInputState.dateNeoSearchStart}]`)
            console.dir({tempNEO})

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
            console.log("NASA NEO HTTP request attempted");
            console.log(response.text)
            console.log(response.statusText)
        }

    /*
        setNeoInputState(prevNEOInputState => {
            return {
                ...prevNEOInputState,
                id: `${Date.now()}`,
                neoDistanceKM: 0.0,
                neoNameStr: "",
                neoDescription: "",
                yagni: true
            }
        })
        */

    }

    function getNeoDetails(props) {

        console.dir(props)

    }

    function NEOElementsToRender() {
    
        console.log("   IN function NEOElementsToRender")
        const allNearEarthObjects = allNEOsArray[0].near_earth_objects
        let dateElementsToRender = []

        const numberOfDays = datesDiffInDays(neoInputState.dateNeoSearchStart, neoInputState.dateNeoSearchEnd)

        console.log(`- - -   numberOfDays between dates: ${neoInputState.dateNeoSearchStart} AND ${neoInputState.dateNeoSearchEnd} is ${numberOfDays}`)
        if (numberOfDays < 0) {

            console.error("Start Date is after End Date")
            return (
                <PageItem>Start Date {neoInputState.dateNeoSearchStart} is after End Date {neoInputState.dateNeoSearchEnd}</PageItem>
                )
        }

        console.log(` + + +    Loop through dates from ${neoInputState.dateNeoSearchStart} to ${neoInputState.dateNeoSearchEnd}`)
        let loopDate

        // for loop neoInputState.dateNeoSearchStart to neoInputState.dateNeoSearchEnd

        let loopDaysToAdd = 1

        loopDate = new Date(neoInputState.dateNeoSearchStart)
        loopDate.setDate(loopDate.getDate() + loopDaysToAdd)

        let loopDateMonthString = ((loopDate.getMonth() + 1 < 10) ? "0" : "") + (loopDate.getMonth() + 1).toString()
        let loopDayOfMonthString = ((loopDate.getDate() < 10) ? "0" : "") + (loopDate.getDate()).toString()

        // 2022-01-03 === YYYY-MM-DD
        const NEODateFormat = loopDate.getFullYear().toString() + '-' +
            loopDateMonthString + '-' +
            loopDayOfMonthString

        console.log(`loopDate is ${loopDate.toDateString()} NEODateFormat = ${NEODateFormat}  && typeof NEODateFormat is ${typeof NEODateFormat}`)
        let dateNEOsArray = allNearEarthObjects[NEODateFormat]
        let dateForLoopElements = []

        if (dateNEOsArray !== undefined) {
            dateElementsToRender = dateForLoopElements.concat(dateNEOsArray.map((neo) => {

                let classString
                (neo.is_potentially_hazardous_asteroid === true) ? classString = "text-danger py-1" : classString = "text-success py-1"

                return (
                    <Row key={neo.id} class={(neo.is_potentially_hazardous_asteroid === true) ? "table-dark" : "text-info py-1"} >
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
            console.warn(`Returning this to Table Render <PageItem>NASA NEOs for Date ${loopDate}</PageItem>`)

            // 3/13/22 This does return proper React JSX, but when I put inside ["<PageItem>etc."] it didn't return properly.
            dateElementsToRender = dateForLoopElements.concat(<PageItem>No NASA NEOs for Date {loopDate}</PageItem>)
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
                <Table responsive="md" class="table-dark" border={2} className="px-1">
                    <PageItem>NEO Data Header</PageItem>
                    {NEOElementsToRender()}                  
                </Table>
            </Container>

        </Card>
    )
}