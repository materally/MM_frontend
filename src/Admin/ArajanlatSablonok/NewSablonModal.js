import React, { Component } from 'react';
import { Modal, Button, Form, Message } from 'semantic-ui-react'
import TextareaAutosize from "react-textarea-autosize";
import API, { API_SECRET } from '../../api';

class NewSablonModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            submitBtn: true,
            messageHidden: true,
            messageText: '',
            megnevezes: '',
            sablon: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ modalOpen: nextProps.openModal });  
    }

    closeModal = () => {
        this.setState({ submitBtn: true })
        this.props.closeModal();
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }
 
    submitBtn(){
        this.setState({ submitBtn: false })
        const { megnevezes, sablon } = this.state;
        if(megnevezes.trim().length === 0 || sablon.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }

        API.post('arajanlat/createSablon', 'megnevezes='+megnevezes+'&sablon='+sablon+'&API_SECRET='+API_SECRET)
            .then(res => {
                var response = res.data;
                if(response.error){
                    this.setState({ messageHidden: false, messageText: response.error, submitBtn: true });
                    return;
                }
                if(response.success){
                    this.props.closeModal();
                    this.props.getData();
                    this.setState({ 
                        megnevezes: '',
                        sablon: '',
                        submitBtn: true,
                        messageHidden: true,
                        messageText: ''
                    })
                }
            })
            .catch(error => {
                this.setState({ messageHidden: false, messageText: 'Hiba a szerver oldalon!', submitBtn: true });
            });
    
    }

    render(){
        return (
            <Modal open={this.state.modalOpen} onClose={this.closeModal} size="large" dimmer="blurring">
            <Modal.Header>Új sablon hozzáadása</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field required>
                            <label>Megnevezés</label>
                            <input placeholder='Megnevezés' name='megnevezes' value={this.state.megnevezes} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field 
                            required
                            control={TextareaAutosize}
                            label="Sablon tartalma"
                            placeholder="Sablon tartalma"
                            onChange={this.handleChange}
                            useCacheForDOMMeasurements
                            value={this.state.sablon}
                            name='sablon'
                        />
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
                        content="Sablon létrehozása"
                        type='submit' 
                        onClick={ () => this.submitBtn() }
                        disabled={!this.state.submitBtn}
                        loading={!this.state.submitBtn}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

 
export default NewSablonModal;