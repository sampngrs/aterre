
import Map from './Map';
import React, { useState, useEffect, useRef, useContext, createContext, useMemo} from 'react';
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
import Data from './Data.jsx'
import {Headings, HeaderItem} from './Components/Headings';

import Places from './Places';
import AlertContext from './AlertContext';
import { AlertProvider } from './AlertContext';

import LocationContext from './LocationContext';
import { LocationProvider } from './LocationContext';



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
        <AlertProvider>
        <LocationProvider>
        
        <div className='main-body' style={{position:'relative'}}>
            
        <NavigationBar isDark={isDark} toggleDark={() => setIsDark(!isDark)}/>

        {React.useMemo(() => <ControlPanel coords = {coords} setCoords={setCoords} setPins={setPins}/>, [coords])}
        
        <Map isDark={isDark} coords={coords} setCoords={setCoords} mapRef={mapRef} pins={pins}/>

        </div>
        </LocationProvider>
        </AlertProvider>
        

    );
    

}

function ControlPanel (props) {
    const inputRef = useRef()
    const {coords} = props
    const [, setAlert]= useContext(AlertContext)
    const [location, setLocation] = useContext(LocationContext)
    const {setCoords} = props
    const [search, setSearch] = useState();

    const {loading: searchLoading, data: searchData, error: searchError} = useFetch(search?`/location-search/${search}`:'');
    
    const {loading: resultsLoading, data: resultsData, error: resultsError} = useFetch(coords?`/surrounding/${coords.latitude}/${coords.longitude}`:'');
    
    const {loading: stationsLoading, data: stationsData, error: stationsError} = useFetch(resultsData?`/station_attributes/${resultsData?.elements.filter((e) => !(_.isNil(_.at(e, ['tags.public_transport'])[0]))).map((e) => e.tags['naptan:AtcoCode']).join(';')}`:'');

    
    const {loading: accessLoading, data: accessData, error: accessError} = useFetch(
        useMemo(() => resultsData?`/access/${coords.latitude}/${coords.longitude}/${resultsData?.elements.filter((e) => !(_.isNil(_.at(e, ['tags.public_transport'])[0]))).map((e) => e.tags['naptan:AtcoCode']).join(',')}`:'', [stationsData])
        );

    const {loading: econLoading, data: econData, error: econError} = useFetch(
        useMemo(() => location?`/crime/${location.latitude}/${location.longitude}`:'', [location])
        );


    useEffect(() => {
        if (searchData) props.setCoords(searchData) 
        if (searchData) setLocation(searchData)
    }, [searchData])

    useEffect(() => {
        if (searchData) setLocation(coords)
    }, [coords])


    return (

        <div className='control-accordion'>
            
                <SearchBar setSearch={setSearch} searchLoading={searchLoading}/>
    
                <div style={{width:'100%', height:'100%', overflowY:'scroll'}}>
                <div style={{overflowX:'visible'}}>
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
                                <Transport data={stationsData} accessData={accessData} coords={coords}/> 
                            </HeaderItem>

                            <HeaderItem title="Insights">
                                <Data econData={econData}/>
                            </HeaderItem>

                       </Headings>

                        </motion.div>}
                
                </AnimatePresence>
                </div>
                       </div>
        </div>
    );
}


function KeyIndicators(props) {
    return (
        <div style={{display:'flex', flexDirection:'column', gap:'10px', paddingTop:'30px', paddingBottom:'15px'}}>
        {[...Array(3)].map((e, i) =>
        <div style={{display:'flex', gap:'20px', marginLeft:'20px', alignItems:'center', marginRight:'20px'}}> 
        <svg  style={{height:'18px', width:'18px',flexShrink:0}}>
        <use href={`static/UI/check.svg#check`}></use>
        </svg>  
        {/* <span> This is a sentence</span> */}
        <LoadingTextGradient height='16px'/>
        </div>)}
        </div>
        
    );
}

export default MainScreen;