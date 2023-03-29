import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {VictoryChart, VictoryTooltip, VictoryVoronoiContainer, VictoryTheme, VictoryArea, VictoryAxis, VictoryStack} from 'victory';


import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts';


import Button from 'react-bootstrap/Button';
import './App.scss';
import './Animations.scss';

import DataSelector from './DataSelector.jsx'



function Portrait (props) {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const { crimeData } = props;
    const [fullscreen, setFullscreen] = useState(false)
    
    const { color = 'red' } = props;
    const [activeKey, setActiveKey] = useState(0)

    // useEffect(() => {
    //    if (crimeData.length > 0){
    //     setActiveKey(crimeData[0].id)
    //   }

    // }, [crimeData]);
   
    // const graph = crimeData.length > 0 && activeKey != 0 ? <VictoryChart 
    //      theme={VictoryTheme.greyscale}  height={400} padding={50} 
    //               // maxDomain={{ x: 65 }}
    //      containerComponent={
    //       <VictoryVoronoiContainer


    //       />}
          
    //      >
    //      {/*<VictoryAxis dependentAxis tickFormat={ (t, i) => console.log(t,i)} scale={'linear'} range={[0, 20000]}/>
    //      <VictoryAxis domain={[1900,2000]} scale={'linear'}/>*/}
    //      {/*<VictoryAxis scale={{ x: "data" }} animate ={true} tickFormat={(t) => new Date(t).getMonth() > 4 ? monthNames[new Date(t).getMonth()] : null} />*/}
    //      {/*<VictoryAxis scale={{ x: "data" }} animate ={true} tickFormat={(t) => new Date(t).getMonth() <= 4 ? new Date(t).getFullYear() : null} />*/}
    //      <VictoryStack colorScale={color}>

    //      {
          
    //       crimeData.filter((item) => item.id == activeKey)[0].data.map((node, index) => 
    //         <VictoryArea data={node.data} x="date" y="occurence" 
    //         // labels={node.MajorText} labelComponent={ <VictoryTooltip /> }
    //         /> 

    //         )
    //     }

    //      {/*<VictoryArea data={timingData[Object.keys(timingData)[1]].data} x="time" y="stops" style={{ data: { fill: "#000000" } }}/>
    //      <VictoryArea data={timingData[Object.keys(timingData)[0]].data} x="time" y="stops" style={{ data: { fill: "#c43a31" } }}/>*/}

    //     </VictoryStack>
    //     </VictoryChart> : null;

    console.log(crimeData[0].data[0].data)
    const graph = crimeData.length > 0 && activeKey != 0 ? 
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={crimeData[0].data[0].data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="occurence"/>
          <Tooltip />
          <Area type="monotone" dataKey="occurence" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer> : null;

return (

			<div>

      <DataSelector 
      
      titles = {crimeData.map((item) => ({'title': item.title, 'id': item.id}))} 
      activeKey = {activeKey} 
      setActiveKey = {setActiveKey} 
      fullscreen = {fullscreen} 
      setFullscreen={setFullscreen}
      children={graph}
      
      />

      {graph}

          </div> 
	);

}


function flatten(data) {
  const Card = (rank, suit) => { return { rank: rank, suit: suit } }
  const Occ = (name, code, major, borough, data) => { return {name: name, 
                                                                    code: code, 
                                                                    major: major, 
                                                                    borough: borough,
                                                                    data: data
                                                                  } }
  
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
  //   console.log(result)
  //     data.forEach((obj) => {
  //     if (result.length > 0 && obj.MajorText == result.pop().MajorText) {
  //       console.log('yes')
  //     } else {
  //       console.log('no')
  //       const x = new Object()
  //       x.MajorText = obj.MajorText
  //       result.push(x)
  //       console.log('F')
  //     }

  //   })
  // console.log(result)
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

export default Portrait;