import React from "react";

export default function Grid(props){

    let overflow = []
    for (let i = 0; i < (3 - React.Children.count(props.children) % 3); i++){
        overflow.push(<div style={{aspectRatio:'1/1', width:'calc(30%)'}}></div>)
    }
return (
<div> 

<div style={{padding: '5px', display:"flex", flexWrap:"wrap", gap:'10px', overflow:'auto', justifyContent:'center', alignContent:'center', width:'240px'}}>
    {props.children}

    {overflow}
</div>
</div>
);
}