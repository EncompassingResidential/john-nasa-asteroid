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

        console.log(` + + +    Going to loop through dates EVENTUALLY`)
        let loopDate = ""

        // for loop neoInputState.dateNeoSearchStart to neoInputState.dateNeoSearchEnd


        loopDate = "2022-03-01"
        let dateNEOsArray = allNearEarthObjects[loopDate]
        let dateForLoopElements = []

        if (dateNEOsArray !== undefined) {
            dateElementsToRender = dateForLoopElements.concat(dateNEOsArray.map((neo) => {
                return (
                    <Row key={neo.id} className="py-1" >
                        <Col className="px-5" xs={8} >
                        <Card body className="mx-1 my-1" border="success">
                            <Row className="text-success py-1" >
                                <Col>NEO Name {neo.name}</Col>
                                <Col>NEO Absolute Magnitude {neo.absolute_magnitude_h}</Col>
                                <Col>Diameter {formatFloatToString(neo.estimated_diameter.feet.estimated_diameter_max)} Feet</Col>
                            </Row >
                            <Row >
                                <Col 
                                className="text-success py-1">Closest Approach on: {neo.close_approach_data[0].close_approach_date}</Col>
                                <Col xl={4} 
                                className="text-primary py-1">Relative Velocity: {formatFloatToString(+(neo.close_approach_data[0].relative_velocity.miles_per_hour))} Mi/Hr</Col>
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
            dateElementsToRender = dateForLoopElements.concat([`<PageItem>NASA NEOs for Date ${loopDate}</PageItem>`])
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
                            <Form.Label>NEO Distance in Kilometers</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="NEO Distance in KM"

                                onChange={handleChange}
                                name="neoDistanceKM"
                                value={neoInputState.neoDistanceKM} // This "value={}" is how to impliment React controlled components
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Form.Group controlId="formVendor">
                        <Form.Label>Who did you pay?</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Type Who you paid"
                            
                            onChange={handleChange}
                            name="neoNameStr"
                            value={neoInputState.neoNameStr}  // React sometimes will complain that there are un-controlled components if this isn't done.
                        />
                    </Form.Group>
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
                <Table striped responsive="md" variant='dark' border={2} className="px-1">
                    <PageItem>Is this a table element string</PageItem>
                    {NEOElementsToRender()}                  
                </Table>
            </Container>

        </Card>
    )
}