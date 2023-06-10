import React, { useState, useEffect } from 'react';

import './App.scss';
import './Animations.scss';
import { CSSTransition } from 'react-transition-group';


function Window (props) {
    const {setActive} = props;
    const {active} = props;
    const {animClass = "about"} = props;
    const {width = 500} = props;
    const {height = 300} = props

return (


    <div> 
          <CSSTransition
           in={active}
           timeout={200}
           classNames="grey"
           unmountOnExit
           >
          <div className = "grey" onClick ={() => setActive(false)}> </div>  
           </CSSTransition>
           
            <CSSTransition
           in={active}
           timeout={200}
           classNames={animClass}
           unmountOnExit
           >
           
			<div className = "about shadow" style ={{height: height, width: width, left: `calc(50vw - ${width/2}px)`, top: `calc(50vh - ${height/2}px)`}}> 

            {props.children}

            </div>  
            </CSSTransition>

        </div> 
	
	);

}


export default Window;