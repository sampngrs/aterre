import _ from "lodash";
import PopCard from "./Components/PopCard";
import { useRef } from "react";
import useFetch, { Fetch } from "./utils/useFetch";

export default function Transport(props) {
    const transportRef = useRef(null)

    const {data} = props;
    console.log(data)

    const tubeLines = {
      'bakerloo': {
        'Hex': '#B36305',
        'RGB': '179, 99, 5',
        'CMYK': '0%, 45%, 97%, 30%',
        'Pantone': 'Pantone 470 C'
      },
      'central': {
        'Hex': '#E32017',
        'RGB': '227, 32, 23',
        'CMYK': '0%, 86%, 90%, 11%',
        'Pantone': 'Pantone 485 C'
      },
      'circle': {
        'Hex': '#FFD300',
        'RGB': '255, 211, 0',
        'CMYK': '0%, 17%, 100%, 0%',
        'Pantone': 'Pantone 116 C'
      },
      'district': {
        'Hex': '#00782A',
        'RGB': '0, 120, 42',
        'CMYK': '100%, 0%, 65%, 53%',
        'Pantone': 'Pantone 356 C'
      },
      'elizabeth': {
        'Hex': '#6950a1',
        'RGB': '105, 80, 161',
        'CMYK': '35%, 50%, 0%, 37%',
        'Pantone': 'Pantone 266 C'
      },
      'hammersmith-city': {
        'Hex': '#F3A9BB',
        'RGB': '243, 169, 187',
        'CMYK': '0%, 30%, 23%, 5%',
        'Pantone': 'Pantone 197 C'
      },
      'jubilee': {
        'Hex': '#A0A5A9',
        'RGB': '160, 165, 169',
        'CMYK': '5%, 2%, 0%, 34%',
        'Pantone': 'Pantone 430 C'
      },
      'metropolitan': {
        'Hex': '#9B0056',
        'RGB': '155, 0, 86',
        'CMYK': '0%, 100%, 45%, 39%',
        'Pantone': 'Pantone 235 C'
      },
      'northern': {
        'Hex': '#000000',
        'RGB': '0, 0, 0',
        'CMYK': '0%, 0%, 0%, 100%',
        'Pantone': 'Pantone Black C'
      },
      'piccadilly': {
        'Hex': '#003688',
        'RGB': '0, 54, 136',
        'CMYK': '100%, 60%, 0%, 47%',
        'Pantone': 'Pantone 072 C'
      },
      'victoria': {
        'Hex': '#0098D4',
        'RGB': '0, 152, 212',
        'CMYK': '100%, 28%, 0%, 17%',
        'Pantone': 'Pantone 299 C'
      },
      'waterloo-and-city': {
        'Hex': '#95CDBA',
        'RGB': '149, 205, 186',
        'CMYK': '27%, 0%, 9%, 20%',
        'Pantone': 'Pantone 338 C'
      },
      'dlr': {
        'Hex': '#00A4A7',
        'RGB': '0, 164, 167',
        'CMYK': '100%, 2%, 0%, 35%',
        'Pantone': 'Pantone 326 C'
      },
      'london-overground': {
        'Hex': '#EE7C0E',
        'RGB': '238, 124, 14',
        'CMYK': '0%, 48%, 94%, 7%',
        'Pantone': 'Pantone 158 C'
      },
      'london-trams': {
        'Hex': '#84B817',
        'RGB': '132, 184, 23',
        'CMYK': '28%, 0%, 88%, 28%',
        'Pantone': 'Pantone 368 C'
      },
      'emirates-cable-car': {
        'Hex': '#E21836',
        'RGB': '226, 24, 54',
        'CMYK': '0%, 89%, 76%, 11%',
        'Pantone': 'Pantone 485 C'
      }
    };


    const transportHeader = ({e}) => (

        <>
            <div style={{display:'flex', gap:"5px", alignItems:"center"}}>

                {e.lineModes.filter((e) => e.type != 'bus').map((e) =>  
                <svg style={{height:'10', width:'10px'}}>
                  <use href={`static/amenity/${_.snakeCase(e.type)}.svg#${_.snakeCase(e.type)}`} />  
                </svg>)}

                <span style={{marginLeft:'5px'}}>{e.name}</span>

            </div>

            {e.distance ? <div>
            <span style={{fontSize:'9px'}}>
            {Number((e.distance * 1000 / 1.42 / 60).toFixed(0)) + " min"}
            </span>

            <svg style={{height:'15', width:'15'}}>
                    <use href={'static/amenity/walking.svg#walking'} />
            </svg>

            </div> : null} 
        </>
    );

    const transportContent = ({e}) => { 
        
      
        return (
        <>        
        {
        e.lines.map((e) =>
        
        <div style={{display:'flex', flexDirection:"row", alignItems:"center", gap:'5px'}}>


        {/* <div style={{height:"3px", width:'10px', backgroundColor: e in tubeLines ? tubeLines[e].Hex : '#cf4a37'}} /> */}
        
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" style={{height:'10px'}}>
        <g fill="black">
        <rect x="0" y="35" height="30" width="150" fill={e in tubeLines ? tubeLines[e].Hex : '#cf4a37'} />
          <circle
            cx="75"
            cy="50.5"
            r="30"
            fill="var(--color-background)"
            stroke="var(--color-foreground)"
            strokeWidth="15"
          />

         
        </g>
      </svg>

        <span>{_.startCase(e)}</span>
        </div>


        
        )}

        {/* <span>{e.naptanId}</span> */}
        </>
    )}
  

    return (
      <div 
      ref={transportRef}
      style={{display:'flex', gap:'10px', flexDirection:"column"}}>
      {data ? 
            data
            
                .map((e) => 
                
                <PopCard e={e} header={transportHeader} content={transportContent} parentRef={transportRef}/>

                )
            
            : []}
      </div>
        

    );
}