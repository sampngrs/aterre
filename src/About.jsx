import React, { useState, useEffect } from 'react';

import './App.scss';
import Window from './Window.jsx'

function About (props) {


return (

            <Window {...props} > 
            <div style={{width: '500px', height: '300px', backgroundColor:'white'}}> 
			<b> <br /> About </b> 
            <br /><br />

            <p style ={{marginLeft:'20px', marginRight:'20px', width:'100', textAlign:'center'}}> 

            aterre. aims to inform the nieghbourhood decision through data to paint a full picture of any user-defined area. 
            By integrating key indicators from a range of different public sources, the user can access instant analysis of prospective 
            areas and easily compare the merits of each.</p> 

            
            <div style={{width: '100% ', position:'absolute', bottom: '5px', display: 'flex', alignItems:'center', flexDirection:'row', paddingRight: 30, paddingLeft: 30, justifyContent:'space-between'}} > 
            <img style ={{borderRadius:100, margin: 12}} src='static/social/headshot.png' height='50' width = '50' />
            
            <span style={{fontSize: '12px', margin: 12, lineHeight:1.2, textAlign:'left'}}> This project was conceptualised, designed <br />and created by Samuel Panagrosso. </span>
            <a href='https://www.linkedin.com/in/samuel-panagrosso/' target="_blank"><img style ={{margin: 12}} src='static/social/linkedin.png' height='30px' width = '30px' /></a> 
            
            
            </div> 


			{/*<div style={{position:'absolute', left: '5px', bottom: '10px', margin:5}} > 
            <img style ={{borderRadius:100, margin: 10}}src='static/social/headshot.png' height='50' width = '50' />
            <a href='https://www.linkedin.com/in/samuel-panagrosso/' target="_blank"><img  src='static/social/linkedin.png' height='30px' width = '30px' /></a> 
            <h1 style={{fontSize: '12px', margin: 10, lineHeight:1.2, textAlign:'left', display:'inline'}}> This project was created and designed by Samuel Panagrosso </h1>
            </div> */}
            </div>
            </Window>
            


	
	);

}


export default About;