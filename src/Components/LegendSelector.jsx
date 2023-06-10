import { useState, useRef, useEffect } from "react";


function LegendSelector(props) {
    const inputRef = useRef()
    const {activeData, setActiveData} = props
    // const [items, setItems] = useState([])
    
    // useEffect(() => {
    //     setItems(props.items)
    // }, [])



    return (
        <div className = 'legendBox' style={{padding: '5px', margin: '2px', borderStyle: 'solid', display:"flex", flexWrap:"wrap", alignContent:"flex-start", alignItems:'center', gap:'5px', overflow:'auto'}}> 
             {activeData.map((x, index) => <ItemBox setItems={setActiveData} value={x} index={index} > {x.value} </ItemBox>)}
        </div>
    );
}

function ItemBox (props) {
    const {setItems} = props
    const {index} = props
    const {value: item} = props
    const {value, color, active} = item
    return (
        <div 
        onClick={() => setItems((array) => {
            const items = [...array];
            const item = items[index];
            item.active = !active;
            items[index] = item;
            if (items.filter((item) => item.active).length > 0){
                return items
            } else {
                return [...array]
            }
            
       })}
        style={{backgroundColor: (active) ? color : 'lightgrey', borderRadius:'3px', color:'white', margin: '0 0 0 0', padding:'2px 7px 2px 7px', fontSize:'14px', cursor:'pointer'}} > 
        {props.children}
        <img src={(active) ? 'static/UI/check.svg' : 'static/UI/cancel.svg' } height='10px' width = '10px' fill="#FFFFFF !important" stroke="#FFFFFF"/>
        </div>
    );
}



export default LegendSelector;