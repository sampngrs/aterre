import Tabulate from './Tabulate';

export default function Places(props){
    const {data} = props

    return (
        <>
        <div style={{height:'180px', position:'relative', overflow:'hidden',
        // border:'1px solid var(--color-foreground)', 
        borderRadius:"5px"}}> 

                <img src='static/images/venue.jpg' style={{objectFit:'cover', height:'100%', width:'100%'}}/>
            
                <div style={{position:'absolute', inset:0, backgroundColor:'black', opacity: 0.4}} />

                <div style={{position:'absolute', display:'flex', inset:0, flexDirection:'column', width:'100%', height:'100%', padding:'10px', color:'white', justifyContent:'flex-end'}} > 
                
                <span>Crate Brewery, Hackney Road</span> 
                <span style={{fontSize:'12px'}}>★★★★☆</span>

                </div>
        
            </div>

            <Tabulate 
                setPins={props.setPins} 
                data={(data) ? data.elements : []} 
                tabKeys={['tags.shop', 'tags.amenity', 'tags.leisure']}/>
        </>
    );
}