import React, { Component } from 'react';
import { Modal, Button, Form, Message, Divider, Header, Icon } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

class NewClientModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            cegnev: '',
            szamlazasi_cim: '',
            adoszam: '',
            kozponti_telefonszam: '',
            price_scope: 'kisker',
            submitBtn: true,
            messageHidden: true,
            messageText: '',
            buttonLoader: false
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
        const { cegnev, szamlazasi_cim, price_scope } = this.state;

        if(cegnev.trim().length === 0 || szamlazasi_cim.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true, buttonLoader: false });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }

        API.post('ugyfel/create', 'cegnev='+encodeURIComponent(cegnev)+'&szamlazasi_cim='+encodeURIComponent(szamlazasi_cim)+'&adoszam='+this.state.adoszam+'&kozponti_telefonszam='+encodeURIComponent(this.state.kozponti_telefonszam)+'&price_scope='+price_scope+'&API_SECRET='+API_SECRET)
            .then(res => {
                var response = res.data;
                var company_id = response.company_id;
                if(response.error){
                    this.setState({ messageHidden: false, messageText: response.error, submitBtn: true, buttonLoader: false });
                    return;
                }
                if(company_id){
                    this.props.closeModal();
                    this.props.getData();
                    this.setState({ 
                        cegnev: '',
                        szamlazasi_cim: '',
                        adoszam: '',
                        kozponti_telefonszam: '',
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
            <Modal.Header>Új ügyfél létrehozása</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field required>
                            <label>Cégnév</label>
                            <input placeholder='Cégnév' name='cegnev' value={this.state.cegnev} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Számlázási cím</label>
                            <input placeholder='Számlázási cím' name='szamlazasi_cim' value={this.state.szamlazasi_cim} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Adószám</label>
                            <input placeholder='Adószám' name='adoszam' value={this.state.adoszam} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Központi telefonszám</label>
                            <input placeholder='Központi telefonszám' name='kozponti_telefonszam' value={this.state.kozponti_telefonszam} onChange={this.handleChange} />
                        </Form.Field>
                        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                            <Divider horizontal style={{ marginTop: '40px' }}>
                                <Header as='h4'>
                                    <Icon name='tag' />
                                    Árkedvezmény
                                </Header>
                            </Divider>
                            <Button.Group>
                                <Button active={(this.state.price_scope === 'kisker') ? true : false} onClick={ () => this.setState({price_scope: 'kisker'}) }>Kisker</Button>
                                <Button active={(this.state.price_scope === 'nagyker') ? true : false} onClick={ () => this.setState({price_scope: 'nagyker'}) }>Nagyker</Button>
                                <Button active={(this.state.price_scope === 'vip') ? true : false} onClick={ () => this.setState({price_scope: 'vip'}) }>VIP</Button>
                            </Button.Group>
                        </div>
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
                        content="Ügyfél létrehozása"
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

 
export default NewClientModal;