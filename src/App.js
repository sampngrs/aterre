
import Map from './Map';
import React, { useState, useEffect, useRef, useContext, createContext} from 'react';
import _, { isNil, reject } from 'lodash';
import { motion, AnimatePresence} from 'framer-motion';
import { Icon } from "leaflet";
import './App.scss';
import NavigationBar from './NavigationBar';
import SearchBar from './SearchBar';
import useFetch from './utils/useFetch';
import './Components/LoadingTextGradient.scss';
import LoadingTextGradient from './Components/LoadingTextGradient';
import Transport from './Transport';

import {Headings, HeaderItem} from './Components/Headings';

import Places from './Places';



const ThemeContext = createContext(null);

function MainScreen () {
    const [coords, setCoords] = useState();
    const [pins, setPins] = useState([])
    const mapRef = useRef();
    const [isDark, setIsDark] = useState(true)
    
    useEffect(() => {
        if (isDark) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }, [isDark]); 

    return (
        <ThemeContext.Provider value={isDark}>
        
        <div className='main-body' style={{position:'relative'}}>
            
        <NavigationBar isDark={isDark} toggleDark={() => setIsDark(!isDark)}/>

        <ControlPanel coords = {coords} setCoords={setCoords} setPins={setPins}/>
        
        <Map isDark={isDark} coords={coords} mapRef={mapRef} pins={pins}/>

        </div>
        </ThemeContext.Provider>
        

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
    const [search, setSearch] = useState();
    const {loading: searchLoading, data: searchData, error: searchError} = useFetch(search?`/location-search/${search}`:'');
    const {loading: resultsLoading, data: resultsData, error: resultsError} = useFetch(coords?`/surrounding/${coords.latitude}/${coords.longitude}`:'');

    useEffect(() => {
        if (searchData) props.setCoords(searchData)
    }, [searchData])

    return (

        <div className='control-accordion'>
            
                <SearchBar setSearch={setSearch} searchLoading={searchLoading}/>

                <div style={{width:'100%', height:'100%', overflow:'scroll'}}>
                <AnimatePresence>
                    {((!searchLoading) && (!resultsLoading && resultsData) || (resultsLoading)) &&
                    <motion.div
                    initial={{maxHeight:0}}
                    animate={{ 
                        maxHeight:'100%',
                        opacity: 1, 
                        transition: {
                            duration:1
                        }
                    }}
                    exit={{ 
                        maxHeight:0, 
                        transition: {
                            duration:0.5
                        }
                       }}>

                        <KeyIndicators />

                       <Headings>

                            <HeaderItem title="Places">
                                <Places data={resultsData} setPins={props.setPins}/>
                            </HeaderItem>

                            <HeaderItem title="Transport"> 
                                <Transport data={resultsData} /> 
                            </HeaderItem>

                            <HeaderItem title="Data">
                                content 3
                            </HeaderItem>

                       </Headings>

                        </motion.div>}
                
                </AnimatePresence>
                </div>


        </div>
    );
}


function KeyIndicators(props) {
    return (
        <div style={{display:'flex', flexDirection:'column', gap:'10px', paddingTop:'30px', paddingBottom:'15px'}}>
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