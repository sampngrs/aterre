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
    const {tooltip = false} = props

    const {activeData, setActiveData} = props

    // const [items, setItems] = useState([])
    
    // useEffect(() => {
    //     setItems(props.items)
    // }, [])
    const months = [...new Set(data.data.sub_data.map((item) => item.year.getMonth()))].length > 1
    
    return (
        <div style = {{width: width, height: height, margin: 0}}>
        <ResponsiveContainer>
        <AreaChart
          data={data.data.sub_data}
          margin={{ top: 10, left: 0, right: 10, bottom: 0 }}
          width = {'100%'}
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

          <CartesianGrid strokeDasharray="6" />

          {Object.values(activeData.filter((item) => item.active == true)).map((x) => <Area type="linear" name={x.value} dataKey={`data[${x.index}]`} stackId='1' fillOpacity={1} stroke = {chroma(x.color).darken()} fill={x.color} 
            // fill={`RGB(${ index * 15}, 0, 0)`}
            />)}

        {tooltip && <Tooltip labelFormatter={(t) => (months && t.toLocaleString('default', { month: 'long' }) + ", " ) + t.getFullYear() } allowEscapeViewBox={{ x: true, y: true }} labelStyle={{fontSize:'13px'}} contentStyle={{fontSize:'13px', lineHeight:'13px'}}/>}
          
        </AreaChart>
        </ResponsiveContainer>
        </div> 
    );
}

export default Chart;