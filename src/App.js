
import './components/nasaNeoApp.css';

import NEO_import_solar_system_image from "./images/JPL Center for Near Earth Object Studies CNEOS - NASA Double Asteroid Redirect Test DART mission 2021-12-06.jpg";


import NASANeoHeader from './components/NASANeoHeader.js'
import NASANeoMainContent from './components/NASANeoMainContent.js'

import { Card } from 'react-bootstrap'

import React from 'react';

let NEO_solar_system_image = "./images/JPL Center for Near Earth Object Studies CNEOS - NASA Double Asteroid Redirect Test DART mission 2021-12-06.jpg";

export default function App() {
  return (
    <Card border="info">
      <div className="container">
      Hello World 8th try {NEO_solar_system_image}
      </div>
      <div style={{ backgroundImage:`url(${NEO_import_solar_system_image})`,backgroundRepeat:"no-repeat" }}>
      CSS World 2nd try {NEO_import_solar_system_image}
    </div>
      <NASANeoHeader />
      <NASANeoMainContent />
    </Card>
  )
}
