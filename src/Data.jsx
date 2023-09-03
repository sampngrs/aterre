import { useContext } from "react";
import LocationContext from "./LocationContext";
import StackedAreaChart from "./StackedAreaChart";

export default function Data(props){
    const [location, ] = useContext(LocationContext)
    const {econData} = props

    return (
        <div style={{height:'100%', width:'100%', display:'flex', gap: '15px', flexDirection:"column"}}>
            {econData?.map((e) => 
            
            <StackedAreaChart data={e}/>
            
            )}
        </div>
    );
}