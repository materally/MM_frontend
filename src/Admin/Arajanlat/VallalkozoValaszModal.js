import React, { Component } from 'react';
import { Modal, Button } from 'semantic-ui-react'
import nl2br from 'react-nl2br';

class VallalkozoValaszModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            data: this.props.data
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ modalOpen: nextProps.openModal, data: nextProps.data });  
    }

    closeModal = () => {
        this.props.closeModal();
    }

    renderData(){
        if(this.state.data){
            const { data } = this.state 
            return (
            <Modal open={this.state.modalOpen} onClose={this.closeModal} size="small" dimmer="blurring">
                <Modal.Header>Válasz</Modal.Header>
                <Modal.Content>
                    {nl2br(data)}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='grey' onClick={this.closeModal}>Bezárás</Button>
                </Modal.Actions>
            </Modal>
            )
        }else{
            return null
        }
    }

    render(){
        return this.renderData() 
    }
}

 
export default VallalkozoValaszModal;