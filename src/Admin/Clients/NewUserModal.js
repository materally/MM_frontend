import React, { Component } from 'react';
import { Modal, Button, Form, Message } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

class NewUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            admin_user_id: localStorage.getItem('user_id'),
            adminInfo: [],
            modalOpen: this.props.openModal,
            company_id: this.props.company_id,
            submitBtn: true,
            messageHidden: true,
            messageText: '',
            buttonLoader: false,
            vezeteknev: '',
            keresztnev: '',
            email: '',
            telefonszam:'',
        }
        this.handleChange = this.handleChange.bind(this)
        this.loadAdminInfo()
    }

    loadAdminInfo(){
        API.get(`admin/adminInfo/${this.state.admin_user_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res2 => {
            var response2 = res2.data;
            if(response2){
                this.setState({ adminInfo: response2 });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ modalOpen: nextProps.openModal });  
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
        const company_id = this.state.company_id;
        const email = this.state.email;
        const telefonszam = this.state.telefonszam;
        const vezeteknev = this.state.vezeteknev;
        const keresztnev = this.state.keresztnev;
        const admin_nev = this.state.adminInfo.vezeteknev + ' ' + this.state.adminInfo.keresztnev

        if(email.trim().length === 0 || keresztnev.trim().length === 0 || vezeteknev.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true, buttonLoader: false });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }

        API.post('ugyfel/createUser/'+company_id, 'email='+email+'&telefonszam='+encodeURIComponent(telefonszam)+'&vezeteknev='+vezeteknev+'&keresztnev='+keresztnev+'&admin_nev='+admin_nev+'&admin_tel='+encodeURIComponent(this.state.adminInfo.telefonszam)+'&API_SECRET='+API_SECRET)
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
                        email: '',
                        telefonszam: '',
                        vezeteknev: '',
                        keresztnev: '',
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
            <Modal.Header>Új felhasználó hozzáadása</Modal.Header>
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
                        content="Felhasználó hozzáadása"
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

 
export default NewUserModal;