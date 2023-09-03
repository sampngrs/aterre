import { createContext, useState } from "react";

const LocationContext = createContext()

export const LocationProvider = ({children}) => {
    const [location, setLocation] = useState(null)

    return (
        <LocationContext.Provider value = {[location, setLocation]}> 
            {children}
        </LocationContext.Provider>

    )
}

export default LocationContext