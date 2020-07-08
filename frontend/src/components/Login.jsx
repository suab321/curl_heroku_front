import React from 'react';
import {Button} from 'react-bootstrap';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import cookie from 'react-cookies';

const {backURL}=require('../back_url');
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            register:false,
            toggle_button:'Click to Register',
            toggle_display:'Have an Account',
            redirect:false
        }
        this.email = React.createRef();
        this.password = React.createRef();
        this.cpassword = React.createRef();
        this.name = React.createRef();

        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle(){
        if(this.state.register){
            this.setState({register:false,toggle_button:'Click to Register', toggle_display:"Dont have an Account"});
        }
        else
            this.setState({register:true, toggle_button:"Click to Login", toggle_display:"Have an Account"});
    }

    login(){
        const body={
            email:this.email.current.value,
            password:this.password.current.value
        }
        if(!body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            alert("Enter a valid email");
            return;
        }
        console.log(body);
        Axios.post(`${backURL}/auth/login`,body).then(res=>{
            cookie.save('token',res.data);
            window.location.reload();

            // this.setState({redirect:true});
        }).catch(err=>{
            alert('There is some problem with your login')
        })
    }

    register(){
        const cpassword = this.cpassword.current.value;
        const password = this.password.current.value;
        const email = this.email.current.value;
        const name = this.name.current.value;
        if(password !== cpassword){
            alert("passwords dont match !");
        }
        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            alert("Enter a valid email address");
            return;
        }
        if(password === ''){
            alert("Enter valid password");
            return;
        }
        else{
            const body={
                email,password,name
            }
            Axios.post(`${backURL}/auth/register`, body).then(res=>{
                cookie.save('token',res.data);
                window.location.reload();

                // this.setState({redirect:true});
            }).catch(err=>{
                alert("There was problem registering you");
            })
        }
    }
    render(){
        if(this.state.redirect){
            return(
                <Redirect to='/profile'/>
            )
        }
        else{
            return(
                <div style={{textAlign:"center"}}>
                <div>
                {/* <a href={`${backURL}/authentication/google_login`}><Button color="secondary" style={{marginTop:'3px',marginRight:'10%',color:'blue'}}>Google</Button></a> */}
                    <div class='form'>
                    <div>
                    <label style={{fontSize: "2em"}}>LOGIN</label><br/><br/><br/>
                    <img src="https://s3.amazonaws.com/thumbnails.illustrationsource.com/huge.102.513291.JPG" alt="" width="200px" height="100px"/><br/><br/>
                    <label hidden={!this.state.register}>Name</label><br/><br/>
                    <input hidden={!this.state.register}type="text" name="name" required ref={this.name}/><br/><br/>
                    <label>Email</label><br/><br/>
                    <input type="email" name="email" required ref={this.email}/><br/><br/>
                    <label>Password</label><br/><br/>
                    <input type="password" name="password" required ref={this.password}/><br/><br/>
                    <label hidden={!this.state.register}>Confirm Password</label><br/><br/>
                    <input hidden={!this.state.register} type="password" name="cpassword" required ref={this.cpassword}/><br/>
                    <Button hidden={this.state.register} style={{cursor: "pointer",fontSize: "1em"}}onClick={this.login}>Login</Button><br/>
                    <Button hidden={!this.state.register} style={{cursor: "pointer",fontSize: "1em"}}onClick={this.register}>Register</Button><br/>
                    <p style={{fontFamily: "sans-serif"}}>{this.state.toggle_display}</p>
                    </div>
                    <Button onClick={this.toggle} style={{marginRight:'10px'}}>{this.state.toggle_button}</Button>
                    <Button hidden={this.state.register} href={`${backURL}/authentication/google_login`}>Google Login</Button>
                    </div>
                </div>
                <style jsx>
                {`
                .form{
                    border: 1px solid black;
                    width:30em;
                    padding: 5px;
                    margin-left: 42em;
                    margin-top: 1em;
                    margin-right: 10em;
                    text-align: center;
                    padding-top: 20px;
                    padding-bottom: 20px;
                    background-color: rgb(149,78,87);
                }
                label{
                    font-size: 1em;
                    font-family: sans-serif;
                }
                input{
                    font-size: 0.5em;
                    text-align: center;
                }
                `}
                </style>
                </div>
            )
        }
    }
}

export default Login;
