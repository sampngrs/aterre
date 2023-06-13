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
  {console.log(props.stroke)}
      
    const { crimeData = [] } = props;
    const [fullscreen, setFullscreen] = useState(false)
    
    const { scale = 'OrRd' } = props;
    const { stack = false} = props;
    const [activeKey, setActiveKey] = useState(0)

    const [activeData, setActiveData] = useState(null) 



    let areaColors = crimeData[activeKey].data.legend ? chroma.scale(scale).mode('lch').padding([0.2, 0]).colors(Object.values(crimeData[activeKey].data.legend).length ) : null;

    useEffect(() => {
      setActiveData((crimeData[activeKey].data.axes) ? Object.values(crimeData[activeKey].data.legend).map((x, index) => ({'index': index, 'value': x, active: true, 'color': areaColors[index]})) : null)
      console.log('crimeData')
    }, [crimeData, activeKey])

    console.log(crimeData)
    const graph = 

    (activeData) ? 
    <div onClick={() => setFullscreen(!fullscreen)} className='hoverPop' style = {{width: '100%',  paddingBottom:5, paddingLeft: 5, marginTop: 5}}>

        <AreaChart
          data={crimeData[activeKey].data.axes}
          margin={{ top: 10, left: 0, right: 10, bottom: 0 }}
          width = {260} height = {200}
        >
          {props.children}


{Object.values(activeData).map((x, i) => 

      <Area type="linear" name={x.value} dataKey={`data[${x.index}]`} stackId= {stack ? '1' : i}
      fillOpacity={1} fill={x.color} 
      stroke = {props.stroke ? props.stroke : chroma(x.color).darken()} 

                  // fill={`RGB(${ index * 15}, 0, 0)`}
                  />)}

          
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
      items={(activeData) ? Object.values(crimeData[activeKey].data.legend) : []}
      items_obj = {(activeData) ? Object.values(crimeData[activeKey].data.legend).map((x, index) => ({'value': x, active: true, 'color': areaColors[index]})) : []}
      setActiveData={setActiveData}
      activeData={activeData}
      stack={stack}
      >
        {props.children}

      </DataSelector>

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
      if (result.length > 0 && obj.legend == result.slice(-1)[0].major) {
        
        var item = result.splice(-1)[0]
        item.data.forEach((date, index) => {
          // console.log(date.occurence, obj.data[index].occurence)
          date['occurence'] = date.occurence + obj.data[index].occurence
        })
        
        result.push(item)
      } else {
        result.push(Occ(obj.WardName, obj.WardCode, obj.legend, obj.BoroughName, obj.data))  
      }

      
    })
    return result
}

export default Portrait;