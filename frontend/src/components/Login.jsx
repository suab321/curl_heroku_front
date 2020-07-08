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
            this.setState({register:false,toggle_button:'Click to Register'});
        }
        else
            this.setState({register:true, toggle_button:"Click to Login"})
    }

    login(){
        const body={
            email:this.email.current.value,
            password:this.password.current.value
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
        // return(
        //     <div>
        //         <div style={{textAlign:'center',border:'1px solid black', width:'40%', height:'500px',margin:'10% 30%'}}>
        //             <div style={{textAlign:'center'}}>
        //                 <input type='text' ref={this.email} placeholder="Enter your email Id"/>

        //             </div>
                
        //             {/* <a href={`${backURL}/authentication/google_login`}><Button color="secondary" style={{marginTop:'224px',marginLeft:'138px',color:'blue'}}>Google</Button></a> */}
        //         </div>
        //     </div>
        // )
        if(this.state.redirect){
            return(
                <Redirect to='/profile'/>
            )
        }
        else{
            return(
                <div style={{textAlign:"center"}}>
                <div>
                <a href={`${backURL}/authentication/google_login`}><Button color="secondary" style={{marginTop:'3px',marginRight:'10%',color:'blue'}}>Google</Button></a>
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
                    <p style={{fontFamily: "sans-serif"}}>Dont Have an Account!</p>
                    </div>
                    <Button onClick={this.toggle}>{this.state.toggle_button}</Button>
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
                    padding-top: 1em;
                    padding-bottom: 1em;
                    background-color: rgb(149,78,87);
                }
                label{
                    font-size: 1em;
                    font-family: sans-serif;
                }
                input{
                    font-size: 1.5em;
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
