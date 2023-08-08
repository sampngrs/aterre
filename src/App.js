
import Map from './Map';
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from "leaflet";
import './App.scss';
import NavigationBar from './NavigationBar';
import SearchBar from './SearchBar';
import useFetch from './utils/useFetch';
import ThreeDotsWave from './Components/ThreeDotsWave';
import './Components/LoadingTextGradient.scss';
import LoadingTextGradient from './Components/LoadingTextGradient';
import { motion, AnimatePresence} from 'framer-motion';




function MainScreen () {
    const [coords, setCoords] = useState([51.500841300000005, -0.14298629208606997]);
    const mapRef = useRef();
    const [isDark, setIsDark] = useState(false)
    
    

    //use fetch on coords. fetch will get data and set main as loading.

    useEffect(() => {
        if (isDark) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }, [isDark]); 

    return (
        
        <div className='main-body' style={{position:'relative'}}>
            
        <NavigationBar isDark={isDark} toggleDark={() => setIsDark(!isDark)}/>

        <ControlPanel coords = {coords} setCoords={setCoords}/>
        
        <Map isDark={isDark} coords={coords} mapRef={mapRef} />

        </div>
        

    );
    

}

function Fetch({
    uri, 
    renderSuccess, 
    loadingFallback = <p>...loading</p>, 
    renderError = error => (<pre>{JSON.stringify(error, null, 2)}</pre>)
}) {
    const {loading, data, error} = useFetch(uri);
    if (loading) return loadingFallback;
    if (error) return renderError(error);
    if (data) return renderSuccess({data});
}

function ControlPanel (props) {
    const inputRef = useRef()
    const {coords} = props
    const {setCoords} = props
    var {loading, data, error} = useFetch(coords?`/surrounding/${coords.latitude}/${coords.longitude}`:'');


    return (

        <div className='control-accordion'>
            
            <div style={{width:'100%'}}>

                <SearchBar setCoords={props.setCoords}/>
                <AnimatePresence>
                    {!loading && 
                    <motion.div 
                    style={{overflow:'hidden'}}
                    initial={{ maxHeight:0}}
                    animate={{ 
                        maxHeight:400,
                        opacity: 1, 
                        transition: {
                            duration:1
                        }
                    }}
                    exit={{ 
                        maxHeight:0, 
                        transition: {
                        delay:1
                    }}}>
                        {/* <span style={{position:'absolute', bottom:0, fontSize:'14px'}}>This div says something important</span> */}
                        <KeyIndicators />
                        </motion.div>}
                </AnimatePresence>
                {/* {data && <KeyIndicators /> } */}


            </div>

        </div>
    );
}

function KeyIndicators(props) {
    return (
        <div style={{display:'flex', flexDirection:'column', gap:'10px', paddingTop:'30px', paddingBottom:'30px'}}>
        {[...Array(3)].map((e, i) =>
        <div style={{display:'flex', gap:'20px', marginLeft:'20px', marginRight:'20px'}}> 
        <svg  style={{height:'18px', width:'18px',flexShrink:0}}>
        <use href={`static/UI/check.svg#check`}></use>
        </svg>  
        <LoadingTextGradient height='16px'/>
        </div>)}
        </div>
        
    );
}

export default MainScreen;