import React, { useState, useEffect, useRef } from 'react';
import _, { reject } from 'lodash';
import { motion, AnimatePresence} from 'framer-motion';

import './Tabulate.scss';
import { SVG } from 'leaflet';

export default function Tabulate(props){
    
    const {data = [], tabKeys = ['category'], renderItem} = props
    const {setPins} = props;

    function rejectNil(array){
        return _.reject(array, ({ path, category }) =>
        _.isNil(path) || _.isNil(category)
        )
    }

    function returnSVGPath(path) {
        const tryExists = (path) => {
            try { return require(`/public/static/amenity/${path}.svg`); } 
            catch (err) { return null; }
          };
          return (tryExists(path) ? 'static/amenity/' + path +'.svg#' + path : 'static/amenity/pin.svg#pin')
    }

    function returnSVG(path) {
        
            return (
                <svg style={{height:'10px', width:'10px'}}>
                    <use href={returnSVGPath(path)} />
                </svg>
            );
    }
    
    const path = _.uniqBy(data.map((e, i) => _.at(e, tabKeys).map((e, i) => ({
        'path': (e) ? tabKeys[i] : null, 
        'category': e
        })
    
    )).map((e) => rejectNil(e)), (e) => e[0].category).map((e, i) => e[0]);

    const [selCat, setSelCat] = useState('')
    const [hoverCat, setHoverCat] = useState('convenience')
    const [expanded, setExpanded] = useState(false)

    const displayItems = expanded ? path.length : 10;
    
    const scrollRef = useRef(null)
    const executeScroll = () => {
        setTimeout(() => {
        scrollRef.current.scrollIntoView({behavior: "smooth", inline:'start', block: 'nearest'})   
        }, 50)
    }

    useEffect(() => {

        if (selCat){ 
        // console.log(data.filter((e, i) => _.at(e, path[_.findIndex(path, {category: selCat})].path) == selCat))
        setPins(data.filter((e, i) => _.at(e, path[_.findIndex(path, {category: selCat})].path) == selCat).map((e) => 
            ({
                'name': e.tags.name, 
                'latitude': e.lat ? e.lat : e.center.lat, 
                'longitude': e.lon ? e.lon : e.center.lon,
                'icon': 
                
                <svg style={{height:'30px', width:'30px'}}>
                <circle cx="50%" cy="50%" r="45%" fill="var(--color-foreground)" stroke="none" strokeWidth="2" />
                <use width="40%" height="40%" x="30%" y="30%" href={returnSVGPath(selCat)} color="var(--color-background)"/>
                </svg>
            })
        )) } else {setPins([])}

    }, [selCat])

    return(
        <div style={{position:'relative', overflow:'visible', fontSize:'12px'}}>

                
           
            {selCat && <div className='tabulate'>
            {_.sortBy(path, ['category']).map((e, i) => 

                <div
                key={e.category}
                onClick={() => e.category === selCat ? setSelCat('') : setSelCat(e.category)}
                className='tab'
                ref={e.category === selCat ? scrollRef : null}
                >
                
                {selCat === e.category && 
                <motion.div
                layoutId="active-pill"
                className="pill"
                transition={{type:'spring', duration:0.4, bounce:0.2}}
                style={{mixBlendMode:'exclusion'}}
                
                />}
                
                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>

                    {returnSVG(e.category)}

                    { _.startCase(e.category)}
                    
                </div>
                    

                </div>

                )}

            </div>}

            <div className='tabulate' style={{flexWrap:'wrap'}}
            onMouseLeave={() => setHoverCat('')}>
            {!selCat && _.sortBy(path, ['category']).slice(0, displayItems).map((e, i) => 

                <div
                key={e.category}
                onMouseEnter={() => setHoverCat(e.category)}
                
                onClick={() => e.category === selCat ? setSelCat('') : (setSelCat(e.category), executeScroll())}
                className='tab'

                >
                
                {hoverCat === e.category && 
                <motion.div
                layoutId="grid-active-pill"
                className="pill"
                transition={{type:'spring', duration:0.4, bounce:0.2}}
                style={{mixBlendMode:'exclusion'}}
                
                />}

                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>

                        {returnSVG(e.category)}

                        {_.startCase(e.category)}
                        
                    </div>
                    

                </div>

                )}

                {!selCat && <motion.div
                whileHover={{ scale: 0.95}}
                onClick={() => setExpanded(!expanded)}
                className='tab'
                style={{display:'flex', backgroundColor:'var(--color-foreground)', borderRadius:'3px', color:'var(--color-background)', fontSize:'10px', alignItems:'center'}}
                > 
                {expanded ? 'show less' : 'show more'}
                </motion.div>}

            </div>

            {selCat && data.filter((e, i) => _.at(e, path[_.findIndex(path, {category: selCat})].path) == selCat).map((e, i) => 

            <p style={{fontSize:'11px', margin:'10px'}}>
                
            {e.tags.name}</p>
                
                
                
                )}

            </div>

        
        
    );
    }
