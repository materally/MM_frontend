import React, { Component } from 'react';
import { Modal, Button, Form, Message } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

class EditDeliveryModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            company_id: this.props.company_id,
            delivery_id: this.props.delivery_id,
            address: this.props.address,
            submitBtn: true,
            messageHidden: true,
            messageText: '',
            buttonLoader: false,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ modalOpen: nextProps.openModal, delivery_id: nextProps.delivery_id, address: nextProps.address });  
    }

    closeModal = () => {
        this.setState({ buttonLoader: false, submitBtn: true })
        this.props.closeModal();
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    submitBtnClick(){
        this.setState({ submitBtn: false, buttonLoader: true })
        const address = this.state.address;
        const company_id = this.state.company_id;
        const delivery_id = this.state.delivery_id;
        if(address.trim().length === 0 ){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true, buttonLoader: false });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }
        API.post('ugyfel/editDeliveryAddress/'+delivery_id+'/'+company_id, 'address='+address+'&API_SECRET='+API_SECRET)
            .then(res => {
                var response = res.data;
                if(response.error){
                    this.setState({ messageHidden: false, messageText: response.error, submitBtn: true, buttonLoader: false });
                    return;
                }
                if(response.success){
                    this.props.closeModal();
                    this.props.getData();
                    this.setState({ 
                        address: '',
                        submitBtn: true,
                        messageHidden: true,
                        messageText: '',
                        buttonLoader: false })
                }
            })
            .catch(error => {
                this.setState({ messageHidden: false, messageText: 'Hiba a szerver oldalon!', submitBtn: true, buttonLoader: false });
            });

    }

    render(){
        return (
            <Modal open={this.state.modalOpen} onClose={this.closeModal} size="small" dimmer="blurring">
            <Modal.Header>Kiszállítási cím szerkesztése</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field required>
                            <label>Cím</label>
                            <input placeholder='Cím' name='address' value={this.state.address} onChange={this.handleChange}/>
                        </Form.Field>
                    </Form>
                    <Message color='red' hidden={this.state.messageHidden}>
                        <b>Hiba!</b> <br />
                        {this.state.messageText}
                    </Message>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='grey' onClick={this.closeModal}>Mégsem</Button>
                    <Button
                        positive
                        compact
                        icon='checkmark'
                        labelPosition='right'
                        content="Cím szerkesztése"
                        type='submit' 
                        onClick={ () => this.submitBtnClick() }
                        disabled={!this.state.submitBtn}
                        loading={this.state.buttonLoader}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

 
export default EditDeliveryModal;