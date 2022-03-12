
import './components/nasaNeoApp.css';

import NASANeoHeader from './components/NASANeoHeader.js'
import NASANeoMainContent from './components/NASANeoMainContent.js'

import { Card } from 'react-bootstrap'

import React from 'react';

export default function App() {
  return (
    <div className='background--div' >
    <Card border="info">
      <NASANeoHeader />
      <NASANeoMainContent />
    </Card>
    </div>
  )
}
