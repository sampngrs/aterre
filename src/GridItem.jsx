import './App.scss';

export default function GridItem(props){

    return (
        <div onClick={() => props.onClick(props.category)} className='GridItem' style={{cursor:'pointer', height:'65px', width:'65px', display:'flex', flexDirection:'column', gap:'5px'}}>
            {props.children}
        </div>

    );
}