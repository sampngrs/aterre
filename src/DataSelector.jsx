import React, { useState, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';


import Button from 'react-bootstrap/Button';
import './App.scss';
import './Animations.scss';
import Window from './Window.jsx'


function DataSelector (props) {
    let {dropdown = true} = props
    const [expanded, setExpanded] = useState(false)
    const { titles } = props
    dropdown = props.titles.length > 1
    const activeTitle = props.titles.filter((item) => item.id == props.activeKey)[0].title

    const datasets = titles.filter((obs) => obs.id != props.activeKey).map((item, index) => 
                                                    <div style={{width:'100%', 
                                                    borderBottom: index != titles.length - 2 ? ".02rem solid rgba(120,120,120, 0.60)" : "", 
                                                    padding: '5px 0px 5px 0px'}}> <h7 style={{paddingLeft:10, fontSize:13, cursor:'pointer', marginTop:'10px'}} onClick={() => (props.setActiveKey(item.id), setExpanded(false))}> {item.title} </h7> <br /> </div>
                                                )

return (
            <div style={{position:'relative', zIndex:1}}>
			<div style = {{width:'100%', height: '35px', backgroundColor:'black', color:'white', padding:5, borderRadius:'0.375rem', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', zIndex:1}} >
                <div>


                <SwitchTransition mode={'out-in'}>
                  <CSSTransition
                    key={activeTitle}
                    classNames= 'fade'
                    timeout={300}
                  >
                    
                      <h7 style={{paddingLeft:10, fontSize:13}}> {activeTitle} </h7> 
                    
                  </CSSTransition>
                </SwitchTransition>

                


                {dropdown == true ?
                <Button variant='btn-sm' style={{borderRadius: '10', border: 0}} onClick={() => setExpanded(!expanded)}>
                <CSSTransition
                   in={expanded}
                   timeout={1000}
                   classNames="spin"
                   >
                   <img src={'static/UI/plus.png'} height={10} width = {10} />
                   </CSSTransition>
                
                    </Button> : null}
                     
                </div>

           

                <div> 
                <Button classNames='' variant='btn-sm bespoke-button' style={{borderRadius: '10', border: 0, margin: 0, padding: 10}}>
                
                   <img src={'static/UI/fullscreen.png'} height={12} width = {12} onClick={() => <Window />}/>
                   
                
                </Button>

                

                 
                
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
                   borderRadius:'0.375rem',
                   color:'white', padding:5}}> 
                        
                        {datasets}

                        
                    
                    </div>

                   </CSSTransition>

            
            </div>
	);

}


export default DataSelector;