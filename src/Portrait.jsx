import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {
  VictoryChart, 
  VictoryTooltip, 
  VictoryVoronoiContainer, 
  VictoryTheme, 
  VictoryArea, 
  VictoryAxis, 
  VictoryStack, 

} from 'victory';

import { getContinuousColour } from './Colours';

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
  Chart
} from 'recharts';


import Button from 'react-bootstrap/Button';
import './App.scss';
import './Animations.scss';

import DataSelector from './DataSelector.jsx'



function Portrait (props) {
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const { crimeData = [] } = props;
    const [fullscreen, setFullscreen] = useState(false)
    
    const { color = 'red' } = props;
    const [activeKey, setActiveKey] = useState(0)

    const [activeData, setActiveData] = useState(null) 
    


    let areaColors = crimeData[activeKey].data.MajorText ? chroma.scale('OrRd').padding([0.4, 0]).colors(Object.values(crimeData[activeKey].data.MajorText).length ) : null;

    useEffect(() => {
      setActiveData((crimeData[activeKey].data.sub_data) ? Object.values(crimeData[activeKey].data.MajorText).map((x, index) => ({'index': index, 'value': x, active: true, 'color': areaColors[index]})) : null)
      console.log('crimeData')
    }, [crimeData, activeKey])

    console.log(crimeData)
    const graph = 

    (activeData) ? 
    <div onClick={() => setFullscreen(!fullscreen)} className='hoverPop' style = {{width: '100%',  paddingBottom:5, paddingLeft: 5, marginTop: 5}}>

        <AreaChart
          data={crimeData[activeKey].data.sub_data}
          margin={{ top: 10, left: 0, right: 10, bottom: 0 }}
          width = {260} height = {200}
        >
          {/*<CartesianGrid strokeDasharray="3 3" />*/}

          <XAxis 
          dataKey="year" 
          allowDuplicatedCategory={false} 
          height={20} 
          tickFormatter={(t) => "'" + (t.getFullYear() % 100 >= 10 ? t.getFullYear() % 100 : "0" + t.getFullYear() % 100) } 
          tick={{fill: 'black', fontSize: 9}} />

          <YAxis 
          tickSize={3} 
          tick={{fill: 'black', fontSize: 9}} 
          tickFormatter={(t) => t > 1000 ? t/1000 + 'k' : t} 
          width={30}/>

          {/*{(crimeData) ? crimeData[0].data.sub_data.map((num, index) => console.log(index)) : null}*/}
          {/* {Object.values(crimeData[activeKey].data.MajorText).map((num, index) => <Area type="linear" name={num} dataKey={`data[${index}]`} stackId='1' fillOpacity={1} stroke = {chroma(areaColors[index]).darken()} fill={areaColors[index]} 
            // fill={`RGB(${ index * 15}, 0, 0)`}
            />)} */}
          {/* {Object.values(activeData.filter((item) => item.active == true)).map((x) => <Area type="linear" name={x.value} dataKey={`data[${x.index}]`} stackId='1' fillOpacity={1} stroke = {chroma(x.color).darken()} fill={x.color} 
            // fill={`RGB(${ index * 15}, 0, 0)`}
            />)} */}

{Object.values(activeData).map((x) => <Area type="linear" name={x.value} dataKey={`data[${x.index}]`} stackId='1' fillOpacity={1} stroke = {chroma(x.color).darken()} fill={x.color} 
            // fill={`RGB(${ index * 15}, 0, 0)`}
            />)}

        {/* <Tooltip />  */}
          
        </AreaChart>
      


      
      
      </div> : null;

return (

			<div style ={{position: 'relative', width:'100%', height:'90%'}}> 

      <DataSelector 
      
      //Should get rid of in future. 
      titles = {crimeData.map((item) => ({'title': item.title, 'id': item.id}))} 

      data = {(activeData) ? crimeData[activeKey] : []}
  
      activeKey = {activeKey} 
      setActiveKey = {setActiveKey} 
      fullscreen = {fullscreen} 
      setFullscreen={setFullscreen}
      children={graph}
      items={(activeData) ? Object.values(crimeData[activeKey].data.MajorText) : []}
      items_obj = {(activeData) ? Object.values(crimeData[activeKey].data.MajorText).map((x, index) => ({'value': x, active: true, 'color': areaColors[index]})) : []}
      setActiveData={setActiveData}
      activeData={activeData}
      />

      {graph}

          </div> 
	);

}


function flatten(data) {
  const Card = (rank, suit) => { return { rank: rank, suit: suit } }
  const Occ = (name, code, major, borough, data) => {return {name: name, 
                                                                    code: code, 
                                                                    major: major, 
                                                                    borough: borough,
                                                                    data: data
                                                                  }}
  
    const result = []
    data.map((obj) => {
      if (result.length > 0 && obj.MajorText == result.slice(-1)[0].major) {
        
        var item = result.splice(-1)[0]
        item.data.forEach((date, index) => {
          // console.log(date.occurence, obj.data[index].occurence)
          date['occurence'] = date.occurence + obj.data[index].occurence
        })
        
        result.push(item)
      } else {
        result.push(Occ(obj.WardName, obj.WardCode, obj.MajorText, obj.BoroughName, obj.data))  
      }

      
    })
    return result
}

export default Portrait;