import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {VictoryChart, VictoryBar, VictoryTooltip, VictoryPie, VictoryVoronoiContainer, VictoryLabel, VictoryTheme, VictoryArea, VictoryAxis, VictoryStack} from 'victory';


import Button from 'react-bootstrap/Button';
import './App.scss';
import './Animations.scss';

import DataSelector from './DataSelector.jsx'



function Portrait (props) {
    
    const { crimeData } = props;
    
    const { color = 'red' } = props;
    const [activeKey, setActiveKey] = useState(crimeData[0].id)
    console.log(activeKey)

return (

			<div>

      <DataSelector titles = {crimeData.map((item) => ({'title': item.title, 'id': item.id}))} activeKey = {activeKey} setActiveKey = {setActiveKey}/>

      <VictoryChart 
         theme={VictoryTheme.greyscale}  width={400} padding={40}
                  // maxDomain={{ x: 65 }}
         containerComponent={
          <VictoryVoronoiContainer
          />}
         >
         <VictoryStack colorScale={color}>
         {
          crimeData.filter((item) => item.id == activeKey)[0].data.map((node, index) => 
            <VictoryArea data={node.data} x="date" y="occurence" 
            // labels={node.MajorText} labelComponent={ <VictoryTooltip /> }
            /> 

            )

          // flatten(crimeData[0].data).map((node, index) => 
          //   <VictoryArea data={node.data} x="date" y="occurence"/> 

          //   )
        }

         {/*<VictoryArea data={timingData[Object.keys(timingData)[1]].data} x="time" y="stops" style={{ data: { fill: "#000000" } }}/>
         <VictoryArea data={timingData[Object.keys(timingData)[0]].data} x="time" y="stops" style={{ data: { fill: "#c43a31" } }}/>*/}

        </VictoryStack>
        </VictoryChart>

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