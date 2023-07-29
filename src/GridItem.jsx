import './App.scss';

export default function GridItem(props){

    return (
        <div onClick={() => (props.onClick(props.category), props.scroll())} className='GridItem' style={{cursor:'pointer', aspectRatio: '1/1', width:'calc(30%)', display:'flex', flexDirection:'column', gap:'5px'}}>
            {props.children}
        </div>

    );
}