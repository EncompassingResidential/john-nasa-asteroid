import React, { useState, useEffect } from 'react'

import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'

const NASANeoInputForm = ( { neoInputState, setNeoInputState, allNEOsArray, setAllNEOsArray, neoAppStatus, setNeoAppStatus } ) => {

    React.useEffect( () => {
            localStorage.setItem('neoInputStateStorage', JSON.stringify(neoInputState))
        }, [neoInputState]
    )

    /*
    Getting this error message in the Chrome Console 3/10 to 3/23/22:

    "Uncaught (in promise) Error: The message port closed before a response was received."

    It only occurs on Chrome browser (3/22/22 99.0.4844.74 64 bit) when the actor touches the Input fields even if the field is not changed.
    i.e. the input field gains focus.  When a change does happen to input field, i.e. a character added or deleted the Error doesn't occur.

    Www stated 3/21/22 that it's a known issue between React and Chrom browsers.

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


    return (
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
                            name="dateNeoSearchStart"
                            value={neoInputState.dateNeoSearchStart} // This "value={}" is how to impliment React controlled components

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
                            name="dateNeoSearchEnd"
                            value={neoInputState.dateNeoSearchEnd} // This "value={}" is how to impliment React controlled components

                            />
                    </Form.Group>
                </Col>
                <Col md>
                    <Form.Group controlId="formNeoRowsToShow">
                        <Form.Label>Rows of Data to Show</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Number of Rows to Display"

                            onChange={handleChange}
                            name="neoRowsToShow"
                            value={neoInputState.neoRowsToShow} // This "value={}" is how to impliment React controlled components
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    )
}

export default NASANeoInputForm