

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvent, useMap, Rectangle, Pane, MarkerClusterGroup} from 'react-leaflet';
import { Icon } from "leaflet";
import logo from './logo.svg';
import Accordion from 'react-bootstrap/Accordion';
import AccordionButton from 'react-bootstrap/AccordionButton';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Stack from 'react-bootstrap/Stack';
import Pagination from 'react-bootstrap/Pagination'

import DataSelector from './DataSelector.jsx'
import  Paginate from './Paginate.jsx';
import Portrait from './Portrait.jsx';


import {VictoryChart, VictoryBar, VictoryTooltip, VictoryPie, VictoryVoronoiContainer, VictoryLabel, VictoryTheme, VictoryArea, VictoryAxis, VictoryStack} from 'victory';
// import Accordian from './accordian.jsx'

import './App.scss';

function ControlAccordion(props){

  const { timingData } = props; 
  const { stations } = props;
  const { crimeData } = props
  
  console.log(crimeData)

  const [filteredFood, setFilteredFood] = useState('bar;biergarten;cafe;fast_food;food_court;ice_cream;pub;restaurant'.split(';'))

  const tab_names = 
  [{name: 'Food', data: props.stations.filter(data => (!!data.tags.amenity) && (filteredFood.includes(data.tags.amenity))).sort((a,b) => a.distance - b.distance ), image: 'amenity'}, 
    {name: 'Schools', data: props.stations.filter(data => (!!data.tags.amenity) && (['university', 'school'].includes(data.tags.amenity))).sort((a,b) => a.distance - b.distance ), image: 'school' }, 
    {name: 'Supermarkets', data: props.stations.filter(data => (['convenience', 'supermarket'].includes(data.tags.shop))).sort((a,b) => a.distance - b.distance ), image: 'shop' }];

// const tab_names = 
//       [{name: 'Food', data: props.stations.filter(data => (!!data.tags.amenity) && (!!data.tags.amenity) && (filteredFood.length == 0 ? 'bar;biergarten;cafe;fast_food;food_court;ice_cream;pub;restaurant'.split(';') : filteredFood).includes(data.tags.amenity)).sort((a,b) => a.distance - b.distance ), image: 'amenity'}, 
//         {name: 'Schools', data: props.stations.filter(data => (!!data.tags.amenity) && (['university', 'school'].includes(data.tags.amenity))).sort((a,b) => a.distance - b.distance ), image: 'school' }, 
//       {name: 'Supermarkets', data: props.stations.filter(data => (['convenience', 'supermarket'].includes(data.tags.shop))).sort((a,b) => a.distance - b.distance ), image: 'shop' }];


  const [activeTab, setActiveTab] = useState('Food')


  useEffect(() => {
    // console.log(activeTab)
  }, [activeTab]);



  useEffect(() => {

    if(filteredFood){
      // props.setMarkers(tab_names.filter((data) => data.name == activeTab).pop().data)  
    }

  }, [filteredFood]);


  const lines_disp = props.stations.filter(data => (!!data.tags.public_transport)).sort((a,b) => a.distance - b.distance ).map((item) => 
    <TransportItem data = {item} map = {props.map}/>
      // console.log(item.tags)
    );

  let categoryPosts = props.stations.filter(data => (!!data.tags.amenity) && ('bar;biergarten;cafe;fast_food;food_court;ice_cream;pub;restaurant'.split(';').includes(data.tags.amenity))).reduce((acc, post) => {
    let {tags: {name}} = post;
    let {tags: {amenity}} = post;
    return {...acc, [amenity]: [...(acc[amenity] || []), name]};
  }, {});


  for (const property in categoryPosts) {
    categoryPosts[property] = categoryPosts[property].length

  }

  let data = [];
  for (const object in categoryPosts) {
    data.push({'x': object, 'y': categoryPosts[object]})
  }

  let active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
      {number}
      </Pagination.Item>,
      );
  }

  let colors = ['black', 'red', 'navy', 'green', "orange", "yellow"];
  
  colors = [
// "#ffffff", 
"#dfdfdf",
"#c0c0c0", 
"#a2a2a2", 
"#858585", 
"#696969", 
"#4e4e4e", 
"#353535", 
"#1e1e1e", 
"#000000"
    ]

  const neighbourhoodTabs = tab_names.map((item) =>

    <Tab eventKey={item.name} title={item.name} fill onEnter={() => (setActiveTab(item.name), props.setMarkers(item.data), setFilteredFood('bar;biergarten;cafe;fast_food;food_court;ice_cream;pub;restaurant'.split(';')))}>

    

    {item.data.length == 0 ? 

    <span style = {{fontSize: 12, color:'grey'}} className ='centered'> Sorry, our data indicates that there are no <br /> {item.name == "Food" ? item.name.toLowerCase() + ' options' : item.name.toLowerCase()} in the surrounding area. </span> :
    
    item.name == 'Food' ? 

    <div style = {{ width: '100%'}}>

    <br/>

    <VictoryPie
    data={data.sort((b,a) => a.y - b.y )}
    colorScale= "blue"
    innerRadius={100}
    labelRadius={180}

    labels={({ datum }) => datum.x}
        //   style={{
        //   data: { fill: ({ datum }) => filteredFood.includes(datum.x) ? "blue" :  "rgb(155, 102," + datum.y * 5 + ')'  }
        // }}
    labelComponent={<CustomLabelComponent active={true} />} padAngle={({ datum }) => 1}
    events={[{
      target: "data",
      eventHandlers: {
        onClick: (e) => {
          return true ? [
          {
            target: "labels",
            mutation: ({ text }) => {

              filteredFood.includes(text) ? setFilteredFood(filteredFood.filter(item => item !== text)) : setFilteredFood(filteredFood.concat([text]))

            }
          }, {
            target: "data",
            mutation: ({ style }) => {
              return style.fill === "#C4c5c6" ? null : { style: { fill: "#C4c5c6" } };
            }
          }
          ] : null;
        }
      }
    }]}
              //  "grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue


    /> </div> : null}

    <br />
    <Paginate items=
    {item.data.length > 0 ? 
    item.data.map((school) => 
     <Container fluid style={{marginBottom:'4px'}}>
     <Row>
     <Col md ='auto' > {item.image ? <img src={'static/' + item.image + '/' + (school.tags.amenity ? school.tags.amenity : school.tags.shop) +'.png' } height='15px' width = '15px' /> : null} </Col>
     <Col > <span style={{fontSize: 11}}> {school.tags.name} </span> </Col>
     <Col md ='auto'> <span style={{fontSize: 9}}> {(Math.round(school.distance * 100) / 100).toFixed(2) + ' km'} </span> </Col>
     </Row> 
     </Container>
     ) : null} />

    </Tab>
    );

  let timer;
  return (
   <Accordion className="controlAccordion" flush >
   <Accordion.Item eventKey="0" isDisabled>

   <AccordionButton disabled = {!(props.transport.length > 0)} /*style={{backgroundColor:'whitesmoke'}}*/ className="accordion-button-disabled">
   <img src='static/delivery.png' height='20px' width = '20px' />
   <span style ={{paddingLeft:'20px'}}> Transportation </span>
   </AccordionButton>
   

   {props.transport.length > 0 ? 

   <Accordion.Body onExit = {() => (props.setMarkers([]), props.setAccordionActive(false))} onEntering = {() => (props.setMarkers(props.stations.filter(data => (!!data.tags.public_transport))),props.setAccordionActive(true))}>
        {/*{(this.props.stations.length > 0) && <p style = {{fontSize: 15}}> From this location, you could reach a total of {this.props.stations.length} different stations and {lines.length} different lines. </p> }*/}

  <DataSelector titles ={[{'title' : 'Travel Time'}]} dropdown = {false}/>
   <div style={{position:'relative'}}> 
   <div className = 'centered' style ={{position: 'absolute', width:'100%', height:'90%'}}> 

   {timingData.length == 0 ?
    <span style = {{fontSize: 12, color:'black', zIndex:1, opacity:0.5}} className ='centered'> Sorry, our transport timing data <br /> currently only works with the <br /> Underground and DLR services. </span> : null }

    </div>  
   <VictoryChart 
   theme={VictoryTheme.material}  width={400} padding={50} 
            // maxDomain={{ x: 65 }}
   >

   {
    timingData.map((node, index) => 
      <VictoryArea data={node.data} x="time" y="stops" style={{ data: { fill: colors[(colors.length - index)] } }}/> 

      )
  }

   {/*<VictoryArea data={timingData[Object.keys(timingData)[1]].data} x="time" y="stops" style={{ data: { fill: "#000000" } }}/>
   <VictoryArea data={timingData[Object.keys(timingData)[0]].data} x="time" y="stops" style={{ data: { fill: "#c43a31" } }}/>*/}


  <VictoryAxis/>
  </VictoryChart>
  
  </div> 
  <div   onMouseEnter={() => (console.log('hello'), clearTimeout(timer))}
  onMouseLeave={() => 
     {timer = setTimeout(() => {
            console.log('goodbye')
           }, 1000)}
    }>
    <Paginate items = {lines_disp} length = {4}/>
  
  </div>
  </Accordion.Body>

  : null

   }
   
  </Accordion.Item>
  <Accordion.Item eventKey="1">
  <Accordion.Header>
  <img src='static/city.png' height='20px' width = '20px' />
  <t style ={{paddingLeft:'20px'}}> Neighborhood </t>
  </Accordion.Header>
  <Accordion.Body onExit = {() => (props.setMarkers([]), props.setAccordionActive(false))} onEntering={() => (props.setMarkers(tab_names.filter((data) => data.name == activeTab).pop().data)

    ,props.setAccordionActive(true)

    )}>

  {/*

  Create a 'portrait' element, which creates a title bar and graph instance. 

  */}

  <Portrait color='red' crimeData = {props.crimeData} /> 

  
  <br/>
  <Tabs unmountOnExit activeTab={activeTab} variant="pills" justify style={{fontSize: 10, borderRadius: 5}}>

  {neighbourhoodTabs}

  </Tabs>


  </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
  <Accordion.Header>
  <img src='static/bench.png' height='20px' width = '20px' />
  <t style ={{paddingLeft:'20px'}}> Amenities </t>
  </Accordion.Header>

  <Accordion.Body onExit = {() => (props.setMarkers([]), props.setAccordionActive(false))} onEntering={() => (props.setMarkers(props.stations.filter(data => (!!data.tags.leisure))), props.setAccordionActive(true))}>
   {/*{console.log(stations.filter((data) => (!!data.tags.leisure)))}*/}

  <Paginate items=

  {stations.filter(data => (!!data.tags.leisure)).map((item) => 
      <Container fluid style={{marginBottom:'4px'}}>
      <Row>
      <Col md ='auto' > <img src={'static/leisure/'+ ((item.tags.leisure === 'pitch') ? item.tags.sport : item.tags.leisure) +'.png'} height='15px' width = '15px' /> </Col>
      <Col > <b style={{fontSize: 11}}> {item.tags.name} </b> <br /><span style={{fontSize: 11}}> {titleCase(item.tags.leisure.replace('_', " "))} </span> </Col>
      <Col md ='auto'> <span style={{fontSize: 9}}> {(Math.round(item.distance * 100) / 100).toFixed(2) + ' km'} </span> </Col>
      </Row> 
      </Container>
    )} />



  

  </Accordion.Body>
  </Accordion.Item>
  </Accordion>

  );

}

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

