import useMeasure from "react-use-measure"
import * as d3 from 'd3'
import { useCallback, useMemo, useState } from "react"
import _ from "lodash"
import { motion } from "framer-motion"
import { format, compareAsc, parse} from 'date-fns'
import { useRef } from "react";

export default function StackedAreaChart({data}) {
    const [ref, {width, height}] = useMeasure()
    

    return (
        <div ref={ref} style={{position:"relative" , width:'100%', height:"250px"}}>
            <ChartInner height={height} width={width} data={data} />
        </div>
    )
}

function ChartInner({height, width, data}) {
    const ref = useRef();
    const parentRef = useRef();
    const [hover, setHover] = useState(null);

    let margin = {
        top: 40,
        bottom: 20,  
        right: 0, 
        left: 30, 
    }

    data.data.axes.map((d) => ({'data': d.data, 'date':
        parse(
        d.date,
        'yyyyMM', new Date()
        )}))

    // data.data.axes = data.data.axes.map((d) => ({'data': d.data, 'date':
        // parse(
        // d.date,
        // 'yyyyMM', new Date()
        // )

    


    const keys = _.keys(data.data.MajorText)

    var stack = d3.stack()
    .keys(keys)
    .value((obj, key) => obj.data[key])(data.data.axes)

    let xScale = useMemo(() => d3.scaleLinear().domain([parse(
        data.data.axes.at(0).date,
        'yyyyMM', new Date()
        ) , parse(
            data.data.axes.at(-1).date,
            'yyyyMM', new Date()
            )]), [data] ).range([margin.left, width - margin.right])
    let yScale = useMemo(() => d3.scaleLinear().domain([0, d3.max(data.data.axes.map((d, i) => d3.sum(_.values(d.data))))]), [data] ).range([height - margin.bottom, margin.top])
    
    const path = stack.map((e) => 
    d3.area()
    .curve(d3.curveNatural)
    .x((d, i) => xScale(parse(
        d.data.date,
        'yyyyMM', new Date()
        )))
    .y0((d, i) => yScale(d[0]))
    .y1((d, i) => yScale(d[1]))(e))  

    var colorScale = d3
    .scaleLinear()
    .domain([0, keys.length])
    .range(["red", "yellow", "blue"])
    .clamp(true);    

    // var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        
    const mouseMove = (e, i) => {
        if(i) setHover(_.values(data.data.MajorText).at(i)) 
        
        var rect = parentRef.current.getBoundingClientRect()
        var labelWidth = ref.current.getBoundingClientRect().width
        console.log(labelWidth)
        if(labelWidth > 150) {
        ref.current.style.whiteSpace = "normal"
        ref.current.style.width = width/2
        }
        else {
        ref.current.style.whiteSpace = "nowrap";
        ref.current.style.maxWidth = ""
        }

        var x = e.clientX - rect.left + 10; //x position within the element.
        var xRight = e.clientX - rect.left - labelWidth - 10
        var y = e.clientY - rect.top;  //y position within the element.
        
        ref.current.style.left = `${x > width/2 ? xRight : x}px`
        ref.current.style.top = `${y + 10}px`
    }

      
    
    return (
        <div ref={parentRef} style={{overflow:'hidden'}}>
            <div ref={ref} style={{
            position:"absolute", 
            backgroundColor:'var(--color-foreground)', 
            color:"var(--color-background)", 
            padding:'0px 5px', 
            fontSize:'12px', 
            overflow:"auto",
            whiteSpace:'nowrap',
            }}>
                {hover}
                </div>
            <svg height={height} width={width} viewBox={`0 0 ${width} ${height}`} 
            >   <g className='container'>
                 {height > 0 && path.map((e, i) => 
                    <>
                    <motion.path 
                    onMouseMove={(e) => mouseMove(e, i)}
                    onMouseLeave={() => setHover(null)}
                    initial={{opacity:0, scale:1.1}}
                    animate={{opacity:1, scale:1, transition:{duration:1, delay: (path.length-i) * 0.05}}}
                    d={e}
                    className='shape'
                    fill={colorScale(i)} stroke={'var(--color-background)'} strokeWidth={'1px'}/>
                    </>)}
                    </g>
                
                {xScale.ticks().map((time, index) => (

                    <g transform={`translate(${xScale(time)})`}>
                    
                        <text 
                            style={{fontSize:'8px', fontWeight:"lighter"}} 
                            stroke="currentColor" 
                            textAnchor="middle"
                            y = {height - (margin.bottom / 4)}
                            > 
                            
                            {/* {data[time]?.time in [data.at(0).time, data.at(-1).time ] ? null : data[time].time}  */}

                            {format(time, 'yy/M')}
                            
                        </text>
 </g>))}
                    
                    <text 
                    style={{fontSize:'11px', fontWeight:"lighter"}} 
                    stroke="currentColor" 
                    textAnchor="middle"
                    x={width/2}
                    y={margin.top/3}
                    > 
                        
                    {data.title}
                        
                    </text>

                    {/* <line 
                        x1 = {0}
                        x2 = {width}
                        y1 = {margin.top/2 + 5}
                        y2 = {margin.top/2 + 5}
                        stroke = 'currentColor'
                        // strokeDasharray={'9,10'} 
                        /> */}
          

            

            {yScale.ticks(8).map(((occ, index) => (
                    <g transform={`translate(0 ${yScale(occ)})`}>

                    <line 
                        x1 = {margin.left}
                        x2 = {width}
                        stroke = 'currentColor'
                        opacity={0.2}
                        // strokeDasharray={'9,10'} 
                        />
                
                    <text 
                        style={{fontSize:'8px', fontWeight:"lighter"}} 
                        stroke="currentColor" 
                        textAnchor="left"
                        x={0}
                        > 
                        
                        {occ > 1000 ? `${occ / 1000}k` : occ}
                        
                    </text>
                </g>

                

                    
                )))}
                
            </svg>
        </div>
        
    )

}