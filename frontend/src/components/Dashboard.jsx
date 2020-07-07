import React from 'react';
import Axios from 'axios';
import cookie from 'react-cookies';
import {Dropdown,Button} from 'react-bootstrap'

const {backURL} = require('../back_url');

class Dashboard extends React.Component{
    constructor(){
        super();
        this.state={
            users:[],
            filtered_user:[],
            lead_obj:{},
            me:{},
            zone:null,
            wait:true
        }
        this.getLeader = this.getLeader.bind(this);
        this.sortData = this.sortData.bind(this);
        this.zone_selected = this.zone_selected.bind(this);
        this.lead_obj = {};
    }

    getLeader(){
        console.log(this.state.filtered_user)
        // if(this.state.filtered_user.length === 0)
        //     return {};
        let lead_obj = null;
        this.state.filtered_user.forEach(user=>{
            if(lead_obj === null){
                lead_obj = user;
            }
            else if(lead_obj.score < user.score)
                lead_obj = user;
        })
        return lead_obj;
    }

    zone_selected(event){
        console.log(event.target.id);
        const zone = event.target.id;
        if(zone === "All"){
            this.setState({zone:zone,filtered_user:this.state.users});
        }
        else{
            let filtered_user = this.state.users.filter(i=>{
                if(i.zone === zone)
                    return i;
            });
            this.setState({zone:zone,filtered_user:filtered_user});
        } 
    }

    sortData(){
        let sortedData = this.state.filtered_user;
        for(let i=0;i<this.state.filtered_user.length;i++){
            for(let j=i+1;j<this.state.filtered_user.length;j++){
                if(sortedData[i].score<sortedData[j].score){
                    let temp = sortedData[i];
                    sortedData[i] = sortedData[j];
                    sortedData[j] = temp;
                }
            }
        }
        return sortedData;
    }

    componentDidMount(){
        Axios.get(`${backURL}/api/get_user`, {headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            this.setState({me:res.data});
        }).catch(err=>{
            this.setState({redirect:true})
        })
        Axios.get(`${backURL}/api/all_user`, {headers:{Authorization: `Bearer ${cookie.load('token')}`}}).then(res=>{
            this.setState({users:res.data,filtered_user:res.data,wait:false});
        }).catch(err=>{
            this.setState({redirect:true});
        })
    }
    render(){
        // console.log(this.state);
        let sorted_users = this.sortData();
        let lead_obj = this.getLeader();
        console.log(lead_obj);
        let dont_show=false;
        if(lead_obj === null){
            dont_show=true;
            lead_obj = {};
        }
        
        let you_topper = false;
        if(lead_obj._id === this.state.me._id)
            you_topper = true;
        const UI = sorted_users.map(user=>{
                if(user._id === lead_obj._id)
                    return ("");
                if(user._id === this.state.me._id){
                    return(
                        <div style={{border:'1px solid black',margin:'10px 30%',background:'lightblue'}}>
                            <img style={{padding:'3px'}} src={`${user.photo}`} height='50px' width='50px'/><br/>
                            <h4>{`${user.name}`}</h4>
                            <h4>{`${user.score}`}</h4>
                        </div>
                    )
                }
                return(
                    <div style={{border:'1px solid black',margin:'10px 30%',background:'lightyellow'}}>
                        <img style={{padding:'3px'}} src={`${user.photo}`} height='50px' width='50px'/><br/>
                        <h4>{`${user.name}`}</h4>
                        <h4>{`${user.score}`}</h4>
                    </div>
                )
            });
            if(this.state.wait){
                return(
                    <div style={{textAlign:'center'}}>
                        <h1>Please Wait</h1>
                    </div>
                )
            }
            else{
                return(
                    <div style={{textAlign:"center"}}>
                    <div style={{textAlign:"center"}}>
                    {/* <select style={{display:'block',width:'10%',marginLeft:'40%'}} name="zone" id="zone" onChange={this.zone_selected}>
                        <option value="All">All</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="West">West</option>
                        <option value="East">East</option>
                    </select> */}
                    <Dropdown style={{marginTop:'2%'}}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" style={{width:'20%',height:'10%'}}>
                            <span><b>Select a Zone</b></span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item id="North" onClick={this.zone_selected}>North</Dropdown.Item>
                            <Dropdown.Item id="South" onClick={this.zone_selected}>South</Dropdown.Item>
                            <Dropdown.Item id="West" onClick={this.zone_selected}>East</Dropdown.Item>
                            <Dropdown.Item id="East" onClick={this.zone_selected}>West</Dropdown.Item>
                            <Dropdown.Item id="All" onClick={this.zone_selected}>All Zone</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </div>
                    <br/>
                    <div hidden={dont_show}>
                        <h1 style={{color:'black',fontSize:'40px'}}><b>Leader Board</b></h1>
                        <h2 style={{color:'red'}} hidden={!you_topper}>Congrats you are a leader in your zone</h2>
                        <div style={{border:'1px solid black',margin:'10px 30%',background:'lightpink'}}>
                        <img src={`${lead_obj.photo}`} height='80px' width='80px' style={{marginTop:'3%'}}/>
                        <br/><br/>
                        <h3 style={{fontSize:'24px',color:'black'}}><b>{`${lead_obj.name}`}</b></h3>
                        <h3><b>{`${lead_obj.score}`}</b></h3>
                        </div>
                        <br/>
                        <h1 style={{color:'black',fontSize:'40px'}}><b>Others</b></h1>
                    </div>
                    <div style={{textAlign:'center'}} hidden={!dont_show}>
                        <br/><br/>
                        <h1>No One till now from this zone</h1>
                    </div>
                    {UI}
                </div>
            )
        }
    }
}

export default Dashboard;