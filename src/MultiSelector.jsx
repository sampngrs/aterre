import { useState, useRef, useEffect } from "react";


function MultiSelector(props) {
    const inputRef = useRef()
    const [items, setItems] = useState(["Bank Underground Station"])
    

    useEffect(() => {
        setItems(props.items)
    }, [])




    return (
        <div className = 'multiBox' style={{padding: '5px', margin: '2px', borderStyle: 'solid', display:"flex", flexWrap:"wrap", alignContent:"flex-start", alignItems:'center', gap:'5px'}}> 
             {items.map((x, index) => <ItemBox input={inputRef} setItems={setItems} value={x}> {x} </ItemBox>)}
            <TypeBox input={inputRef} setItems={setItems}/> 
        </div>
    );
}

function ItemBox (props) {
    const {setItems} = props
    const {value} = props
    return (
        <div 
        onClick={() => setItems((array) => 
            array.filter((x) => x != value)
        )}
        style={{backgroundColor:'black', borderRadius:'5px', color:'white', margin: '0 0 0 0', padding:'2px 7px 2px 7px', fontSize:'14px', cursor:'pointer'}} > 
        {props.children}
        <img src='static/UI/cancel.svg' height='10px' width = '10px' fill="#FFFFFF !important" stroke="#FFFFFF"/>
        </div>
    );
}

function TypeBox (props) {

    const {setItems, input} = props

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const value = input.current.value
            setItems(old => [...old, value])
            input.current.value = ''
        }
        if (event.key === 'Backspace' && input.current.value == '') {
            setItems(old => old.slice(0, -1))
        }
      }

    return (
       
        <div style={{flexGrow:'2'}}>
          <input
            placeHolder='...'
            ref={props.input}
            className='typeBox'
            onKeyDown={handleKeyDown}
            // onChange={this.props.handleChange}
            // defaultValue= 'Postcode, Location, or Place!'
            style={{margin: '0 0 0 0', padding:'2px 7px 2px 7px', fontSize: '15px', width:'100%'}}
            />
        </div>
  );
  }


export default MultiSelector;