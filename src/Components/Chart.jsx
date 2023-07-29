import { useState, useRef, useEffect } from "react";
import { ResponsiveContainer, 
    CartesianGrid, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Area, 
    AreaChart, 
    Legend, 
    ReferenceLine,
    Line, 
    Label,
    Text,
    LineChart, 
  } from 'recharts';

import chroma from 'chroma-js';




function Chart(props) {
    const inputRef = useRef()
    const [active, setActive] = useState(false)
    const {height = '300px', width = 'calc(100%)'} = props; 
    const {data} = props
    const { stack = false} = props;
    const {tooltip = false} = props

    const {activeData, setActiveData} = props
    const timeseries = data.data.axes.map((d) => d.x instanceof Date).some((x) => x == true)
    const months = timeseries ? [...new Set(data.data.axes.map((item) => item.x.getMonth()))].length > 1 : null
    
    setTimeout(() => {
      setActive(true)
      }, 2000)

    return (
        <div style = {{width: width, height: height, margin: 0}}>
        <ResponsiveContainer>
        <AreaChart
          data={data.data.axes}
          margin={{ top: 10, left: 0, right: 10, bottom: 0 }}
          width = {'100%'}
        >

          {props.children}
      
            <ReferenceLine x={50} isFront={true} stroke="black"> 
                  <Label dy={0} position="insideTopLeft"  style={{ fontSize: 12, fontWeight: 'bold', fill: 'black' }}>
                  King's Cross St Pancras
                  </Label>
            </ReferenceLine>

            <ReferenceLine x={30} isFront={true} stroke="black"> 
                  <Label dy={15} position="insideTopLeft"  style={{ fontSize: 12, fontWeight: 'bold', fill: 'black' }}>
                  Bank Underground Station
                  </Label>
            </ReferenceLine>
            
            {active && <ReferenceLine x={70} segment={[{y: 0 }, {y: 1 }]} isFront={true} stroke="black"> 
                  <Label dy={30} position="insideTopLeft"  style={{ fontSize: 12, fontWeight: 'bold', fill: 'black' }}>
                  East Acton Underground Station
                  </Label>
            </ReferenceLine>}

          <CartesianGrid strokeDasharray="6" />

          {Object.values(activeData.filter((item) => item.active == true)).map((x, i) => <Area isAnimationActive={!active} type="linear" name={x.value} dataKey={`data[${x.index}]`} stackId= {stack ? '1' : i}
      fillOpacity={1} fill={x.color} 
      stroke = {props.stroke ? props.stroke : chroma(x.color).darken()} 

                  // fill={`RGB(${ index * 15}, 0, 0)`}
                  />)}

      {tooltip && <Tooltip labelFormatter= {timeseries ? (t) => (months && t.toLocaleString('default', { month: 'long' }) + ", " ) + t.getFullYear() : 
        (t) => (t + ' minutes')} 
        
        
        
        allowEscapeViewBox={{ x: true, y: true }} labelStyle={{fontSize:'13px'}} contentStyle={{fontSize:'13px', lineHeight:'13px'}}/>}
        </AreaChart>
        </ResponsiveContainer>
        </div> 
    );
}

function TransportLabel(props) {
    console.log(props)
    const {x, y, stroke, value} = props;
  return (
    
		
   	 <Text x={40} y={100} dy={-4} fill='black' fontSize={10} textAnchor="top" style={{backgroundColor: 'red'}}>Kings</Text>
  

  );
}

export default Chart;