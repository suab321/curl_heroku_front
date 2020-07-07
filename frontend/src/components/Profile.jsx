import React from 'react';
import Axios from 'axios';
import {backURL} from '../back_url.js';
import cookie from 'react-cookies';
import {Button} from 'react-bootstrap';
class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            details:false,
            user:{},
            uploadPhoto:false,
            file:null,
            zone:false,
            wait:true
        }
        this.upload = this.upload.bind(this);
        this.selected = this.selected.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.updateZone = this.updateZone.bind(this);
    }

    async upload(){
        console.log(this.state.file)
        if(this.state.file === null){
            alert("Select a image file");
            return;
        }
        let formdata=new FormData();
        formdata.append('file',this.state.file);
        Axios.post(`${backURL}/api/upload`,formdata,{headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            alert("Your photo was uploaded successfully");
            this.fetchData();
        })
    }

    async updateZone(){
        console.log(document.getElementById("zone").value);
        await Axios.get(`${backURL}/api/update_zone?zone=${document.getElementById("zone").value}`,{headers:{Authorization: `Bearer ${cookie.load('token')}`}});
        alert("zone is updated");
        this.setState({zone:false});
    }
    
    selected(event){
        let file = event.target.files[0];
        let name = file.name.split('.');
        name = name[name.length-1];
        if(name === 'jpeg' || name === 'png' || name === 'gif' || name === "jpg"){
            this.setState({file:event.target.files[0]});
        }
        else
            alert("please upload a image format");
    }

    fetchData(){
        Axios.get(`${backURL}/api/get_user`,{headers:{Authorization: `Bearer ${cookie.load("token")}`}}).then(res=>{
            let zone=false;
            if(res.data.zone === "")
                zone=true;
            this.setState({user:res.data,uploadPhoto:false,zone:zone,wait:false});
        });
    }

    componentDidMount(){
        this.fetchData();
    }

    render(){
        // console.log(this.state.zone);
        if(this.state.wait){
            return(
                <div style={{textAlign:'center'}}>
                    <h1>Please Wait</h1>
                </div>
            )
        }
        else{
        return(
            <div style={{textAlign:'center', marginTop:'4%', border:'2px solid black',width:'50%',marginLeft:'25%',backgroundColor:'lightyellow'}}>
                <div>
               
                    <img style={{background:'transparent',marginTop:'3%'}} src={`${this.state.user.photo}`} height="200px" width="200px"/><br/><br/>
                <h1 style={{fontSize:'24px',color:'darkred'}}>{this.state.user.name}</h1><br/>
                    <h3 style={{textAlign:'left',paddingLeft:'43%',fontSize:'20px'}}>Score : <span style={{color:'green'}}><b>{this.state.user.score}</b></span></h3>
                    <h3 style={{textAlign:'left',paddingLeft:'43%',fontSize:'20px'}}>Current Daily Streak : <span style={{color:'green'}}><b>{this.state.user.dailyStreak}</b></span></h3>
                    <h3 style={{textAlign:'left',paddingLeft:'43%',fontSize:'20px'}}>Max Winning Stream : <span style={{color:'green'}}><b>{this.state.user.maxDailyStreak}</b></span></h3>
                    <br/>
                    <div>
                     
                    <Button variant="primary" onClick={()=>{this.setState({uploadPhoto:!this.state.uploadPhoto})}}>Upload New Photo</Button>
                    <div hidden={!this.state.uploadPhoto}>
                        <div>
                            <br/>
                            <input onChange={this.selected} type="file"/>
                            <Button  variant="primary" onClick={this.upload}>Upload</Button>
                        </div>
                     
                    </div>
                    <br/><br/>
                    <div hidden={!this.state.zone}>
                        <br/>
                        <h3 style={{textAlign:'left',paddingLeft:'20%',fontSize:'20px'}}>Select Your Zone</h3>
                        <select style={{display:'block',width:'10%',marginLeft:'40%'}} name="zone" id="zone">
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="West">West</option>
                        <option value="East">East</option>
                        </select>
                        <Button variant="primary" style={{display:'block',width:'10%',marginLeft:'52%'}} onClick={this.updateZone}>Update</Button>
                    </div>
                    </div>
                    </div>
            </div>
        )
      }
    }
}

export default Profile;