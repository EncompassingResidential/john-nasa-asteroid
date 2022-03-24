import React from 'react'
import { Button, ButtonGroup, Spinner } from 'react-bootstrap'

import { getNASANeoDataViaAPI } from './NASANeoAPICalls.js'

const NASANeoSearchForm = ( { neoInputState, setNeoInputState, allNEOsArray, setAllNEOsArray, neoAppStatus, setNeoAppStatus, tableState, setTableState, pageBackwardThroughRows, pageForwardThroughRows } ) => {

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

        getNASANeoDataViaAPI(neoInputState, setAllNEOsArray, setNeoAppStatus)

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


    return (
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
                    value={tableState.currentFirstRowShowing} // This "value={}" is how to impliment React controlled components
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
                    value={tableState.currentFirstRowShowing} // This "value={}" is how to impliment React controlled components
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
    )
}

export default NASANeoSearchForm