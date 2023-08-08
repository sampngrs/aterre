
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvent, useMap, Rectangle, Pane, MarkerClusterGroup} from 'react-leaflet';
import './App.scss';
import { useEffect } from 'react';

function Map (props) {
  const {coords} = props;
  const {mapRef} = props;

    const tileUrl = `https://{s}.basemaps.cartocdn.com/${props.isDark ? 'dark' : 'light'}_nolabels/{z}/{x}/{y}{r}.png` // CLean, grey without labels 
    
    useEffect(() => {
      // console.log(coords)
      if (mapRef.current) props.mapRef.current.flyTo([coords.latitude, coords.longitude], 16, {animate:true})
    }, [coords])
    
    
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

              <Pane name="custom-page" style={{ zIndex: 1 }}>
              </Pane>


              </MapContainer>

          </div>  
        );
}

export default Map;