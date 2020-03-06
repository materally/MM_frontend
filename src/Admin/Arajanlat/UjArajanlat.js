import React, { Component } from 'react';
import { Container, Header, Form, Button, Confirm, Divider, Table, Select, Icon } from 'semantic-ui-react'
import TextareaAutosize from "react-textarea-autosize";
import Swal from 'sweetalert2';
import { numberWithSpace, calcBrutto } from '../../Helpers/Helpers'
import API, { API_SECRET } from '../../api';

import PageHeaderAdmin from '../components/Header'

class UjArajanlatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin_user_id: localStorage.getItem('user_id'),
            dataSablonok: [],
            adminInfo: [],

            felado_nev: '',
            felado_email: '',
            felado_telefon: '',

            clients: [],
            cimzett_nev: '',
            cimzett_email: '',
            cimzett_telefonszam: '',
            cimzett_company_id: 0,
            cimzett_user_id: 0,

            megnevezes: 'Árajánlat: ',
            tartalom: '',
            loadingTartalom: '',

            arjegyzek: [],
            arjegyzekFull: [],
            arjegyzekRows: [],
            calculatedSum: 0,

            loadSablonConfirmWindow: false,
            submitBtn: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChange_Megnevezes = this.handleChange_Megnevezes.bind(this)
        this.handleChange_Client = this.handleChange_Client.bind(this)
        this.loadData();
        this.getArjegyzek();
        this.getClients();
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    loadData(){
        API.get(`arajanlat/sablon`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ dataSablonok: response });
            }
        })
        .catch(error => console.log("Error: "+error));

        API.get(`admin/adminInfo/${this.state.admin_user_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res2 => {
            var response2 = res2.data;
            if(response2){
                const nev = response2.vezeteknev + ' ' + response2.keresztnev;
                this.setState({ adminInfo: response2, felado_nev: nev, felado_email: response2.email, felado_telefon: response2.telefonszam });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    getArjegyzek(){
        API.get(`arjegyzek`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                let array = []
                response.map(a => {
                    let temp = {
                        key: a.ar_id,
                        value: a.ar_id,
                        text: a.megnevezes,
                        vip_ar: a.eladasi_netto_vip_ar,
                        nagyker_ar: a.eladasi_netto_nagyker_ar,
                        kisker_ar: a.eladasi_netto_kisker_ar,
                        mennyiseg_egysege: a.mennyiseg_egysege
                    }
                    return array.push(temp)
                })
                this.setState({ arjegyzek: array, arjegyzekFull: response })
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    getClients(){
        API.get(`ugyfel`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                let array = []
                response.map(a => {
                    let temp = {
                        key: a.user_id,
                        value: a.user_id,
                        text: a.vezeteknev + ' ' + a.keresztnev,
                        email: a.email,
                        telefonszam: a.telefonszam,
                        company_id: a.company_id
                    }
                    return array.push(temp)
                })
                this.setState({ clients: array })
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    handleAddAr = () => {
        this.setState({
            arjegyzekRows: this.state.arjegyzekRows.concat([{ ar_id: 0, megnevezes: '', mennyiseg: 1, mennyiseg_egysege: '', netto_egysegar: 0, vip_ar: 0, nagyker_ar: 0, kisker_ar: 0, megjegyzes: '' }])
        }, () => this.calcSum());
    };

    handleAddArEgyedi = () => {
        this.setState({
            arjegyzekRows: this.state.arjegyzekRows.concat([{ ar_id: -1, megnevezes: '', mennyiseg: 1, mennyiseg_egysege: '', netto_egysegar: 0, vip_ar: 0, nagyker_ar: 0, kisker_ar: 0, megjegyzes: '' }])
        }, () => this.calcSum());
    };

    handleDeleteAr = idx => () => {
        this.setState({
            arjegyzekRows: this.state.arjegyzekRows.filter((s, sidx) => idx !== sidx)
        }, () => this.calcSum() );
    };

    calcSum(){
        if(this.state.arjegyzekRows.length > 0){
            let total = 0;
            this.state.arjegyzekRows.map(a => (
                total += a.netto_egysegar*a.mennyiseg
            ))
            this.setState({ calculatedSum: total })
        }
    }

    handleChange_Megnevezes(e, data)  {
        const { text, vip_ar, nagyker_ar, kisker_ar, mennyiseg_egysege } = data.options.find(o => o.value === data.value);
        const idx = data.idx;
        const n = this.state.arjegyzekRows.map((a, sidx) => {
            if (idx !== sidx) return a;
            return {...a, ar_id: data.value, megnevezes: text,  mennyiseg_egysege: mennyiseg_egysege, netto_egysegar: kisker_ar, vip_ar: vip_ar, nagyker_ar: nagyker_ar, kisker_ar: kisker_ar }
        });
        this.setState({ arjegyzekRows: n }, () => this.calcSum());
    }

    handleChange_MegnevezesEgyedi = idx => evt =>  {
        const n = this.state.arjegyzekRows.map((a, sidx) => {
            if (idx !== sidx) return a;
            return { ...a, megnevezes: evt.target.value };
        });
        this.setState({ arjegyzekRows: n }, () => this.calcSum());
    }

    handleChange_Mennyiseg = idx => evt => {
        const n = this.state.arjegyzekRows.map((a, sidx) => {
            if (idx !== sidx) return a;
            return { ...a, mennyiseg: evt.target.value };
        });

        this.setState({ arjegyzekRows: n }, () => this.calcSum());
    };

    handleChange_MennyisegEgysege = idx => evt => {
        const n = this.state.arjegyzekRows.map((a, sidx) => {
            if (idx !== sidx) return a;
            return { ...a, mennyiseg_egysege: evt.target.value };
        });

        this.setState({ arjegyzekRows: n }, () => this.calcSum());
    };

    handleChange_NettoEgysegar = idx => evt => {
        const n = this.state.arjegyzekRows.map((a, sidx) => {
            if (idx !== sidx) return a;
            return { ...a, netto_egysegar: evt.target.value };
        });

        this.setState({ arjegyzekRows: n }, () => this.calcSum());
    };

    setNettoEgysegarViaClick(which, idx){
        const n = this.state.arjegyzekRows.map((a, sidx) => {
            if (idx !== sidx) return a;
            return { ...a, netto_egysegar: a[which] };
        })
        this.setState({ arjegyzekRows: n }, () => this.calcSum());
    }

    handleChange_Megjegyzes = idx => evt => {
        const n = this.state.arjegyzekRows.map((a, sidx) => {
            if (idx !== sidx) return a;
            return { ...a, megjegyzes: evt.target.value };
        });
        this.setState({ arjegyzekRows: n })
    };

    handleChange_Client(e, data)  {
        const { text, email, telefonszam, company_id } = data.options.find(o => o.value === data.value);
        this.setState({ cimzett_nev: text, cimzett_email: email, cimzett_telefonszam: telefonszam, cimzett_user_id: data.value, cimzett_company_id: company_id });
    }

    submitBtn(){
        this.setState({ submitBtn: false })
        const { felado_nev, felado_email, felado_telefon, cimzett_email, cimzett_telefonszam, cimzett_nev, megnevezes, tartalom, cimzett_company_id, cimzett_user_id } = this.state;

        if( felado_nev.trim().length === 0 || 
            felado_email.trim().length === 0 || 
            felado_telefon.trim().length === 0 || 
            cimzett_email.trim().length === 0 || 
            cimzett_telefonszam.trim().length === 0 || 
            cimzett_nev.trim().length === 0 || 
            megnevezes.trim().length === 0 || 
            tartalom.trim().length === 0
        ){
            this.setState({ submitBtn: true }, () => {
                Swal.fire({
                    title: 'Hiba',
                    text: 'A csillaggal jelölt mezők kitöltése kötelező!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2000
                })
            });
            return;
        }else{
            this.setState({ submitBtn: false })
        }

        const arjegyzek = encodeURIComponent(JSON.stringify(this.state.arjegyzekRows))
        const body = 'admin_user_id='+this.state.admin_user_id+'&company_id='+cimzett_company_id+'&user_id='+cimzett_user_id+'&felado_nev='+felado_nev+'&felado_telefon='+felado_telefon+'&felado_email='+felado_email+'&cimzett_email='+cimzett_email+'&cimzett_telefonszam='+cimzett_telefonszam+'&cimzett_nev='+cimzett_nev+'&megnevezes='+encodeURIComponent(megnevezes)+'&tartalom='+encodeURIComponent(tartalom)+'&arjegyzek='+arjegyzek+'&API_SECRET='+API_SECRET        
        
        API.post('arajanlat/ujArajanlat/', body)
        .then(res => {
            var response = res.data;
            if(response.error){
                this.setState({ submitBtn: true }, () => {
                    Swal.fire({
                        title: 'Hiba',
                        text: response.error,
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 2000
                    })
                });
                return;
            }

            Swal.fire({
                title: 'Sikeres',
                text: 'Sikeres árajánlat készítés!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            })
            .then(() => {
                this.props.history.push("/admin/uj_arajanlatok")
            })
            
        })
        .catch(error => {
            this.setState({ submitBtn: true }, () => console.log(error));
        });
        
    }

    render(){
        return (
            <Container>
                <PageHeaderAdmin />
                <p style={{ marginTop: '5em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Új árajánlat</Header>
                </div>
                <Form>
                    <Divider horizontal><Header as='h4'>Feladó</Header></Divider>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>Név</label>
                            <input placeholder='Név' name='felado_nev' value={this.state.felado_nev} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field required>
                            <label>E-mail cím</label>
                            <input placeholder='E-mail cím' name='felado_email' value={this.state.felado_email} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field required>
                            <label>Telefonszám</label>
                            <input placeholder='Telefonszám' name='felado_telefon' value={this.state.felado_telefon} onChange={this.handleChange} />
                        </Form.Field>
                    </Form.Group>

                    <Divider horizontal style={{ marginTop: '30px' }}><Header as='h4'>Címzett</Header></Divider>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>Név</label>
                            <Select placeholder='VÁLASSZ' search options={this.state.clients} onChange={ this.handleChange_Client }/>
                        </Form.Field>
                        <Form.Field required>
                            <label>E-mail cím</label>
                            <input placeholder='E-mail cím' name='cimzett_email' value={this.state.cimzett_email} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field required>
                            <label>Telefonszám</label>
                            <input placeholder='Telefonszám' name='cimzett_telefonszam' value={this.state.cimzett_telefonszam} onChange={this.handleChange} />
                        </Form.Field>
                    </Form.Group>

                    <Divider horizontal style={{ marginTop: '30px' }}><Header as='h4'>Árajánlat</Header></Divider>
                    
                    <Form.Field required>
                        <label>Megnevezés</label>
                        <input placeholder='Megnevezés' name='megnevezes' value={this.state.megnevezes} onChange={this.handleChange} />
                    </Form.Field>

                    <Form.Field 
                        required
                        control={TextareaAutosize}
                        label="Árajánlat tartalma"
                        placeholder="Árajánlat tartalma"
                        onChange={this.handleChange}
                        useCacheForDOMMeasurements
                        value={this.state.tartalom}
                        name='tartalom'
                    />
                    <b>Sablon betöltése: </b>
                    <Button.Group basic compact size='mini' style={{ marginLeft:'10px' }}>
                        {
                            this.state.dataSablonok && (
                                this.state.dataSablonok.map((sablon) => (
                                    <Button type='button' key={sablon.sablon_id} onClick={ () => this.setState({ loadSablonConfirmWindow: true, loadingTartalom: sablon.sablon }) }>{sablon.megnevezes}</Button>
                                ))
                            )
                        }
                    </Button.Group>

                    <Divider horizontal style={{ marginTop: '30px' }}><Header as='h4'>Árjegyzék</Header></Divider>
                    {
                        (this.state.arjegyzekRows.length > 0) ? (
                            <React.Fragment>
                                <Table striped celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell textAlign='center' width='1'>#</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='4'>Megnevezés</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='1'>Mennyiség</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='1'>Me.egys.</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='2'>Nettó VIP ár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='2'>Nettó nagyker ár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='2'>Nettó kisker ár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='2'>Nettó egys.ár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center'>&nbsp;</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                    {
                                        this.state.arjegyzekRows.map((ar, idx) => (
                                            <React.Fragment key={idx} >
                                                <Table.Row onClick={ () => null }>
                                                    <Table.Cell textAlign='center'>{`${idx + 1}`}.</Table.Cell>
                                                    <Table.Cell>
                                                        <Form.Field>
                                                        {
                                                            (ar.ar_id === -1) ? <input type='text' placeholder='Egyedi megnevezés' value={ar.megnevezes} onChange={this.handleChange_MegnevezesEgyedi(idx)}/> : <Select placeholder='VÁLASSZ' search idx={idx} options={this.state.arjegyzek} onChange={ this.handleChange_Megnevezes }/>
                                                        }
                                                        
                                                        </Form.Field>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Form.Field required>
                                                            <input type='number' min='1' placeholder='Mennyiség' value={ar.mennyiseg} onChange={this.handleChange_Mennyiseg(idx)}/>
                                                        </Form.Field>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Form.Field required>
                                                            <input type='text' placeholder='Me.egys.' value={ar.mennyiseg_egysege} onChange={this.handleChange_MennyisegEgysege(idx)}/>
                                                        </Form.Field>
                                                    </Table.Cell>
                                                    <Table.Cell onClick={ () => this.setNettoEgysegarViaClick('vip_ar', idx) } style={{ cursor:'pointer' }}>
                                                        <Form.Field>
                                                            <input type='number' placeholder='VIP' value={ar.vip_ar} readOnly disabled/>
                                                        </Form.Field>
                                                    </Table.Cell>
                                                    <Table.Cell onClick={ () => this.setNettoEgysegarViaClick('nagyker_ar', idx) } style={{ cursor:'pointer' }}>
                                                        <Form.Field>
                                                            <input type='number' placeholder='Nagyker' value={ar.nagyker_ar} readOnly disabled/>
                                                        </Form.Field>
                                                    </Table.Cell>
                                                    <Table.Cell onClick={ () => this.setNettoEgysegarViaClick('kisker_ar', idx) } style={{ cursor:'pointer' }}>
                                                        <Form.Field>
                                                            <input type='number' placeholder='Kisker' value={ar.kisker_ar} readOnly disabled/>
                                                        </Form.Field>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Form.Field required>
                                                            <input type='number' placeholder='Nettó egységár' value={ar.netto_egysegar} onChange={this.handleChange_NettoEgysegar(idx)}/>
                                                        </Form.Field>
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='center'>
                                                        <Button icon negative compact size='mini' type='button' onClick={ this.handleDeleteAr(idx) }>
                                                            <Icon name='trash' />
                                                        </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                        <Table.Cell colSpan='10'>
                                                            <Form.Field>
                                                                <input type='text' placeholder={`${idx + 1}. tétel megjegyzése`} value={ar.megjegyzes} onChange={this.handleChange_Megjegyzes(idx)}/>
                                                            </Form.Field>
                                                        </Table.Cell>
                                                </Table.Row>
                                            </React.Fragment>
                                        ))
                                    }
                                </Table.Body>
                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='7' textAlign='right' style={{ fontWeight:'bold' }}>Összesen: </Table.HeaderCell>
                                        <Table.Cell positive textAlign='right'><b>{numberWithSpace(this.state.calculatedSum)} Ft</b></Table.Cell>
                                        <Table.HeaderCell>Bruttó: <b>{numberWithSpace(calcBrutto(this.state.calculatedSum))} Ft</b></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>
                            </React.Fragment>
                        ) : null
                    }

                    <div>
                        <Button icon positive type='button' onClick={ () => this.handleAddAr() }>
                            <Icon name='plus' />
                        </Button>
                        <Button icon positive type='button' onClick={ () => this.handleAddArEgyedi() }>
                            <Icon name='tag' />
                        </Button>
                    </div>
                    
                    
                    <Container style={{ textAlign:'center', paddingBottom: '30px', paddingTop: '20px' }}>
                        <Button
                            positive
                            size='large'
                            content="Küldés"
                            type='button' 
                            onClick={ () => this.submitBtn() }
                            disabled={!this.state.submitBtn}
                            loading={!this.state.submitBtn}
                        />
                    </Container>
                    
                </Form>

                <Confirm
                    content='Figyelem! Az árajánlat eddigi tartalma el fog veszni! Biztos benne?'
                    size='tiny'
                    cancelButton='Mégsem'
                    confirmButton='Mehet'
                    open={this.state.loadSablonConfirmWindow}
                    onCancel={ () => this.setState({ loadSablonConfirmWindow: false }) }
                    onConfirm={ () => this.setState({ tartalom: this.state.loadingTartalom, loadSablonConfirmWindow: false }) }
                />
            </Container>
        )
    }
}
export default UjArajanlatPage;