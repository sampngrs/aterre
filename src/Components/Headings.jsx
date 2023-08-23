import { useState } from "react";
import _ from "lodash";
import { AnimatePresence, motion } from "framer-motion";

export function Headings(props){
    const headings = props.children.map((e) => e.props.title)
    const [activeHeader, setActiveHeader] = useState(headings[0])  

    headings.unshift(_.remove(headings, (e) => e == activeHeader)[0])

    return(
        <div>
        <div style={{padding:'5px 10px', display:'flex', gap:'16px', alignItems:'baseline'}}>
        <AnimatePresence>
           
            {headings.map((e) => 
            
            activeHeader && <motion.span 
                key={e}
                layoutId={e}
                className={e == activeHeader ? 'header-active' : 'header'}  
                onClick={() => setActiveHeader(e)}
                style={{cursor:'pointer'}}
                initial={{ opacity: e == activeHeader ? 1 : 0 }}
                animate={{ 
                    opacity: 1,  
                    transition: {
                        duration:2
                    }}}
                whileHover={{scale: e == activeHeader ? 1 : 0.95}}>

            {e}

            </motion.span>
            )}

        </AnimatePresence>
        </div>
        <div style={{margin: '10px', display:'flex', gap:'10px', flexDirection:'column'}}>
        {props.children.map((e) => 
            e.props.title == activeHeader ? e.props.children : null)}
        </div>
        </div>
    );
}

export function HeaderItem(props){
    const {title} = props
    return(
        props.children
    );
}