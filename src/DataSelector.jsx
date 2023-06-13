import React, { useState, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import _ from 'lodash';


import Button from 'react-bootstrap/Button';
import './App.scss';
import './Animations.scss';
import Window from './Window.jsx'
import MultiSelector from './MultiSelector';
import LegendSelector from './Components/LegendSelector';
import Chart from './Components/Chart';


function DataSelector (props) {
    let {dropdown = true} = props
    const {items_obj} = props;
    const {activeKey = 0 }  = props
    const [expanded, setExpanded] = useState(false)
    const {fullscreen} = props;
    const {setFullscreen} = props
    const { titles } = props
    dropdown = props.titles.length > 1
    const activeTitle = props.titles[activeKey].title
    const [activeItems, setActiveItems] = useState([])
    useEffect(() => {
    
    }, [])

    const datasets = titles.map((item, index) => 
                                                    <div style={{width:'100%', 
                                                    // borderBottom: index != titles.length - 2 ? ".02rem solid rgba(120,120,120, 0.60)" : "", 
                                                    padding: '5px 0px 5px 0px'}}> <h7 style={{paddingLeft:10, fontSize:13, cursor:'pointer', marginTop:'10px'}} onClick={() => (props.setActiveKey(index), setExpanded(false))}> {item.title} </h7> <br /> </div>
                                                )


return (    

            <div style={{width:'100%'}}> 

                <Window  setActive={setFullscreen} active = {fullscreen} width={580} height={370}> 

                <PopoutChart {...props}>
                    {props.children}
                </PopoutChart>

                </Window>

            <div 
            onMouseLeave={() => (dropdown) ? setExpanded(false) : null}
            style={{position:'relative', zIndex:5}}>

            

			<div onClick={() => (dropdown) ? setExpanded(!expanded) : null} style = {{width:'100%', height: '35px', backgroundColor:'black', color:'white', padding:5, borderRadius:'3px', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', zIndex:1}} >
                <div>


                <SwitchTransition mode={'out-in'}>
                  <CSSTransition
                    key={activeTitle}
                    classNames= 'fade'
                    timeout={300}
                  >
                    
                      <h7 style={{paddingLeft:10, fontSize:'14px'}}> {activeTitle} </h7> 
                    
                  </CSSTransition>
                </SwitchTransition>


                
                     
                </div>

           

                <div> 
                {dropdown == true ?
                <div style={{cursor:'pointer', borderRadius: '10', border: 0, margin: 0, padding: 10}} onClick={() => setExpanded(!expanded)}>
                
                <CSSTransition
                   in={expanded}
                   timeout={1000}
                   classNames="spin"
                   >
                   <svg style={{height:'18px', width:'18px'}}>
                        <use href={'static/UI/plus.svg#plus'}></use>
                    </svg>
                   </CSSTransition>
                   
                
                   </div> : null}

                

                 
                
                </div> 

            </div>  

            <CSSTransition
                   in={expanded}
                   timeout={500}
                   classNames="dropdown"
                   unmountOnExit
                   >
                   <div className='blur' style={{position:'absolute', 
                   top:30, 
                   left:0, 
                   width:'100%', 
                   backgroundColor:'black', 
                   zIndex:-1, 
                   borderRadius:'3px',
                   color:'white', padding:5}}> 
                        
                        {datasets}

                        
                    
                    </div>

                   </CSSTransition>

            
            </div>
             </div>
	);

}

function PopoutChart (props){
    const {activeKey = 0}  = props
    const activeTitle = props.titles[activeKey].title;
    const [activeData, setActiveData] = useState(_.cloneDeep(props.activeData))
    const [legendExpanded, setLegendExpanded] = useState(false)

    
    return (
        <div style={{gap:'2px', width:'100%', height:'100%', display:'flex', padding:'20px', flexDirection:'column', alignItems:'center', justifyContent:'center'}}> 

                        {/* <div style={{margin:'20px'}}> {props.children} </div>  */}
                        
                        <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            
                            <div style={{paddingLeft:'10px', display:'flex', flexDirection:'row', gap:'20px', justifyContent:'center', alignContent:'center'}}>
                            
                            <span style={{fontSize:'20px', alignSelf:'center'}}>{activeTitle}</span>

                            <div style={{cursor:'pointer', gap:'10px',display:'flex', alignItems:'center', border: '1px solid black', backgroundColor:(legendExpanded) ? 'black' : 'white', color:(legendExpanded) ? 'white' : 'black', margin:'5px', padding:'2px 7px 2px 7px', fontSize:'14px', borderRadius:'3px'}}
                            onClick={()=>setLegendExpanded(!legendExpanded)}>
                                
                                <span>Legend</span>

                                <CSSTransition
                                    in={legendExpanded}
                                    timeout={1000}
                                    classNames="oneeighty"
                                    >
                                    <svg style={{height:'15px', width:'15px', color:(legendExpanded) ? 'white' : 'black'}}>
                                    <use href={'static/UI/down.svg#down'}></use>
                                </svg>
                                    </CSSTransition>

                                
                                
                            </div>


                            </div>
                            
                            
                            
                            <Button variant='btn-sm' style={{borderRadius: '10', border: 0}} onClick={() => props.setFullscreen((val) => !val)}> 
                                <img src={'static/UI/close.svg'} height={'15px'} width = {'15px'} />
                            </Button>

                        </div> 
                        <div style={{position:'relative', width:'100%'}}>

                                <CSSTransition
                                in={legendExpanded}
                                timeout={500}
                                classNames="dropdown"
                                unmountOnExit
                                >  
                                
                                <div style={{backgroundColor:'#00000099', borderRadius:'3px', width:'100%', zIndex:1, position:'absolute'}}>

                                <LegendSelector activeData={activeData} setActiveData={setActiveData}/>
    
                                </div>
                                
                                </CSSTransition>
                            
                           

                            

                        </div>

                        {/* <text style={{fontSize:'10px'}}>This is an example subtitle which eventually will be more profound</text> */}
                        <Chart tooltip={true} data={props.data} activeData={activeData} stack={props.stack}>
                            {props.children}
                        </Chart>
                        {/* <LegendSelector activeData={activeData} setActiveData={setActiveData}/> */}
                        {/* <MultiSelector items={props.items} />  */}

        </div>
    );
}


export default DataSelector;