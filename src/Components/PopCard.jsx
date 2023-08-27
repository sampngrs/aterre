import { useState, useRef, useEffect} from "react";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion"; 
import useMeasure from "react-use-measure";

export default function PopCard(props){
    const [popRef, { width, height }] = useMeasure();
    const rowRef = useRef(null)
    const [opened, setOpened] = useState(false)


    const {e} = props;
    const {header} = props;
    const {content} = props;
    const {parentRef} = props;

    let bodyContent = content({e})
    let headerContent = header({e})


    return (
        <motion.div 
        ref={rowRef}
        onClick={() => setOpened(!opened)}
        whileHover={{backgroundColor:"var(--color-foreground)", color:"var(--color-background)"}}
        style={{color:"var(--color-foreground)", backgroundColor:"var(--color-background)", position:'relative', fontSize:'12px', borderRadius:'3px', display:'flex', flexDirection:'row', justifyContent:'space-between' ,padding:'5px', cursor:"pointer"}}>
        
        {/* The list item */}
        
        {headerContent}


        {opened && 
        <AnimatePresence>
        <motion.div 
        ref={popRef}
        initial={{top:'0px', left:'0px', right:'0px'}}
        onMouseLeave={() => setOpened(false)}
        animate={{
            top: 
            rowRef.current?.getBoundingClientRect()['y'] + height > parentRef.current?.getBoundingClientRect()['bottom'] ? 
            - (rowRef.current?.getBoundingClientRect()['y'] + height - parentRef.current?.getBoundingClientRect()['bottom']) + 5 : '0px',
            left:'-5px', right:'-5px', maxHeight:'300px', overflow:'scroll'}}
        style={{position:'absolute', zIndex:'1', borderRadius:'3px', padding:'5px', backgroundColor:'var(--color-foreground)'}}> 
        
        {/* The list item */}

        <div 
        style={{position:'relative', color:'var(--color-background)', fontSize:'12px', borderRadius:'3px', display:'flex', flexDirection:'column', gap:'15px', margin:'5px'}}>
        
        <div
        style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>

        {headerContent}


        </div>

        {bodyContent}



        

        </div>
        </motion.div>
        </AnimatePresence>
        }


        </motion.div>


    );
}