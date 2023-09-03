import useMeasure from "react-use-measure"
import * as d3 from 'd3'
import { useCallback, useMemo } from "react"
import _ from "lodash"
import { motion } from "framer-motion"
import './Chart.css'

export default function ChartTraffic({data}) {
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

    function glob_extents(data, keys){
        if (!data) return
        const extents = keys.map((val) => d3.extent(data.map((d, i) => d[val])))
        return [d3.min(extents.map((e) => e[0])), d3.max(extents.map((e) => e[1]))]
    }

    let xScale = useMemo(() => d3.scaleLinear().domain(d3.extent(data.map((d, i) => i))), [] ).range([margin.left, width - margin.right])
    let yScale = useMemo(() => d3.scaleLinear().domain(glob_extents(data, ['value', 'mean'])), [] ).range([height - margin.bottom, margin.top])

    let line = d3.line()
        .x(((d, i) => xScale(i)))
        .y((d) => yScale(d.value))
    
    let averageLine = d3.line().x(((d, i) => xScale(i))).y((d) => yScale(d.mean))(data)

    let result = line(data)

    
    return (
        <>
            <svg height={height} width={width} viewBox={`0 0 ${width} ${height}`} 
            >
                
                
                {xScale.ticks().map((time, index) => (

                    <g transform={`translate(${xScale(time)})`}>
                    
                        

                    
                        <text 
                            style={{fontSize:'8px', fontWeight:"lighter"}} 
                            stroke="currentColor" 
                            textAnchor="middle"
                            y = {height - (margin.bottom / 4)}
                            > 
                            
                            {/* {data[time]?.time in [data.at(0).time, data.at(-1).time ] ? null : data[time].time}  */}

                            {xScale(time) > 25 && xScale(time) < width - 25 ? data[time]?.time : null}
                            
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
                        
                    Total station entries and exists over average 24 hour period
                        
                    </text>
            <g className='container'>
            <motion.path 
                className='shape'
                d={result}
                whileHover={{strokeWidth:'4px'}}
                fill='none' stroke='currentColor' strokeWidth={'1px'}/>

            <motion.path 
            className='shape'
            d={averageLine} 
            whileHover={{strokeWidth:'4px'}}
                fill='none' stroke='red' strokeWidth={'1px'}/>

            </g>

            {yScale.ticks(8).map(((occ, index) => (
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

            </svg>
        </>
    )

}