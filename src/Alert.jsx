import { AnimatePresence, motion } from "framer-motion"
import ThreeDotsWave from "./Components/ThreeDotsWave"
import { useContext, useEffect, useRef} from "react"
import AlertContext from "./AlertContext"
import _ from "lodash"

export default function Alert() {
    const [alert, ] = useContext(AlertContext)

    if (!alert) {
        return null
    }

    // By default, the alert is active (i.e when the alert is for a load, the useFetch method will set it to null)
    const {active: active = true} = alert
    
    const severityStyles = {
        loading: {
            color: 'var(--color-background)', 
            background: 'var(--color-foreground)'
        },
        error: {
            color: 'white', 
            background: 'maroon'
        }
    }

    const alertStyle = {
        fontSize:'12px', 
        display:'flex', 
        justifyContent:'center',
        flexDirection:'row',
        flexWrap:'wrap',
        position:'absolute', 
        bottom:-25,
        width:'100%', 
        borderRadius:'5px', 
        fontWeight:'bold',
        height:'calc(100% - 25px)'
    }

    return (
        <>
        <AnimatePresence>
        {active && <motion.div 
        initial={{ y: -30}}
        animate={{ y:0, opacity: 1}}
        exit={{ y: -30}}
        style={{...alertStyle, ...severityStyles[alert.type]}}>
            <div style={{alignSelf:'flex-end', padding:'3px'}}>
            {alert.text}
            </div>
            </motion.div> }
        </AnimatePresence> 
        </>
        
    )

}