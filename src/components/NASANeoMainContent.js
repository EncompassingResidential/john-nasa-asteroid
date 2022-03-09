import React from 'react';

import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'

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

    const [allNEOsArray, setAllNEOsArray] = React.useState(JSON.parse(localStorage.getItem('neosArrayStorage')) || [])

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

        setNeoInputState(prevNEOInputState => {
            return {
                ...prevNEOInputState,
                [name]: value
            }
        })
        
    }
    
    function formatKMtoMiles(neoDistanceKMFloat) {

       if (Number.isFinite(neoDistanceKMFloat) === true) {
            const fixedDecimals = neoDistanceKMFloat.toFixed(2)
            const formatedNumber = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            }).format(fixedDecimals)

            return(formatedNumber)
        } else {

            return("Error - $ neoDistanceKM is not number")
        }
    }

    function printOutArrays() {
        console.log("    function printOutArrays")
        console.log(Date.now() + " \n\nJSON.stringify(neoInputState)")
        console.log(JSON.stringify(neoInputState))
    
        console.log("\nJSON.stringify(allNEOsArray)")
        console.log(JSON.stringify(allNEOsArray))
        console.log()
    }
 
    function startNEOSearch(event) {

        setAllNEOsArray(allNEOsArray => {
            return [
            ...allNEOsArray,
            {
            id: neoInputState.id,
            dateNeoSearchStart: neoInputState.dateNeoSearchStart,
            dateNeoSearchEnd: neoInputState.dateNeoSearchEnd,
            neoDistanceKM: convert_to_float(neoInputState.neoDistanceKM),
            neoNameStr: neoInputState.neoNameStr,
            neoDescription: neoInputState.neoDescription,
            yagni: neoInputState.yagni
            }
        ]
        }
        )

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

    }

    function deleteNeoItem(props) {

        setAllNEOsArray(allNEOsArray => {
            return allNEOsArray.filter( item => 
                { return( item.id !== props ) }
            )
        })

    }

    const NEOElementsToRender = allNEOsArray.map((neo) => {
        return (
            <Row key={neo.id} className="py-1" >
                <Col className="px-5" xs={8} >
                <Card body className="mx-1 my-1" border="success">
                    <Row className="text-success py-1" >
                        <Col>NEO Search Start {neo.dateNeoSearchStart}</Col>
                        <Col>NEO Search End {neo.dateNeoSearchEnd}</Col>
                        <Col>Miles {formatKMtoMiles(neo.neoDistanceKM)}</Col>
                    </Row >
                    <Row >
                        <Col 
                        className="text-success py-1">NEO Name: {neo.neoNameStr}</Col>
                        <Col xl={4} 
                        className="text-primary py-1">NEO Desc: {neo.neoDescription}</Col>
                    </Row>
                    </Card>
                </Col>
                <Col className="pt-5" >
                    <Button
                        onClick={() => deleteNeoItem(neo.id)}
                        key={neo.id}
                        variant="outline-danger"
                        className=""
                        >Delete This NEO reference<br />{formatKMtoMiles(neo.neoDistanceKM).slice(0,11)}
                    </Button>
                </Col>
            </Row>
        )
    })
    
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

            </Form>
            <Table striped responsive="md" variant='dark' border={2} className="px-1">
                {NEOElementsToRender}
            </Table>

        </Card>
    )
}