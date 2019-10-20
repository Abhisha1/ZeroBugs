import React, { Component } from "react";
import Cards from "./../../components/Card";
import PlusCard from "./../../components/plusCard";
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import { withAuthorization } from "./../../components/Session";
import RenderFamilies from "./renderFamilies";
import "./container.scss"
import Button from '@material-ui/core/Button';



class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            artefactList: null,
            uid: null,
            dataReady: false,
            cardData: [],
            searchArtifact: null,
            plusCardAdded: false,
        }
    }
    componentDidMount =() => {
        this.props.firebase.auth.onAuthStateChanged((user)=>{
            if(user){
                this.setState({uid: user.uid});
                this.props.firebase.getArtefactData(this, this.state.uid);
            }
        })

    }

    handleChange = e => {
        this.setState({...this.state, searchArtifact: e.target.value});   
        console.log(this.searchArtifact);  
    }

    handleSearch = () => {
        this.props.firebase.getSearchArtifact(this.state.searchArtifact, this);
    }


    render(){
        let artefacts = (<div class="container">
            {this.state.dataReady && 
            this.state.artefactList.map(item=> (
                <div key={item.name.artefactName}>
                    <Cards key={item.name.artefactName} artefactName={item.name.artefactName}
                         description={item.name.artefactBrief} date={item.name.date}
                         image={item.name.imagesURL[0]}/>
                </div>
            ))}
            {!this.state.artefactList && <PlusCard />}
        </div>)
        return(


            <div>
              <div>
                <RenderFamilies/>
              </div>
                <Divider />
                <h1 id="account-heading">Your Artefacts</h1>
                <div class="textboxContainer">
                    <TextField 
                    className="textbox" 
                    type="search" 
                    margin-right="20px" 
                    placeholder="Search for Artefact"
                    onChange={this.handleChange}></TextField>

                    <Button variant="outlined" className="searchButton" onClick={this.handleSearch}>Search</Button> 
                </div>
                <div class="container">
                    {artefacts}
                </div>
            </div>

        );

    }
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
