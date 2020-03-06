import React, { Component } from 'react';
import { Modal, Button, Form, Message } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import './NewArModal.css';

class NewArModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            submitBtn: true,
            messageHidden: true,
            messageText: '',

            megnevezes: '',
            mennyiseg_egysege: '',
            mennyiseg: 1,
            alapanyag_netto_bekereules_ar: 0,
            nyomtatas_netto_bekerules_ar: 0,
            egyeb_koltseg: 0,
            bekerules_netto_ar: 0,
            megjegyzes: '',
            eladasi_netto_vip_ar: 0,
            eladasi_netto_nagyker_ar: 0,
            eladasi_netto_kisker_ar: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeBekerulesiAr = this.handleChangeBekerulesiAr.bind(this)
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

    handleChangeBekerulesiAr(event){
        this.setState({[event.target.name]: event.target.value}, () => {
            const { alapanyag_netto_bekereules_ar, nyomtatas_netto_bekerules_ar, egyeb_koltseg } = this.state
            let sum = Number(alapanyag_netto_bekereules_ar) + Number(nyomtatas_netto_bekerules_ar) + Number(egyeb_koltseg);
            this.setState({ bekerules_netto_ar: sum })
        });
    }
 
    submitBtn(){
        this.setState({ submitBtn: false })
        const { megnevezes, mennyiseg_egysege, mennyiseg, alapanyag_netto_bekereules_ar, nyomtatas_netto_bekerules_ar, egyeb_koltseg, bekerules_netto_ar, megjegyzes, eladasi_netto_vip_ar, eladasi_netto_nagyker_ar, eladasi_netto_kisker_ar } = this.state;
        if(megnevezes.trim().length === 0 || mennyiseg_egysege.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', submitBtn: true });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', submitBtn: false })
        }

        API.post('arjegyzek/create', 'megnevezes='+encodeURIComponent(megnevezes)+'&mennyiseg_egysege='+mennyiseg_egysege+'&mennyiseg='+mennyiseg+'&alapanyag_netto_bekereules_ar='+alapanyag_netto_bekereules_ar+'&nyomtatas_netto_bekerules_ar='+nyomtatas_netto_bekerules_ar+'&egyeb_koltseg='+egyeb_koltseg+'&bekerules_netto_ar='+bekerules_netto_ar+'&megjegyzes='+encodeURIComponent(megjegyzes)+'&eladasi_netto_vip_ar='+eladasi_netto_vip_ar+'&eladasi_netto_nagyker_ar='+eladasi_netto_nagyker_ar+'&eladasi_netto_kisker_ar='+eladasi_netto_kisker_ar+'&API_SECRET='+API_SECRET)
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
                        mennyiseg_egysege: '',
                        mennyiseg: 1,
                        alapanyag_netto_bekereules_ar: 0,
                        nyomtatas_netto_bekerules_ar: 0,
                        egyeb_koltseg: 0,
                        bekerules_netto_ar: 0,
                        megjegyzes: '',
                        eladasi_netto_vip_ar: 0,
                        eladasi_netto_nagyker_ar: 0,
                        eladasi_netto_kisker_ar: 0,
                        submitBtn: true,
                        messageHidden: true,
                        messageText: ''
                    })
                }
            })
            .catch(error => {
                this.setState({ messageHidden: false, messageText: 'Hiba a szerver oldalon!', submitBtn: true, buttonLoader: false });
            });
    
    }

    render(){
        return (
            <Modal open={this.state.modalOpen} onClose={this.closeModal} size="tiny" dimmer="blurring">
            <Modal.Header>Új ár hozzáadása</Modal.Header>
                <Modal.Content>
                    <Form size='tiny'>
                        <Form.Field required>
                            <label>Megnevezés</label>
                            <input placeholder='Megnevezés' name='megnevezes' value={this.state.megnevezes} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Mennyiség egysége</label>
                            <input placeholder='Mennyiség egysége' name='mennyiseg_egysege' value={this.state.mennyiseg_egysege} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Mennyiség</label>
                            <input type='number' placeholder='Mennyiség' name='mennyiseg' value={this.state.mennyiseg} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Alapanyag nettó bekerülési ára</label>
                            <input type='number' placeholder='Alapanyag nettó bekerülési ára' name='alapanyag_netto_bekereules_ar' value={this.state.alapanyag_netto_bekereules_ar} onChange={this.handleChangeBekerulesiAr}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Nyomtatás nettó bekerülési ára</label>
                            <input type='number' placeholder='Nyomtatás nettó bekerülési ára' name='nyomtatas_netto_bekerules_ar' value={this.state.nyomtatas_netto_bekerules_ar} onChange={this.handleChangeBekerulesiAr}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Egyéb költség</label>
                            <input type='number' placeholder='Egyéb költség' name='egyeb_koltseg' value={this.state.egyeb_koltseg} onChange={this.handleChangeBekerulesiAr}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Bekerülési nettó ár</label>
                            <input type='number' placeholder='Bekerülési nettó ár' name='bekerules_netto_ar' value={this.state.bekerules_netto_ar} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Megjegyzés</label>
                            <input placeholder='Megjegyzés' name='megjegyzes' value={this.state.megjegyzes} onChange={this.handleChange}/>
                        </Form.Field>

                        <Form.Field>
                            <label>Eladási nettó VIP ár</label>
                            <input type='number' placeholder='Eladási nettó VIP ár' name='eladasi_netto_vip_ar' value={this.state.eladasi_netto_vip_ar} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Eladási NAGYKER nettó ár</label>
                            <input type='number' placeholder='Eladási NAGYKER nettó ár' name='eladasi_netto_nagyker_ar' value={this.state.eladasi_netto_nagyker_ar} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Eladási KISKER nettó ár</label>
                            <input type='number' placeholder='Eladási KISKER nettó ár' name='eladasi_netto_kisker_ar' value={this.state.eladasi_netto_kisker_ar} onChange={this.handleChange}/>
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
                        content="Ár létrehozása"
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

 
export default NewArModal;