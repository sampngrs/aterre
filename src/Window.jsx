import React, { useState, useEffect } from 'react';

import './App.scss';
import './Animations.scss';
import { CSSTransition } from 'react-transition-group';


function Window (props) {
    const {setActive} = props;
    const {active} = props;
    const {animClass = "about"} = props;

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
           
			<div className = "about shadow"> 

            {props.children}

            </div>  
            </CSSTransition>

        </div> 
	
	);

}


export default Window;