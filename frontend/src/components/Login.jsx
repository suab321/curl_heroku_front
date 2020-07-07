import React from 'react';
import {Button} from 'react-materialize'

const {backURL}=require('../back_url');
class Login extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div style={{}}>
            <div style={{marginLeft:'200px'}}>
                <div style={{height:'500px',width:'345px',border:'3px solid black'}}>
                    <a href={`${backURL}/authentication/google_login`}><Button variant="contained" color="secondary" style={{marginTop:'224px',marginLeft:'138px',color:'blue'}}>login</Button></a>
                    </div>
            </div>
            <style>
                .
            </style>
            </div>
        )
    }
}

export default Login;
