
import './components/nasaNeoApp.css';

import NASANeoHeader from './components/NASANeoHeader.js'
import NASANeoInputForm from './components/NASANeoInputForm.js'
import NASANeoMainContent from './components/NASANeoMainContent.js'

import { Card } from 'react-bootstrap'

import React from 'react';

export default function App() {

  const [neoInputState, setNeoInputState] = React.useState(JSON.parse(localStorage.getItem('neoInputStateStorage'))
                                                           || {
                                                            dateNeoSearchStart: "",
                                                            dateNeoSearchEnd: "",
                                                            neoRowsToShow: 10
                                                           } )

  const [allNEOsArray, setAllNEOsArray] = React.useState(JSON.parse(localStorage.getItem('neosArrayStorage'))
                                                        || [] )
           
  const [neoAppStatus, setNeoAppStatus] = React.useState(
      {
          responseStatus:     200,
          responseType:       "",
          responseStatusText: ""
      })

  return (
    <div className='background--div' >
    <Card border="info">
      <NASANeoHeader />
      <NASANeoInputForm neoInputState={neoInputState} setNeoInputState={setNeoInputState} allNEOsArray={allNEOsArray} setAllNEOsArray={setAllNEOsArray} neoAppStatus={neoAppStatus} setNeoAppStatus={setNeoAppStatus} />
      <NASANeoMainContent neoInputState={neoInputState} setNeoInputState={setNeoInputState} allNEOsArray={allNEOsArray} setAllNEOsArray={setAllNEOsArray} neoAppStatus={neoAppStatus} setNeoAppStatus={setNeoAppStatus} />
    </Card>
    </div>
  )
}
