import { motion, transform } from "framer-motion";
import { Transition } from "react-transition-group";

// delete when no longer needed
function getRandomInt(max) {
    return 2
    return Math.floor(Math.random() * max);
  }

export default function Gallery(props) {

    const buttonStyle = {
        height:'30px', 
        width:'30px',
        alignSelf:"center", 
        backgroundColor:"white",
        opacity:0.3,
        borderRadius:'3px',
        margin:"10px", 
        cursor:'pointer',
        color:"black",
        display:"flex",
        justifyContent:"space-around",
        alignItems:"center"
    }

    const buttonHover ={
        opacity:0.8
    }

    const galleryMotion = {
        initial: {maxHeight:'150px'},
        hover: {maxHeight:'400px', 
         transition:{duration:1}}
    }
    
    const filterMotion = {
        initial: {opacity:0.5, 
        },
        hover: {opacity:0, 
            transition:{duration:0.5}}
    }

    return (
    <motion.div 
    variants={galleryMotion}
    whileHover='hover'
    initial='initial'
    style={{maxHeight:'150px', position:'relative', overflow:'hidden',
    // border:'1px solid var(--color-foreground)', 
    borderRadius:"5px"}}> 

            <div style={{position:'absolute', zIndex:'1', display:"flex", width:"100%", justifyContent:"space-between", height:"100%"}}> 
                <motion.div whileHover={buttonHover} style={buttonStyle}> 
                
                <svg style={{height:'10', width:'10px'}}>
                  <use href={`static/UI/back.svg#back`} />  
                </svg>

                </motion.div>
                <motion.div whileHover={buttonHover} style={buttonStyle}> 
                
                <svg style={{height:'10', width:'10px'}}>
                  <use href={`static/UI/next.svg#next`} />  
                </svg> 
                
                </motion.div>
            </div>

            <img src={`static/images/venue-${getRandomInt(3)}.jpg`} style={{objectFit:'cover', height:'100%', width:'100%'}}/>
        
            <motion.div variants={filterMotion}  style={{position:'absolute', inset:0, backgroundColor:'black'}} />

            <div style={{position:'absolute', display:'flex', opacity:0.8, inset:0, width:'100%', height:'100%', padding:'10px', color:'white', justifyContent:"space-between", alignItems:'flex-end'}} > 
            
            <div style={{display:"flex", flexDirection:"column", height:"30px"}}>
            <span style={{fontSize:'12px'}}>Circolo Popolare</span> 
            <span style={{fontSize:'10px'}}>★★★★☆</span>
            </div>

            <motion.svg width="30px" viewBox="0 0 100 100" >
                <motion.circle
                cx="50"
                initial={{pathLength: 0}}
                animate={{pathLength: 1, 
                    transition: {
                        repeat: Infinity,
                        duration: 20
                    }
                }}
                cy="50"
                r="40"
                stroke="white"
                stroke-width="10"
                fill="none"
                stroke-linecap="round"

                />
            </motion.svg>

            

            </div>
    
        </motion.div>);
}