import React, { Component } from 'react';
import { Modal, Button, Form, Message } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

class EditDeliveryModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            user_id: this.props.user_id,
            company_id: this.props.company_id,
            vezeteknev: this.props.user_data.vezeteknev,
            keresztnev: this.props.user_data.keresztnev,
            email: this.props.user_data.email,
            telefonszam: this.props.user_data.telefonszam,
            submitBtn: true,
            messageHidden: true,
            messageText: '',
            buttonLoader: false,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ modalOpen: nextProps.openModal, user_id: nextProps.user_id, company_id: nextProps.company_id, vezeteknev: nextProps.user_data.vezeteknev, keresztnev: nextProps.user_data.keresztnev, email: nextProps.user_data.email, telefonszam: nextProps.user_data.telefonszam });  
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
        const user_id = this.state.user_id;
        const company_id = this.state.company_id;
        const vezeteknev = this.state.vezeteknev;
        const keresztnev = this.state.keresztnev;
        const email = this.state.email;
        const telefonszam = this.state.telefonszam;

        if(vezeteknev.trim().length === 0 || keresztnev.trim().length === 0 || email.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true, buttonLoader: false });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }
        API.post('ugyfel/editCompanyUser/'+company_id+'/'+user_id, 'vezeteknev='+vezeteknev+'&keresztnev='+keresztnev+'&email='+email+'&telefonszam='+telefonszam+'&API_SECRET='+API_SECRET)
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
                        vezeteknev: '',
                        keresztnev: '',
                        email: '',
                        telefonszam: '',
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
            <Modal.Header>Felhasználó szerkesztése</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field required>
                            <label>Vezetéknév</label>
                            <input placeholder='Vezetéknév' name='vezeteknev' value={this.state.vezeteknev} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Keresztnév</label>
                            <input placeholder='Keresztnév' name='keresztnev' value={this.state.keresztnev} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>E-mail cím</label>
                            <input placeholder='E-mail cím' name='email' value={this.state.email} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Telefonszám</label>
                            <input placeholder='Telefonszám' name='telefonszam' value={this.state.telefonszam} onChange={this.handleChange}/>
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
                        content="Felhasználó szerkesztése"
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