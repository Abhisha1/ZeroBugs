import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FirebaseContext } from "../../components/Firebase";
import './editmodal.scss';
import '../Button/button.scss';

/**
 * CustomModal is used to search through users and return matching users
 * in a pop up/modal.
 */

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, searchedUsers: [], familyMember: '' };
        this.handleModal = this.handleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * This function changes the modal's visibility depending approapriately
     * and resets the family members stored state.
     */
    handleModal() {
        if (this.state.showModal === false) {
            this.setState({ showModal: true });
        }
        else {
            this.setState({ showModal: false })
        }
        this.setState({ familyMember: '' });
    }

    /**
     * Changes the respective values on input changes
     * @param event The event trigerred by an input change
     */
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }
    /**
     * Checks if a user belongs in the family of interest, and renders an add option if they dont and remove if they do
     * @param user The user we are checking whether they exist or not
     * @return All users (besides admin) and whether you can add or remove them
     */
    addOrRemoveMembers(user, firebase) {
        for (let key in this.props.family["users"]) {
            // console.log(existingUser.name+"   and name we looking for  "+user.name);
            let existingUser = this.props.family["users"][key].email;
            if (user.email === this.props.family.admin.email) {
                return;
            }
            else if (existingUser === user.email) {
                return (
                    <div id="searchResult" key={user.email}><p id="modalText" key={user.email}>{user.displayName}</p>
                        <button variant="primary" id="modalRemove" onClick={() => firebase.removeFromFamily(user, 'families', this.props.family)}>Remove</button>
                    </div>)
            }
        }
        return (<div id="searchResult" key={user.email}><p id="modalText" key={user.email}>{user.displayName}</p>
            <button variant="primary" id="modalAdd" onClick={() => firebase.addToFamily(user, 'families', this.props.family)}>Add</button>
        </div>);
    }


    /**
     * Returns the custom modal to the webpage
     */
    render() {
        return (
            <div>

                <Button variant="outline-secondary" onClick={this.handleModal} id="edit-button">Edit Users</Button>

                <Modal show={this.state.showModal} onHide={this.handleModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Current Members</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FirebaseContext.Consumer>
                            {firebase =>
                                // Search bar
                                <div>
                                    < InputGroup className="mb-3" >
                                        <FormControl
                                            placeholder="User"
                                            aria-label="Users"
                                            name="familyMember"
                                            value={this.state.familyMember}
                                            onChange={this.handleChange}
                                        />
                                        <InputGroup.Append>
                                            {/* Searches database for users matching input search */}
                                            <Button variant="outline-secondary" onClick={() => firebase.searchUsers(this.state.familyMember, this)} id="edit-button">Search</Button>

                                        </InputGroup.Append>
                                    </InputGroup>
                                    {/* Renders the search result in modal */}
                                    <div id="searchResults">
                                        {this.state.searchedUsers.map(user => (
                                            this.addOrRemoveMembers(user, firebase)))}
                                    </div>
                                </div>
                            }
                        </FirebaseContext.Consumer>
                    </Modal.Body>

                </Modal>

            </div >
        )
    }
}

export default EditModal;