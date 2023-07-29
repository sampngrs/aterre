

import React, { useState, useEffect, useRef } from 'react';
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
import { CSSTransition } from 'react-transition-group';
import DataSelector from './DataSelector.jsx'
import  Paginate from './Paginate.jsx';
import Portrait from './Portrait';

import Grid from './Grid';
import GridItem from './GridItem';
import './Grid.css'

import _ from 'lodash';

import chroma from 'chroma-js';

import { ResponsiveContainer, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area, 
  AreaChart, 
  Legend, 
  Line, 
  LineChart, 
  Chart, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

import {VictoryChart, VictoryBar, VictoryTooltip, VictoryPie, VictoryVoronoiContainer, VictoryLabel, VictoryTheme, VictoryArea, VictoryAxis, VictoryStack, Data} from 'victory';
// import Accordian from './accordian.jsx'

import './App.scss';
import MultiSelector from './MultiSelector';

function ControlAccordion(props){
  const scrollRef = useRef(null)
  const executeScroll = () => {
    setTimeout(() => {
      scrollRef.current.scrollIntoView({behavior: "smooth", inline:'start'})   
      }, 200)
  }
   
  const { timingData } = props; 
  const { stations } = props;
  const { crimeData } = props

  const reformat = {}
  

  const [filteredFood, setFilteredFood] = useState('bar;biergarten;cafe;fast_food;food_court;ice_cream;pub;restaurant'.split(';'))
  const categories = [... new Set(props.stations.filter((cat) => (!!cat.tags.amenity) || (!!cat.tags.shop)).map((cat) => (cat.tags.amenity) ? cat.tags.amenity : cat.tags.shop))].sort()
  
  const tab_names = 
  [{name: 'Food', data: props.stations.filter(data => (!!data.tags.amenity) && (filteredFood.includes(data.tags.amenity))).sort((a,b) => a.distance - b.distance ), image: 'amenity'}, 
    {name: 'Schools', data: props.stations.filter(data => (!!data.tags.amenity) && (['university', 'school'].includes(data.tags.amenity))).sort((a,b) => a.distance - b.distance ), image: 'school' }, 
    {name: 'Supermarkets', data: props.stations.filter(data => (['convenience', 'supermarket'].includes(data.tags.shop))).sort((a,b) => a.distance - b.distance ), image: 'shop' }];

  const [activeTab, setActiveTab] = useState('Food')





  useEffect(() => {

    if(filteredFood){
      // props.setMarkers(tab_names.filter((data) => data.name == activeTab).pop().data)  
    }

  }, [filteredFood]);


  const lines_disp = props.stations.filter(data => (!!data.tags.public_transport)).sort((a,b) => a.distance - b.distance ).map((item) => 
    <TransportItem data = {item} map = {props.map}/>
      // console.log(item.tags)
    );
  let categoryPosts;
  let data;

   categoryPosts = props.stations.filter(data => (!!data.tags.amenity) && ('bar;biergarten;cafe;fast_food;food_court;ice_cream;pub;restaurant'.split(';').includes(data.tags.amenity))).reduce((acc, post) => {
    let {tags: {name}} = post;
    let {tags: {amenity}} = post;
    return {...acc, [amenity]: [...(acc[amenity] || []), name]};
  }, {});


  for (const property in categoryPosts) {
    categoryPosts[property] = categoryPosts[property].length

  }

   data = [];
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

    let colourScale = chroma.scale(['darkblue','lightblue']).mode('lch').colors(6)

  const neighbourhoodTabs = tab_names.map((item) =>

    <Tab className="pillTab" tabClassName="square rounded-1" eventKey={item.name} style={{borderRadius:'0'}} title={item.name} fill onEnter={() => (setActiveTab(item.name), props.setMarkers(item.data), setFilteredFood(data.map((item) => item.x)))}>


{item.name == 'Food' ? 
    <div style = {{ width: '100%'}}>

    <br/>
    
    <PieChart width={280} height={200}>
          <Pie
            dataKey="y"
            isAnimationActive={false}
            data={data.sort((b,a) => a.y - b.y )}
            cx="50%"
            cy="50%"
            innerRadius={50}
            labelLine={false}
            label = {<CustomLabel active={true} />}
            >

              {
            data.sort((b,a) => a.y - b.y ).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={filteredFood.includes(entry.x) ? colourScale[index] : 'grey'} style={{outline: 'none'}} onClick={(e) => setFilteredFood(arrayTest(filteredFood, entry.x))}
              />
            ))
          }

            </Pie> 
          {/* <Tooltip /> */}
        </PieChart>

   
     </div> : null} 
    {item.data.length > 0 ? 
      <div> 
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
      ) : null} /> </div> : 

      <span style = {{fontSize: 12, color:'grey'}} className ='centered'> Sorry, our data indicates that there are no {item.name == "Food" ? item.name.toLowerCase() + ' options' : item.name.toLowerCase()} in the surrounding area. </span>
      
    }

    </Tab>
    );

  let timer;

  const [selCat, setSelCat] = useState(null)

  let scale = timingData[0] ? chroma.scale(['#373B44', '#4286f4']).mode('lch').colors(Object.values(timingData[0].data.legend).length > 0 ? Object.values(timingData[0].data.legend).length : 2) : null;

  return (
   <Accordion className="controlAccordion" flush>
   <Accordion.Item eventKey="0" isDisabled>

   <AccordionButton disabled = {!(props.transport.length > 0)} /*style={{backgroundColor:'whitesmoke'}}*/ className="accordion-button-disabled">
   <img src='static/delivery.png' height='20px' width = '20px' />
   <span style ={{paddingLeft:'20px'}}> Transportation </span>
   </AccordionButton>
   

   {props.transport.length > 0 ? 

   <Accordion.Body onExit = {() => (props.setMarkers([]), props.setAccordionActive(false))} onEntering = {() => (props.setMarkers(props.stations.filter(data => (!!data.tags.public_transport))),props.setAccordionActive(true))}>
        {/*{(this.props.stations.length > 0) && <p style = {{fontSize: 15}}> From this location, you could reach a total of {this.props.stations.length} different stations and {lines.length} different lines. </p> }*/}

   <div style={{position:'relative', width: '100%',  paddingBottom:5, paddingLeft: 0}}> 
   <div className = 'centered' style ={{position: 'absolute', width:'100%', height:'90%'}}> 
   {timingData.length == 0 ?
    <span style = {{fontSize: 12, color:'black', zIndex:1, opacity:0.5}} className ='centered'> Sorry, our transport timing data <br /> currently only works with the <br /> Underground and DLR services. </span> : null }

    </div>  
    <Portrait scale={['#373B44', '#4286f4']} crimeData = {[timingData[0]]} stroke = ' '>
      
          <XAxis 
          dataKey="x" 
          tickFormatter={(t) => t + "'" } 
          allowDuplicatedCategory={true} 
          height={20} 
          tick={{fill: 'currentColor', fontSize: 9}} />

          <YAxis 
          tickSize={3} 
          tick={{fill: 'currentColor', fontSize: 9}}
          tickFormatter={(t) => t} 
          width={30}/>

           

      <CartesianGrid strokeDasharray="3 3" />

      </Portrait> 




  {/* <Portrait color='blue' crimeData = {timingData} /> */}


   


  
  </div> 
  <div   
  // onMouseEnter={() => (console.log('hello'), clearTimeout(timer))}
  // onMouseLeave={() => 
  //    {timer = setTimeout(() => {
  //           console.log('goodbye')
  //          }, 1000)}
  //   }
  style={{}}
    >
    <Paginate items = {lines_disp} length = {4}/>
  
  </div>
  </Accordion.Body>

  : null

   }
   
  </Accordion.Item>
  <Accordion.Item eventKey="1">
  <Accordion.Header>
  <img src='static/city.png' height='20px' width = '20px' />
  <t style ={{paddingLeft:'20px'}}> Indicators and POIs </t>
  </Accordion.Header>
  <Accordion.Body onExit = {() => (props.setMarkers([]), props.setAccordionActive(false))} onEntering={() => (props.setMarkers(tab_names.filter((data) => data.name == activeTab).pop().data)

    ,props.setAccordionActive(true)

    )}>


<div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
  {/*

  Create a 'portrait' element, which creates a title bar and graph instance. 

  */}

  <Portrait color='red' crimeData = {props.crimeData} stack={true}>

          <XAxis 
          dataKey="x" 
          allowDuplicatedCategory={false} 
          height={20} 
          tickFormatter={(t) => "'" + (t.getFullYear() % 100 >= 10 ? t.getFullYear() % 100 : "0" + t.getFullYear() % 100) } 
          tick={{fill: 'currentColor', fontSize: 9}} />

          <YAxis 
          tickSize={3} 
          tick={{fill: 'currentColor', fontSize: 9}} 
          tickFormatter={(t) => t > 1000 ? t/1000 + 'k' : t} 
          width={30}/>

          <CartesianGrid strokeDasharray="3 3" />

    
    </Portrait> 

  


  {/* <Tabs unmountOnExit activeTab={activeTab} variant="pills" justify style={{fontSize: 10, borderRadius: 5}}>

  {neighbourhoodTabs}

  </Tabs> */}

  <div
  style={{
      backgroundColor: 'lightgrey',
      width:'85%',
      height: 1
  }}
  />
  {



  (selCat) 
  
  ? 
  
  <div style={{width:'100%', zIndex:1}} >
    <div style={{overflow:'visible', display:'flex', alignItems:'center', marginBottom:'10px'}}> 
    <div className='hideScrollbar' style={{padding:'5px 0px 5px 0px', marginLeft:'10px', display:'flex', width:'100%', whiteSpace:'nowrap', overflowX:'scroll', overflowY:'hidden'}} >
    {categories.map((cat) =>  <t ref={cat == selCat ? scrollRef : null} className ={ cat == selCat ? 'bshadow' : 'ListItem'} style={{fontSize:'14px', cursor:'pointer', borderRadius:'3px', margin:'5px', padding:'5px 10px 5px 10px', color: cat == selCat ?  'white': 'black', backgroundColor: cat == selCat ? 'black' : ''}} onClick={() => (setSelCat(cat), executeScroll())}>{_.startCase(cat)}</t> )}
    </div>
    {/* <b style={{margin:'5px', borderRadius:'3px', padding: '5px'}}> X </b>  */}
    <img style={{cursor:'pointer', margin: '10px'}} src={'static/UI/close.svg'} height={'15px'} width = {'15px'} onClick={() => setSelCat(null)}/>
    </div>
  
  {/* <p style={{width:'100%', textAlign:'center'}}onClick={() => setSelCat(null)}>{_.startCase(selCat)}</p>  */}

<Paginate items=
    {
    stations.filter(data => data.tags.amenity == selCat || data.tags.shop == selCat).map((school) => 

    <div style={{
      display:'flex',
      margin:'10px 15px 10px 15px', 
      flexDirection:'row',
      alignItems:'flex-start',
      gap:'10px'}}> 

          {/* <img src={'static/amenity/' + selCat +'.svg' } height='15px' width = '15px' /> */}

          
          <div style={{
          display:'flex',
          flexDirection:'column',
          flexGrow:'4'}}>
          
              <div style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between',
              flexDirection:'row'}}>
                
                <span style={{fontSize: 11, fontWeight:'bold'}}> {school.tags.name} </span>  
                <span style={{fontSize: 9, flex: '0 0 auto'}}> {(Math.round(school.distance * 100) / 100).toFixed(2) + ' km'} </span>

              </div> 
              
              <div className='shrinks-child' style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'flex-start',
              flexDirection:'row'}}>
                
                
                  {(school.tags['addr:housenumber']) ? 
                  <span style={{fontSize: 9, whiteSpace:'nowrap', textOverflow:'ellipsis'}}>
                  
                  {`${school.tags['addr:housenumber']}, ${_.startCase(_.toLower(school.tags['addr:street']))}`} 
                  
                  </span> : null
                }

                {(school.tags.cuisine && school.tags['addr:housenumber']) ? 
                  <span style={{margin:'0px 5px 0px 5px', fontSize: 9}}>
                  
                  {`·`} 
                  
                  </span> : null
                }

                {(school.tags.cuisine) ? 
                  <span style={{fontSize: 9}}>
                  
                  {`${_.startCase(_.startCase(school.tags.cuisine))}`} 
                  
                  </span> : null
                }

                

              </div> 

          </div> 

    </div> 

    

    )} />
    
  </div>
  
  
  : 

  <Grid>
    {categories.map((item) =>
      <GridItem key={item} category={item} onClick={setSelCat} scroll={executeScroll}>
        {/* <img style={{fill:'white', color:'white'}} src={'static/amenity/' + item +'.svg'} height='25px' width = '25px' fill='white' color='white'/> */}
        <div style={{display:'flex', flexDirection:'column', textAlign:'center', alignItems:'center', gap:'5px', justifyContent:'center'}}>
        <svg style={{height:'20px', width:'20px'}}>
          <use href={'static/amenity/' + item +'.svg#' + item }></use>
        </svg>
        <span style={{fontSize:'8px'}}>{_.startCase(item)}</span>
        </div>
        
      </GridItem>
    )}
  </Grid>

  }

  </div>
  </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
  <Accordion.Header>
  <img src='static/bench.png' height='20px' width = '20px' />
  <t style ={{paddingLeft:'20px'}}> Parks and Green Space</t>
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


