

import React, { useState, useEffect } from 'react';
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
import { CSSTransition } from 'react-transition-group';



import {VictoryChart, VictoryBar, VictoryTooltip, VictoryPie, VictoryVoronoiContainer, VictoryLabel, VictoryTheme, VictoryArea, VictoryAxis} from 'victory';
// import Accordian from './accordian.jsx'
import './App.scss';

import  ControlAccordion from './control-accordion.jsx';

function countStops (index, arr, sum) {

    sum += arr[index].stops

        if (index != 0 ){
        return countStops(index - 1, arr, sum )
        }

    return sum
};

function ControlPanel (props) {

  const { timingData } = props;
  const { searchErrorAlert, setSearchErrorAlert } = props.controlProps;
  const [accordionActive, setAccordionActive] = useState(false);
  
  // console.log(timingData.map((item) => item.data.filter((nums) => nums.time < 5)).map((x) => x.length))

  const amenities = props.transportCl.filter((place) => (!!place.tags.leisure))
  const transport = props.transportCl.filter((place) => (!!place.tags.public_transport))
  const neighbourhood = props.transportCl.filter(data => (!!data.tags.amenity) || (!!data.tags.shop))

  const times = timingData.length > 0 ? 

    timingData.map((item) => item.data.filter((nums) => nums.time < 15)).map((x) => countStops(x.length - 1, x, 0)) : 

    1

  // console.log(timingData[times.indexOf(7)].stop)

  // Need to learn how to use reducer functions so I can easily create 'key indicators' from the transportCl data! 

  // const ACC = Math.round(countStops(timingData.filter(item => item.time < 15).length - 1, timingData, 0) * 100 / 272)
  const max = timingData.length > 0 ? Math.max(...times) : null
  const stationName = timingData.length > 0 ? timingData[times.indexOf(Math.max(...times))].name : null

  const ACC = Math.round(max * 100 / 272)


  const keyText = [
    // {text: `From ${((props.transportCl.length > 0) ? stationName + ', ': ', ')}` + ((ACC < 30) ? "only ":"") + ACC  + '%' + ' of the city is accessible within 15 minutes', pass: ACC >= 30}, 
    {text: timingData.length > 0 ? `From ${stationName} ` + ((ACC < 30) ? "only ":"") + ACC  + '%' + ' of the city is accessible within 15 minutes' : 'There is limited access to reliable pulic transport in the surrounding area', pass: ACC >= 30}, 
    {text: neighbourhood.length > 20 ? 'There are a range of shops, supermarkets, and restaurants within the surrounding area' : 'There is limited access to shops, supermarkets, and restaurants within the surrounding area', pass: neighbourhood.length > 20}, 
    {text: (amenities.length > 0) && true ? `There is public green space in the surrounding area` : "Our data indicated that there are limited open, green spaces in the surrounding area" , pass: amenities.length > 0}];

  return (


      <Container className= {props.transportCl.length > 0 ? 'control shadow' : 'control'} style={{padding: 0, backgroundColor: props.transportCl.length > 0 ? "white" : ""}}> 
     {/*<Container className= {props.transportCl.length > 0 ? 'control shadow' : 'control'} style={{padding: 0, backgroundColor: "white"}}> */}
          <div className = ''>
          <form onSubmit = {(event) => {event.preventDefault(); props.updateMap(event); setAccordionActive(false)}} className='searchBar shadow' > 
            <Stack direction='horizontal' gap={3}>
            <GetInput input = {props.input} handleChange = {props.handleChange}/>
            <Button variant='outline-dark-custom btn-sm' type="submit" style={{borderRadius: '10', width: '77px'}}>

            {!props.isLoading && <span>Search</span>}
            {props.isLoading && <span class ="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}

            </Button>
            </Stack>
           </form> 
           <CSSTransition
           in={searchErrorAlert}
           timeout={500}
           classNames="my-node"
           unmountOnExit
           >
           <Row center style={{backgroundColor: "#880808", width:"100%", marginLeft: "0px", borderRadius: "5px", width:"100%"}}> 
           <span style={{color:"white", width:"100%",fontWeight:"bold", fontSize:"12px"}}>Currently we only support locations in London.</span>
           </Row > 
           </CSSTransition>
           
           
           </div>

           <CSSTransition
           in={(!props.isLoading)}
           timeout={10000}
           classNames="accor"
           unmountOnExit
           >
           

            
            <div style={{overflow: 'hidden'}}>
            {(!(props.transportCl.length === 0))&& 
            
            <div> 
            <Row className = "knh" style={{ 
              paddingTop:'35px', paddingLeft:'25px',
            paddingBottom:'10px', width:'100%', lineHeight:'20px'
          }} hidden={accordionActive}>

            

            

              {keyText.map((item) => 
              
                              <KeyNeighbourhoodIndicators text = {item.text} pass = {item.pass}/>

                            )}
            

              </Row>

              <Col>
             
              


              {/*{(!props.isLoading && !(props.transportCl.length == 0)) && <ControlAccordion timingData={props.timingData} stations = {props.transportCl} setMarkers = {props.setMarkers}/>}*/}

              <ControlAccordion {...props} 
              transport = {transport} 
              amenities = {amenities} 
              neighbourhood= {neighbourhood} 
              stations = {props.transportCl}  
              setAccordionActive={setAccordionActive}
              />

              </Col>
            </div>}
            </div>
           
           </CSSTransition>

            

          
        
      </Container> 


  )

}



function KeyNeighbourhoodIndicators (props) {

  return (

      <Container fluid style={{marginBottom:'4px'}}>
        
          <Row>
        
              <Col md ='auto' > { <img src={'static/boolean/' + ((props.pass) ? 'check' : 'cross') +'.png' } height='15px' width = '15px' /> } </Col>
              <Col > <span style={{fontSize: 12}}> {props.text} </span> </Col>
              {/*<Col md ='auto'> <span style={{fontSize: 9}}> {(Math.round(school.distance * 100) / 100).toFixed(2) + ' km'} </span> </Col>*/}
        
          </Row> 
      
      </Container>
);
}


function GetInput (props) {

  return (

      <div>
        <input
          placeHolder='Address or Postcode'
          className='search'
          ref={props.input}
          // onChange={this.props.handleChange}
          // defaultValue= 'Postcode, Location, or Place!'
          style={{height: '31px', paddingLeft: '10px', marginLeft: '0px', fontSize: '15px'}}/>
      </div>
);
}



// class GetInput extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <div>
//         <input
//           placeHolder='Address or Postcode'
//           className='search'
//           ref={this.props.inputRef}
//           // onChange={this.props.handleChange}
//           // defaultValue= 'Postcode, Location, or Place!'
//           style={{height: '31px', paddingLeft: '10px', marginLeft: '0px', fontSize: '15px'}}/>
//       </div>
//     );
//   }
// };

export default ControlPanel;