function CustomLabelComponent (props) {
  const { x, y } = props;
  const imgHeight = 20;
  const imgWidth = 20;
  const padding = (-10);
  return (

    <image
    href = {('static/' + 'amenity' + '/' + props.text + '.png')}
    x={x - imgWidth / 2}
    y={y - imgHeight - padding}
    height={imgHeight}
    width={imgWidth}
    ></image> 

    );
}

function TransportItem(props) {
  return (
    <div style={{marginBottom:'10px'}} 
    // onMouseEnter={() => props.map.flyTo(props.map.getCenter(), 12, {animate:true})}
    // onMouseLeave={() => 
    // setTimeout(() => {
    //    props.map.flyTo(props.map.getCenter(), 16, {animate:true})
    //   }, 1000)
    // }
    >

    <Container fluid style={{paddingLeft:0}}>
    <Row>
    <Col > <span style = {{fontSize: 14}}> {props.data.tags.name} </span>  </Col>
    <Col md ='auto'> <span style={{fontSize: 10}}> {(Math.round(props.data.distance * 100) / 100).toFixed(2) + ' km'} </span> </Col>
    </Row> 
    </Container>

    {(props.data.tags.line) ? 

    (props.data.tags.line.split(';').map((item) => 
      <div> 

      <Container fluid style={{marginBottom:'4px'}}>
      <Row>
      <Col md ='auto' > { <img src={('static/' + 'railway' + '/' + ((props.data.tags.station == 'subway') ? 'subway' : 'station') + '.png')} height='9.76px' width = '12px' />} </Col>
      <Col > <span style={{fontSize: 10}}> {item + ' Line'} </span> </Col>
      </Row> 
      </Container>

      </div> )) 
    :
    (props.data.tags.network) ? 

    (props.data.tags.network.split(';').map((item) => 
      <div> 

      <Container fluid style={{marginBottom:'4px'}}>
      <Row>
      <Col md ='auto' > { <img src={('static/' + 'railway' + '/' + ((props.data.tags.station == 'subway') ? 'subway' : 'station') + '.png')} height='9.76px' width = '12px' />} </Col>
      <Col > <span style={{fontSize: 10}}> {item} </span> </Col>
      </Row> 
      </Container>

      </div> )) : null


  }

  {}
  </div>
  );
}

export default ControlAccordion;