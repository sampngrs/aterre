
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
import _, { reject } from 'lodash';
import './Tabulate.scss';



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
                        {<Tabulate data={(resultsData) ? resultsData.elements : []} tabKeys={['tags.shop', 'tags.amenity', 'tags.public_transport', 'tags.leisure']}/>}
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



function Tabulate({
    data = [], 
    tabKeys=['category'],
    renderItem}){

    function rejectNil(array){
        return _.reject(array, ({ path, category }) =>
        _.isNil(path) || _.isNil(category)
        )
    }
    
    const path = _.uniqBy(data.map((e, i) => _.at(e, tabKeys).map((e, i) => ({
        'path': (e) ? tabKeys[i] : null, 
        'category': e
        })
    )).map((e) => rejectNil(e)), (e) => e[0].category).map((e, i) => e[0]);

    const [selCat, setSelCat] = useState('convenience')

    return(
        <div style={{position:'relative'}}>
            <div className='tabulate'>
            {_.sortBy(path, ['category']).map((e, i) => 

                <div
                key={e.category}
                onClick={() => setSelCat(e.category)}
                className='tab'
                >
                
                {selCat === e.category && 
                <motion.div
                layoutId="active-pill"
                className="pill"
                transition={{type:'spring', duration:0.4, bounce:0.2}}
                style={{mixBlendMode:'exclusion'}}
                
                />}

                {_.startCase(e.category)}
                    

                </div>

                )}

            </div>

            {data.filter((e, i) => _.at(e, path[_.findIndex(path, {category: selCat})].path) == selCat).map((e, i) => <p style={{fontSize:'11px'}}>{e.tags.name}</p>)}

            </div>

        
        
    );
    }

export default MainScreen;