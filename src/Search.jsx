
import './App.scss';
import Button from 'react-bootstrap/Button';

function Search (props) {


    return (
        <form onSubmit = {(event) => {event.preventDefault(); props.updateMap(event); props.setAccordionActive(false)}} 
        className='searchBar shadow'> 
            
            <GetInput input = {props.input} />
            
            <Button variant='outline-dark-custom btn-sm' type="submit" style={{borderRadius: '2px', position: 'absolute', right: '10px', height:'30px', verticalAlign:'middle', paddingTop:'5px'}}>

            {!props.isLoading && <span>↵</span>}
            {props.isLoading && <span class ="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}

            </Button>
            
           </form> 
    );
}

function GetInput (props) {

    return (
  
        <div className='searchBox'>
          <input
            placeHolder='Address or Postcode'
            ref={props.input}
            className='searchField'
            // onChange={this.props.handleChange}
            // defaultValue= 'Postcode, Location, or Place!'
            style={{height: '40px', paddingLeft: '10px', marginLeft: '0px', fontSize: '15px', width:'100%', paddingRight:'40px'}}
            />
        </div>
  );
  }

export default Search; 