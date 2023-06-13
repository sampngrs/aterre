import { useState, useRef, useEffect } from "react";
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
  } from 'recharts';

import chroma from 'chroma-js';




function Chart(props) {
    const inputRef = useRef()
    const {height = '300px', width = 'calc(100%)'} = props; 
    const {data} = props
    const { stack = false} = props;
    const {tooltip = false} = props

    const {activeData, setActiveData} = props
    const timeseries = data.data.axes.map((d) => d.x instanceof Date).some((x) => x == true)
    const months = timeseries ? [...new Set(data.data.axes.map((item) => item.x.getMonth()))].length > 1 : null
    
    return (
        <div style = {{width: width, height: height, margin: 0}}>
        <ResponsiveContainer>
        <AreaChart
          data={data.data.axes}
          margin={{ top: 10, left: 0, right: 10, bottom: 0 }}
          width = {'100%'}
        >
          {/*<CartesianGrid strokeDasharray="3 3" />*/}

          {props.children}

          <CartesianGrid strokeDasharray="6" />

          {Object.values(activeData.filter((item) => item.active == true)).map((x, i) => <Area type="linear" name={x.value} dataKey={`data[${x.index}]`} stackId= {stack ? '1' : i}
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

export default Chart;