
import { MapContainer, TileLayer, Tooltip, Marker, Popup, ZoomControl, useMapEvent, useMap, Rectangle, Pane, MarkerClusterGroup} from 'react-leaflet';
import './App.scss';
import * as L from "leaflet";
import { useEffect } from 'react';
import { renderToString } from 'react-dom/server';

function Map (props) {
  const {coords} = props;
  const {mapRef} = props;
  const {pins} = props;

    const tileUrl = `https://{s}.basemaps.cartocdn.com/${props.isDark ? 'dark' : 'light'}_nolabels/{z}/{x}/{y}{r}.png` // CLean, grey without labels 
    
    useEffect(() => {
      // console.log(coords)
      if (mapRef.current) props.mapRef.current.flyTo([coords.latitude, coords.longitude], 16, {animate:true})
    }, [coords])

    useEffect(() => {
      if (mapRef){

        // For example: 
        // {
        // 'name': 'Pizza Express', 
        // 'type':'restaurant', 
        // 'latitute':'51.1234', 
        // 'longitude':'-0.13245', 
        // 'color':'black'
        // }

          pins.map((e) => {console.log(e)})
      }

  }, [pins])
    
    
    return (
          <div>

              <header>

              {/*Header for the Leaflet Map Rendering*/}

              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
              integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
              crossOrigin=""/>
              <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
              integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
              crossOrigin=""></script>

              </header>

              <MapContainer ref={props.mapRef} center = {props.coords} zoom={17} scrollWheelZoom={false} zoomControl ={false}>

              <TileLayer
              url={tileUrl}
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />

              <ZoomControl position='topright' />

              {/* <Pane name="custom-page" style={{ zIndex: 1 }}>
              </Pane> */}
              {pins.map((e) => 
              <Marker position={[e.latitude, e.longitude]} icon ={L.divIcon({
                html: renderToString(e.icon),
                className: "svg-icon",
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              })}>
              <Tooltip>{e.name}</Tooltip>
              </Marker>)}
              

              {/* Map through pins and add SVG layer for each element*/}


              </MapContainer>

          </div>  
        );
}

export default Map;