import React from "react";

export default function Grid(props){
    console.log(props.children)
    let overflow = []
    for (let i = 0; i < (3 - React.Children.count(props.children) % 3); i++){
        overflow.push(<div style={{height:'65px', width:'65px'}}></div>)
    }
return (
<div> 

<div style={{padding: '5px', display:"flex", flexWrap:"wrap", gap:'10px', overflow:'auto', justifyContent:'center', alignContent:'center', width:'240px'}}>
    {props.children}
    {console.log(React.Children.count(props.children) % 3)}
    {overflow}
</div>
</div>
);
}