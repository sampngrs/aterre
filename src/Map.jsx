
import { MapContainer, TileLayer, Tooltip, Marker, Popup, ZoomControl, useMapEvent, useMap, Rectangle, Pane, MarkerClusterGroup} from 'react-leaflet';
import './App.scss';
import * as L from "leaflet";
import { useEffect, useMemo} from 'react';
import { renderToString } from 'react-dom/server';

function Map (props) {
  const {coords} = props;
  const {setCoords} = props;
  const {mapRef} = props;
  const {pins} = props;

    const tileUrl = `https://{s}.basemaps.cartocdn.com/${props.isDark ? 'dark' : 'light'}_all/{z}/{x}/{y}{r}.png` // CLean, grey without labels 
    
    useEffect(() => {
      if (mapRef.current) props.mapRef.current.flyTo([coords.latitude, coords.longitude], 15, {animate:true})
    }, [coords])

    useEffect(() => {
      // if (mapRef && coords) props.mapRef.current.flyTo([coords.latitude, coords.longitude], 14, {animate:true})
    }, [pins])

    const eventHandlers = useMemo(() => ({
      dragend(e) {
        setCoords({'latitude': e.target.getLatLng()['lat'], 'longitude':e.target.getLatLng()['lng']})
      },
    }), [])
    
    
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

              <MapContainer ref={props.mapRef} center = {coords ? [coords.latitude, coords.longitude] : [51.500841300000005, -0.14298629208606997]} zoom={12} scrollWheelZoom={false} zoomControl ={false}>

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
              })} >
              <Tooltip>{e.name}</Tooltip>
              </Marker>)}

              

              {props.coords ?
              <Marker 
              draggable={true} 
              eventHandlers={eventHandlers}
              position={[coords.latitude, coords.longitude]} icon ={L.divIcon({
                html: renderToString(
                <svg style={{height:'30px', width:'30px'}}>
                  <circle cx="50%" cy="50%" r="45%" fill="red" stroke="none" strokeWidth="2" />
                  <use width="40%" height="40%" x="30%" y="30%" href={'static/UI/search.svg#search'} color="var(--color-background)"/>
                </svg>
                ),
                className: "svg-icon",
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              })}>
              {/* <Tooltip>{e.name}</Tooltip> */}
              </Marker> : null }
              

              {/* Map through pins and add SVG layer for each element*/}


              </MapContainer>

          </div>  
        );
}

export default Map;