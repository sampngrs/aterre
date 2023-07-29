
// This is a test

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvent, useMap, Rectangle, Pane, MarkerClusterGroup} from 'react-leaflet';
import { Icon } from "leaflet";
import logo from './logo.svg';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Stack from 'react-bootstrap/Stack';
import  Nav from 'react-bootstrap/Nav';
import  Navbar from 'react-bootstrap/Navbar';
import * as L from "leaflet";
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { CSSTransition } from 'react-transition-group';


import {VictoryChart, VictoryBar, VictoryTooltip, VictoryPie, VictoryVoronoiContainer, VictoryLabel, VictoryTheme, VictoryArea, VictoryAxis} from 'victory';
// import Accordian from './accordian.jsx'
import './App.scss';

import ControlPanel from './ControlDashboard.jsx'
import About from './About.jsx'





function SetViewOnClick({ animateRef }) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    })
  })

  return null
}

const RecenterAutomatically = ({position, doneLoading}) => {
 const map = useMap();
 if (!doneLoading) {
  // map.flyTo(position, map.getZoom(), {animate:true})
 // 	map.setView(position, map.getZoom(), {
 //  animate: true,
 // })
 }
}




function MainScreen () {

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState([51.500841300000005, -0.14298629208606997]);
  const [transportCl, setTransportCL] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [proximityTr, setProximityTr] = useState([]);
  const [searchErrorAlert, setSearchErrorAlert] = useState(false);
  const [aboutActive, setAboutActive] = useState(false);
  const [crimeData, setCrimeData] = useState([{id:'', title:'', data: []}]);
  const nodeRef = useRef(null);

  const inputRef = useRef();
  const mapRef = useRef();


  const LeafIcon = L.Icon.extend({
    options: {}
  });

  const searchLocation =  new L.Icon({
      iconUrl:
        'static/pins/query.png', 
      iconSize: [30, 48],
      popupAnchor: [2, -40],
      shadowUrl: markerShadow, 
      shadowAnchor: [13,38],
      iconAnchor:   [15, 48] // point of the icon which will correspond to marker's location

    });

  // const resultLocation =  new L.Icon({
  //     iconUrl:
  //       'static/pins/default.png', 
  //     iconSize: [30, 48],
  //     popupAnchor: [2, -40],
  //     shadowUrl: markerShadow, 
  //     shadowAnchor: [13,38],
  //     iconAnchor:   [15, 48]});

      const resultLocation =  new L.Icon({
        iconUrl:
          'static/pins/default.png', 
        iconSize: [30, 48],
        popupAnchor: [2, -40],
        shadowUrl: markerShadow, 
        shadowAnchor: [13,38],
        iconAnchor:   [15, 48]});

  useEffect(() => {

    if ((!!location) && (!!mapRef.current)){
      mapRef.current.flyTo(location, 16, {animate:false})

    }

    fetch('/crime/' + location[0] + '/' + location[1])
    .then((response) => {
        if(!response.ok) throw new Error(response.status);
          else return response.json()
      })
      .then((result) => {
        result.map((dataPoint) => {
              const {data} = dataPoint
              console.log(data.axes.map((d) => "date" in Object.keys(d)))
              data.axes = data.axes.map((d) => ({
                              'x': new Date(d.date.substring(0,4), d.date.substring(4,6)), 
                              'data': d.data
                            })
                            
                            )

        
                })
        
                setCrimeData(result)

        // var data = result.map((dataPoint) => {
        //   dataPoint['data'] = JSON.parse(dataPoint['data']).map((key) => ({
        //   //   'WardName': key.WardName,
        //   // 'WardCode': key.WardCode,
        //   'MajorText': key.MajorText,
        //   // 'MinorText': key.MinorText,
        //   // 'BoroughName': key.LookUp_BoroughName,
        //   // 'data': Object.keys(key).filter((obs) => obs == 'year')
        //   // 'data': Object.keys(key).filter((obs) => !isNaN(obs)).map((point) => ({'date': new Date(point.substring(0,4), point.substring(4,6)), 'occurence': key[point]}))
        //   }))
          



        // })

        // console.log(JSON.parse(result.data))
      //   const data = JSON.parse(result['data'])
      //   const obj = Object.keys(data).map((key) => ({
      //     'WardName': data[key].WardName,
      //     'WardCode': data[key].WardCode,
      //     'MajorText': data[key].MajorText,
      //     'MinorText': data[key].MinorText,
      //     'BoroughName': data[key].LookUp_BoroughName,
      //     'data': Object.keys(data[key]).filter((obs) => !isNaN(obs)).map((point) => ({'date': new Date(point.substring(0,4), point.substring(4,6)), 'occurence': data[key][point]}))
      //   // 'stop': key, 
      //   // 'name': data[key].name,
      //   // 'data': Object.keys(JSON.parse(data[key].data)).map((time) => ({'time': Number(time), 'stops': JSON.parse(data[key].data)[time] }))

      // }))
        // // result['data'] = obj
        // console.log(result)
        
        
        
      

      })


          // 
    }, [location])


  useEffect(() => {
  setProximityTr([])
  const data = transportCl.filter((data) => (!!data.tags.public_transport));

  (data.length > 0) ?  

  
  // fetch('/access/' + data[0].tags['naptan:AtcoCode'])
  fetch('/access/' + data.map((item) => item.tags['naptan:AtcoCode']))
  .then((response) => {
      if(!response.ok) throw new Error(response.status);
        else return response.json()
    })
    .then((data) => {
      // setLocation([data.search.location.lat,data.search.location.lon])
      // console.log(cData)
      // setTransportCL(data.elements)
      // setIsLoading(false)
      console.log(data)
      setProximityTr(data)
      const obj = Object.keys(data).map((key) => ({
        'stop': key, 
        'name': data[key].name,
        'data': Object.keys(JSON.parse(data[key].data)).map((time) => ({'x': Number(time), 'stops': JSON.parse(data[key].data)[time] }))
      }))
      // const arrData = Object.keys(obj).map((key) => [Number(key), obj[key]]);
      // const arrData = Object.keys(obj).map((key) => ({'time': Number(key), 'stops': obj[key]}))
      
    }) : console.log()

  }, [transportCl]); 

  function handleChange(event) {
    // setInput(event.target.value)
    setSearch(event.target.value)
}
  
  function updateMap(event) {
    event.preventDefault()
    setTransportCL([])
    setMarkers([]);
    setIsLoading(true);
    fetch('/time/' + inputRef.current.value)
    .then((response) => {
      if(!response.ok) throw new Error(response.status);
        else return response.json()
    })
    .then((data) => {
      setLocation([data.search.location.lat,data.search.location.lon])

      const cData = data.elements.map((item) => 
        
        {if (item.center) {
          item['lat'] = item.center.lat
          item['lon'] = item.center.lon
          item['distance'] = distance(data.search.location.lat, data.search.location.lon, item.center.lat, item.center.lon )
        } else {

          item['distance'] = distance(data.search.location.lat, data.search.location.lon, item.lat, item.lon )
        }
        
        return item
      }
        

        );
      
      
      setTransportCL(data.elements)
      const myTimeout = setTimeout(() => setIsLoading(false), 1000);
      
    })
    .catch((error) => {
      
      setIsLoading(false)
      setSearchErrorAlert(true)
      setTimeout(() => {
        setSearchErrorAlert(false);
      }, 3000);
        
        
      
    })
      // mapRef.current.setZoom(16)
  }

  const TILEURL = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" // CLean, grey without labels 


  let controlProps = {
    searchErrorAlert, setSearchErrorAlert

  }


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


      {/* <Navbar className='shadow' fixed variant="light" style={{backgroundColor: 'white'}}>
        <Container fluid>
          <Navbar.Brand href="#home"><img src="/static/logo.png" width='60' height ='60' style={{marginLeft: 8}}/></Navbar.Brand>
          <Nav className="auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Insights</Nav.Link>
            <button type="button" class="btn btn-link nav-link" onClick={() => setAboutActive(!aboutActive)}>About</button>
            <div style={{width:'10px', height:'10px', backgroundColor:'black'}}>S</div>
          </Nav>
        </Container>
      </Navbar> */}

      <div className='bshadow' style={{
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0px 20px',
        position:'absolute', backgroundColor:'#FFFFFFBE', height:'90px', width:'100%'}}>
        <img src="/static/logo.png" width='60' height ='60' />
        <div style={{display:'flex', alginItems:'center', gap:'15px'
           }}>
            {/* <span className='textButton' >Home</span> */}
            {/* <span className='textButton' >Insights</span> */}
            <span className='textButton' onClick={() => setAboutActive(!aboutActive)}>About us.</span>

        </div>
      </div>
      
            <About setActive={setAboutActive} active={aboutActive}/>

      

      <ControlPanel 
      map = {mapRef.current} 
      controlProps = {controlProps} 
      searchErrorAlert = {searchErrorAlert} 
      timingData = {proximityTr} 
      updateMap = {updateMap} 
      input={inputRef} 
      handleChange={handleChange} 
      isLoading={isLoading} 
      transportCl={transportCl} 
      setMarkers={setMarkers} 
      crimeData={crimeData}
      />

      <div style={{height:'90px'}}></div>

      <MapContainer ref={mapRef} center = {location} zoom={17} scrollWheelZoom={false} zoomControl ={false}>

        <TileLayer
        url={TILEURL}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <ZoomControl position='topright' />

        <RecenterAutomatically position = {location}/>


        <Pane name="custom-page" style={{ zIndex: 1 }}>
        </Pane>

        {location && transportCl.length > 1 && <Marker
             position={location}
              zIndexOffset={8000} 
             icon={searchLocation}
           >
             <Popup >Your queried location</Popup>
           </Marker>}
            
{!isLoading && markers.map((item) => 
          item.lat ? <Marker
             position={[
               item.lat,
               item.lon
             ]
             }  zIndexOffset={6000} icon={resultLocation}

             // icon = {item.tags.amenity == 'bar' ? searchLocation : searchLocation}
           >
             <Popup>
                <div className='center-all'>
                <img
                src = {('static/' + 'amenity' + '/' + item['tags'].amenity + '.png')}
                height={20}
                width={20}
                style={{marginRight:'10px'}}
                ></img> 

                <span style ={{fontSize:'15px'}}>{item['tags'].name} </span>
                </div>
             </Popup>
           </Marker>
      : null)}

  
        

        

      </MapContainer>



    </div>
    );
}

class CustomLabel extends React.Component {
  render() {
    return (
      <g>
        {/*<VictoryLabel {...this.props}/>*/}
        <VictoryTooltip
          {...this.props}
          x={200} y={250}
          orientation="top"
          pointerLength={0}
          cornerRadius={50}
          flyoutWidth={100}
          flyoutHeight={100}
          flyoutStyle={{ fill: "white" , width:"0px"}}
        />
      </g>
    );
  }
}

CustomLabel.defaultEvents = VictoryTooltip.defaultEvents;



 function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}


// function sumOccurrencesByDate(data) {
  // const result = {};

  // data.forEach((obj) => {
  //   const majorText = obj['MajorText'];
  //   const occurrences = obj['data'];

  //   occurrences.forEach((occurrence) => {
  //     const date = occurrence['date'];
  //     const occurrenceValue = occurrence['occurrence'];

  //     if (!result[date]) {
  //       result[date] = {};
  //     }

  //     if (!result[date][majorText]) {
  //       result[date][majorText] = occurrenceValue;
  //     } else {
  //       result[date][majorText] += occurrenceValue;
  //     }
  //   });
  // });

  // return result;}


export default MainScreen;
