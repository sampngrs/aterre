
import { useRef, useState, useEffect, useContext } from 'react';
import './App.scss';
import './SearchBar.scss'
import { motion, useReducedMotion, AnimatePresence} from 'framer-motion';
import ThreeDotsWave from './Components/ThreeDotsWave';

import useFetch from './utils/useFetch';
import Alert from './Alert';
import AlertContext from './AlertContext';

export default function SearchBar (props) {
    const inputRef = useRef();
    
    const runSearch = () => {
        if (!inputRef.current.value) return;
        else {
            props.setSearch(inputRef.current.value)
            
        }
    }
    

    return (
        <div style={{position:'relative', width:'100%'}}>

        <form className='search-bar' style={{display:'flex', gap:'10px', textAlign:'center'}}
            onSubmit = {(event) => {event.preventDefault(); runSearch()}}>
            <div style={{width:'100%',  flexShrink: 3}}>
            <GetInput  inputRef={inputRef}/>
            </div>
            <motion.button className='search-submit' type="submit" 
            style={{borderRadius: '2px', borderWidth:'1px', position: 'absolute', width:'30px', height:'30px',right:'10px'}}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1.01 }}>
            {<span>↵</span>}
            {/* {props.isLoading && <span class ="spinner-border spinner-border-sm" role="status" aria-hidden="true" />} */}
            </motion.button>

        </form>
        
        
        
        <Alert />

        {/* <AnimatePresence>
        {props.searchLoading &&
        <motion.div 
        initial={{ y: -30}}
        animate={{ y:0, opacity: 1}}
        exit={{ y: -30}}
        style={{fontSize:'0.05px', backgroundColor:'black', display:'flex', justifyContent:'center', position:'absolute', bottom:-25, width:'100%', borderRadius:'5px', height:'40px'}}>
            {/* <span style={{position:'absolute', bottom:0, fontSize:'14px'}}>This div says something important</span> */}
            {/* <ThreeDotsWave /> */}
            {/* </motion.div>} */}
        {/* // </AnimatePresence>  */} 
        
        </div>

    );
    
}




function GetInput (props) {

    return (
        
  
        <div style={{width:'100%'}}>
          <input
            placeHolder='Address or Postcode'
            ref={props.inputRef}
            className='search-field'
            // onChange={this.props.handleChange}
            // defaultValue= 'Postcode, Location, or Place!'
            style={{height: '40px', paddingLeft: '10px', marginLeft: '0px', fontSize: '15px', width:'100%', paddingRight:'40px'}}
            />
        </div>
  );
  }