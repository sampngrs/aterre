import useMeasure from "react-use-measure"
import * as d3 from 'd3'
import { useCallback, useEffect, useMemo } from "react"
import _ from "lodash"
import { motion } from "framer-motion"
import './Chart.css'

export default function ScatterChart({data}) {
    const [ref, {width, height}] = useMeasure()

    return (
        <div ref={ref} style={{position:"relative" , width:'100%', height:"100%"}}>
            <ChartInner height={height} width={width} data={data} />
        </div>
    )
}

function ChartInner({height, width, data}) {
    
    let margin = {
        top: 40,
        bottom: 20,  
        right: 0, 
        left: 0, 
    }

    let xScale = useMemo(() => d3.scaleLinear().domain([0, d3.max(data.map((d, i) => d.distance))]), [data]).range([margin.left, width - margin.right])
    let yScale = useMemo(() => d3.scaleLinear().domain([0, d3.max(data.map((d, i) => d.time))]), [data]).range([height - margin.bottom, margin.top])
    
    
    let dots = useMemo(() => data.map((d, i) =>
    
    <motion.circle 
    className='shape'
    whileHover={{fill:'red', r:4}}
    onClick={() => console.log(d)}

    initial={{
        cy: height, 
        opacity:0,
    }}

    animate={{
        cy: yScale(d.time), 
        opacity:1, 
        transition:{
            duration:0.5, 
            delay:0.001 * i, 
            type:'spring',
        }}}

    style={{cursor:'pointer'}}
    transition={{}}
    cx={xScale(d.distance)} r={1.5} fill='currentColor' /> 
    
    , [data]))

    
    return (
        <>  
            {<svg height={height} width={width} viewBox={`0 0 ${width} ${height}`} 
            >
                <motion.path d={`M0,${height - margin.bottom}L${xScale(100)},${yScale(100)}`} stroke = 'grey'/>
                <g className="container">
                {height > 0 && dots}
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

                            {xScale(time) > 10 && xScale(time) < width - 25 ? time : null}
                            
                            
                        </text>
                    </g>
                ))}
            
                    <text 
                    style={{fontSize:'9px', fontWeight:"lighter"}} 
                    stroke="currentColor" 
                    textAnchor="middle"
                    x={width/2}
                    y={margin.top/2}
                    > 
                        
                    Travel time (min) from origin to all transport nodes in London
                        
                    </text>
            
            {yScale.ticks().map(((occ, index) => (
                    <g transform={`translate(0 ${yScale(occ)})`}>
                    
                    {/* <line 
                        y1 = {margin.bottom}
                        y2 = {height - margin.top}
                        stroke = 'currentColor'
                        strokeDasharray={'1,10'} 
                        /> */}

                
                    <text 
                        style={{fontSize:'8px', fontWeight:"lighter", opacity: 0.2}} 
                        stroke="currentColor" 
                        textAnchor="left"
                        x={0}
                        > 
                        
                        {occ > 0 ? occ : null}
                        
                    </text>
                </g>
                    
                )))}

            </svg>}
        </>
    )

}