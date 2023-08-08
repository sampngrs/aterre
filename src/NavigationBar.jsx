import './App.scss';
import './NavigationBar.scss'
import { motion } from 'framer-motion';


function NavigationBar (props) {
    const {isDark} = props
    const displayMode = isDark ? 'dark': 'light'
    const displayColor = isDark ? 'white': 'black'

    const variants = {
        dark: {y: [20,0]},
        light: { y: [20,0]},
      };

    return (
        <div 
        className='navigation-bar' 
        style={{
            display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0px 20px',
            height:'90px', width:'100%'}}>
            <img src="/static/logo.png" width='60' height ='60' />
            
            <div style={{display:'flex', alginItems:'center', gap:'15px', justifyContent:'center', textAlign:'center'
               }}>
                <motion.button 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1.1 }}
                initial={false}
                animate={isDark ? "dark" : "light"} variants={variants}
                onClick={props.toggleDark} style={{all:'unset', cursor:'pointer'}}>
                    <svg  style={{height:'25px', width:'25px', color:displayColor, margin:'auto'}}>

                    <use href={`static/UI/${displayMode}-mode.svg#${displayMode}-mode`}></use>

                    </svg> 
                    
                </motion.button>
                 
                {/* <span className='textButton' >Home</span> */}
                {/* <span className='textButton' >Insights</span> */}
                {/* <span className='textButton' onClick={() => setAboutActive(!aboutActive)}>About us.</span> */}
    
            </div>
          </div>
    );
}

export default NavigationBar;