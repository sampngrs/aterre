import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import Button from 'react-bootstrap/Button';
import './App.scss';
import './Animations.scss';


function Paginate (props) {
    const [page, setPage] = useState(0);
    const { length = 5 } = props;
    const prevPage = useRef();

    useEffect(() => {
        prevPage.current = page;
    }, [page]);   

    const arrowSize = 10;
    const maxItems = length;
    const items = props.items.slice(page * maxItems,page * maxItems + maxItems);

(props.items.length / maxItems < page) ? setPage(Math.round(props.items.length / maxItems) ) : console.log() ;


  

return (

			<div> 

            <SwitchTransition mode={'out-in'}>
              <CSSTransition
                key={page}
                classNames= 'fade'
                timeout={300}
              >
                <div>
                   {items}
                </div>
              </CSSTransition>
            </SwitchTransition>

        
           

            {props.items.length > maxItems ? 

            <div style ={{marginTop: 20, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>

            <Button disabled = {page == 0} variant='outline-dark-custom btn-sm' style={{borderRadius: '10', border: 0}} onClick ={() => setPage(page - 1)}>
            <img src={'static/UI/back.png'} height={arrowSize} width = {arrowSize} />
            

            </Button>
            <Button disabled = {items.length < maxItems} variant='outline-dark-custom btn-sm' style={{borderRadius: '10', border: 0}} onClick ={() => setPage(page + 1)}>
            <img src={'static/UI/next.png'} height={arrowSize} width = {arrowSize} />
            

            </Button>
            
            </div> : null }
          </div> 
	);

}




export default Paginate;