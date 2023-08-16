
import Map from './Map';
import React, { useState, useEffect, useRef } from 'react';
import _, { reject } from 'lodash';
import { motion, AnimatePresence} from 'framer-motion';
import { Icon } from "leaflet";
import './App.scss';
import NavigationBar from './NavigationBar';
import SearchBar from './SearchBar';
import useFetch from './utils/useFetch';
import ThreeDotsWave from './Components/ThreeDotsWave';
import './Components/LoadingTextGradient.scss';
import LoadingTextGradient from './Components/LoadingTextGradient';

import Tabulate from './Tabulate';


function MainScreen () {
    const [coords, setCoords] = useState([51.500841300000005, -0.14298629208606997]);
    const [pins, setPins] = useState([])

        // For example: 
        // {
        // 'name': 'Pizza Express', 
        // 'type':'restaurant', 
        // 'latitute':'51.1234', 
        // 'longitude':'-0.13245', 
        // 'color':'black'
        // }


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

        <ControlPanel coords = {coords} setCoords={setCoords} setPins={setPins}/>
        
        <Map isDark={isDark} coords={coords} mapRef={mapRef} pins={pins}/>

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
    const [search, setSearch] = useState();
    const {loading: searchLoading, data: searchData, error: searchError} = useFetch(search?`/location-search/${search}`:'');
    const {loading: resultsLoading, data: resultsData, error: resultsError} = useFetch(coords.latitude?`/surrounding/${coords.latitude}/${coords.longitude}`:'');

    useEffect(() => {
        if (searchData) props.setCoords(searchData)
    }, [searchData])

    return (

        <div className='control-accordion'>
            
                <SearchBar setSearch={setSearch} searchLoading={searchLoading}/>

                <div style={{width:'100%', height:'100%', overflow:'scroll'}}>
                <AnimatePresence>
                    {/* {((!resultsLoading && resultsData) || (resultsLoading) && (!searchLoading)) &&  */}
                    {((!searchLoading) && (!resultsLoading && resultsData) || (resultsLoading)) &&
                    <motion.div
                    initial={{maxHeight:0}}
                    animate={{ 
                        maxHeight:'100%',
                        overflow:'scroll',
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
                        {<Tabulate setPins={props.setPins} data={(resultsData) ? resultsData.elements : []} tabKeys={['tags.shop', 'tags.amenity', 'tags.public_transport', 'tags.leisure']}/>}
                        </motion.div>}
                

                
                
                </AnimatePresence>
                </div>
                {/* {data && <KeyIndicators /> } */}



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