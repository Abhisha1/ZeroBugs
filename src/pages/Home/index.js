import React, { Component } from "react";
import Cards from "./../../components/Card";
import PlusCard from "./../../components/plusCard";
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withAuthorization } from "./../../components/Session";
import RenderFamilies from "./renderFamilies";
import "./container.scss"



class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artefactList: [],
            uid: null,
            dataReady: false,
            cardData: [],
            plusCardAdded: false,
        }
    }
    componentDidMount = () => {
        this.props.firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ uid: user.uid });
                this.props.firebase.getArtefactData(this, this.state.uid);
            }
        })
    }
    handleSearch = e => {
        this.props.firebase.getArtefactData(this, this.state.uid);
        let newArtefacts = [];   
        this.state.artefactList.map(artefact => {
            if(artefact.artefactName.toLowerCase().includes(e.target.value.toLowerCase())){
                newArtefacts.push(artefact);
            }
        })
        this.setState({...this.state, searchArtifact: e.target.value, artefactList: newArtefacts});
    }





    render() {
        let artefacts = [];
        if (this.state.dataReady && this.state.artefactList){
            this.state.artefactList.map(item => (
                <div key={item.artefactName}>
                    {artefacts.push(<Cards key={item.artefactName} artefactName={item.artefactName}
                        description={item.artefactBrief} date={item.date}
                        image={item.imagesURL[0]} />)}
                </div>
            ))
        }
        artefacts.push(<PlusCard key="plus" />);
        return (


            <div>
                <div>
                    <RenderFamilies />
                </div>
                <Divider />
                <h1 id="account-heading">Artefacts</h1>
                <div className="textboxContainer">
                    <TextField 
                    className="textbox" 
                    type="search" 
                    margin-right="20px" 
                    placeholder="Search for Artefact"
                    onChange={this.handleSearch}></TextField>
                </div>
                <div className="container">
                    {artefacts}
                </div>
            </div>

        );

    }
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);