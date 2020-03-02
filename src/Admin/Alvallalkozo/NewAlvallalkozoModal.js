import React, { Component } from 'react';
import { Modal, Button, Form, Message, TextArea } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

class NewAlvallalkozoModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            submitBtn: true,
            messageHidden: true,
            messageText: '',
            buttonLoader: false,
            
            email: '',
            vezeteknev: '',
            keresztnev: '',
            telefon: '',
            cegnev: '',
            megnevezes: '',
            adoszam: '',
            bankszamlaszam: '',
            megjegyzes: ''

        }
        this.handleChange = this.handleChange.bind(this)
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
        const { email, vezeteknev, keresztnev, telefon, cegnev, megjegyzes, megnevezes, bankszamlaszam, adoszam } = this.state;
        
        if(cegnev.trim().length === 0 || vezeteknev.trim().length === 0 || keresztnev.trim().length === 0 || email.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true, buttonLoader: false });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }
        API.post('alvallalkozo/create', 'cegnev='+cegnev+'&email='+email+'&vezeteknev='+vezeteknev+'&keresztnev='+keresztnev+'&telefon='+telefon+'&megjegyzes='+megjegyzes+'&megnevezes='+megnevezes+'&bankszamlaszam='+bankszamlaszam+'&adoszam='+adoszam+'&API_SECRET='+API_SECRET)
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
                        vezeteknev: '',
                        keresztnev: '',
                        telefon: '',
                        cegnev: '',
                        megnevezes: '',
                        adoszam: '',
                        bankszamlaszam: '',
                        megjegyzes: '',
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
            <Modal.Header>Új alvállalkozó hozzáadása</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field required>
                            <label>Cégnév</label>
                            <input placeholder='Cégnév' name='cegnev' value={this.state.cegnev} onChange={this.handleChange}/>
                        </Form.Field>
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
                            <input placeholder='Telefonszám' name='telefon' value={this.state.telefon} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Megnevezés</label>
                            <input placeholder='Megnevezés' name='megnevezes' value={this.state.megnevezes} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Adószám</label>
                            <input placeholder='Adószám' name='adoszam' value={this.state.adoszam} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Bankszámlaszám</label>
                            <input placeholder='Bankszámlaszám' name='bankszamlaszam' value={this.state.bankszamlaszam} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Megjegyzés</label>
                            <TextArea placeholder='Megjegyzés' name='megjegyzes' value={this.state.megjegyzes} onChange={this.handleChange}/>
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
                        content="Alvállalkozó hozzáadása"
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

 
export default NewAlvallalkozoModal;