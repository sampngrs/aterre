import useMeasure from "react-use-measure"
import * as d3 from 'd3'
import { useCallback, useEffect, useMemo } from "react"
import _ from "lodash"
import { motion } from "framer-motion"

export default function ChartTransportTime({data}) {
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
        const extents = keys.map((val) => d3.extent(data.map((d, i) => d.data[val])))
        return [d3.min(extents.map((e) => e[0])), d3.max(extents.map((e) => e[1]))]
    }

    let xScale = useMemo(() => d3.scaleLinear().domain(d3.extent(data.data.axes.map((d, i) => i))), [] ).range([margin.left, width - margin.right])
    let yScale = useMemo(() => d3.scaleLinear().domain(glob_extents(data.data.axes, _.range(Object.keys(data.data.legend).length))), [] ).range([height - margin.bottom, margin.top])

    

    let lines = _.range(Object.keys(data.data.legend).length).map((e, i) => 

    // d3.area((d, i) => xScale(i)), yScale(0), (d) => yScale(d.data[`${i}`])(data.data.axes)
    d3.area()
    .x((d, i) => xScale(i))
    .y0(yScale(0))
    .y1((d) => yScale(d.data[i]))(data.data.axes)


    )

 
    
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
            {lines.map((line) => 
            <motion.path 
            initial={{opacity:0}}
            animate={{opacity:1}}
            d={line}
            fill='currentColor' stroke='currentColor'/>
            )}
            


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

            </svg>
        </>
    )

}