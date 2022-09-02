import React from 'react';
import "./Map.css";
import { MapContainer as LeafletMap, TileLayer, MapContainer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { showDataOnMap } from './utils';


const ChangeMapView = ({coords}) => {
  console.log('view',coords);
  const map = useMap();
  map.setView([coords.lat, coords.lng], map.getZoom());

  return null;
}

function Map({center, zoom, countries, casesType}) {
  // const position = [51.505, -0.09]

  return (
    <div className='map'>
        <LeafletMap center={center} zoom={zoom} scrollWheelZoom={false} >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <ChangeMapView coords={center} />
     {showDataOnMap(countries, casesType)} 
      {/* <Marker> */}
      {/* <Popup> */}
        {/* A pretty CSS3 popup. <br /> Easily customizable. */}
      {/* </Popup> */}
    {/* </Marker>   */}
  </LeafletMap>
    </div>
  )
}

export default Map