function CustomLabel (props) {
  const { payload: {payload} } = props 
  const name = payload.x
  const { x, y } = props;
  const imgHeight = 15;
  const imgWidth = 15;
  const padding = (-10);
  return (

    <image
      href = {('static/' + 'amenity' + '/' + name + '.png')}
      height={imgHeight}
      width={imgWidth}
      x={x - imgWidth / 2}
      y={y - imgHeight - padding}
     />
     
    );
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

function arrayTest(array, item) {
  return (array.includes(item) ? array.filter(x => x !== item) : array.concat(item))
}

function TransportItem(props) {
  const [showGraph, setShowGraph] = useState(false)


  const data = [
    {
      name: 'Sun',
      entrance: Math.random() * 1000,
      average: 200,
    },
    {
      name: 'Mon',
      entrance: Math.random() * 1500,
      average: 300,
    },
    {
      name: 'Tue',
      entrance: Math.random() * 1800,
      average: 360,
    },
    {
      name: 'Wed',
      entrance: Math.random() * 1900,
      average: 380,
    },
    {
      name: 'Thu',
      entrance: Math.random() * 2000,
      average: 400,
    },
    {
      name: 'Fri',
      entrance: Math.random() * 2200,
      average: 440,
    },
    {
      name: 'Sat',
      entrance: Math.random() * 1200,
      average: 240,
    }
  ];
  
  
  
  
  
  


  const chart = (interval) => (
    <ResponsiveContainer height='100%' width="100%">
      <LineChart data={props.data.crowding} margin={{ right: 0, top: 0 }}>
      <Legend
              verticalAlign="top"
              height={5}
              layout='horizontal'
              align="right"
              iconType="plainline"
              wrapperStyle={{fontSize:10, top:-20, right: -10}}
            />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" interval={interval} tick={{fill: 'white', fontSize: 9}} height={20}/>
        <YAxis interval={interval} tick={{fill: 'white', fontSize: 9}} width={30} />
        <Line name = 'Ridership' type="monotone" dataKey="value" stroke="white" dot={false} />
        <Line name = 'Average' type="monotone" dataKey="mean" stroke="red" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );


  return (

    
    <div style={{marginBottom:'10px'}} 
    // onMouseEnter={() => props.map.flyTo(props.map.getCenter(), 12, {animate:true})}
    // onMouseLeave={() => 
    // setTimeout(() => {
    //    props.map.flyTo(props.map.getCenter(), 16, {animate:true})
    //   }, 1000)
    // }
    
    >


          <CSSTransition
           in={showGraph}
           timeout={200}
           classNames='transportModal'
           unmountOnExit
           >
           
           <div className='bshadow'
            onMouseEnter={()=>setShowGraph(true)}
            onMouseLeave={()=>setShowGraph(false)}
           style={{bottom:'20px',
              display:'flex', 
                padding:'5px',
                flexDirection:'column', 
                gap:'5px', 
                alignItems:'center',
                borderRadius:'3px', 
                position:'absolute', 
                backgroundColor:'black', 
                zIndex:2, 
                width:'280px', 
                height:'150px'}}>
                
              <span style = {{fontSize: 14, paddingLeft:'5px', color:'white', width:'100%'}}> {props.data.tags.name} </span>
                <div style={{width:'95%', height:'75%', borderRadius:'1px'}}>
                {chart('preserveStart')}
                </div>
              </div>
            </CSSTransition>
  

    <div style={{marginTop:'10px', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
      
     <div style ={{display:'flex', flexDirection:'row', alignItems:'center', gap:'10px'}}>
          <span style = {{fontSize: 14, paddingLeft:'5px'}}> {props.data.tags.name} </span>

              
          <div style ={{display:'flex', gap:'10px', alignItems:'center'}}> 
          
                <svg style={{height:'12px', width:'12px', color:'black', transform: `rotate(${props.data.bearing}deg)`}}>

                  <use href={'static/UI/bearing.svg#bearing'}></use>

                </svg>  

                <span style={{fontSize: 8}}> {(Math.round(props.data.distance * 100) / 100).toFixed(2) + ' km'} </span>

              </div> 

          </div>
          {(props.data.crowding)
          ?
          <svg 
          onMouseEnter={()=>setShowGraph(true)}
          onMouseLeave={()=>setShowGraph(false)}
          style={{height:'12px', width:'12px', marginRight:'10px', transform:showGraph ? 'scale(1.2) rotate(45deg)' : ''}}>
                        <use href={'static/UI/plus.svg#plus'}></use>
          </svg>
          :
          null
          }
          
          

    </div>
    {(props.data.tags.line) ? 

    (props.data.tags.line.split(';').map((item) => 
      <div style={{zIndex:1}}> 
      
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