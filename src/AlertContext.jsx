import { isNil } from "lodash";
import { createContext, useState } from "react";
import { useEffect, useRef } from "react";

const AlertContext = createContext()

export const AlertProvider = ({children}) => {
    const [alert, setAlert] = useState(null)
    const timerRef = useRef(null);

    useEffect(() => {
        // Checks if there was a boolean set for active
        if (!isNil(alert?.active)) return
        
        // If no boolean, sets a timer to dismiss the alert after three seconds 
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setAlert({active:false});
        }, 3000);
    }, [alert]);


    return (
        <AlertContext.Provider value = {[alert, setAlert]}> 
            {children}
        </AlertContext.Provider>

    )
}

export default AlertContext