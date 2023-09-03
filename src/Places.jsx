import Gallery from './Gallery';
import Tabulate from './Tabulate';

export default function Places(props){
    const {data} = props

    return (
        <>
            <Gallery />

            <Tabulate 
                setPins={props.setPins} 
                data={(data) ? data.elements : []} 
                tabKeys={['tags.shop', 'tags.amenity', 'tags.leisure']}/>
        </>
    );
}