import React, { Component } from 'react';
import { Container, Table, Tab, Button, TextArea, Form, Comment, Icon, Divider, Header, Select, Menu, Label, Grid } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import nl2br from 'react-nl2br';
import Swal from 'sweetalert2';
import TextareaAutosize from "react-textarea-autosize";
import { numberWithSpace, calcBrutto } from '../../Helpers/Helpers'
import './Arajanlat.css';
import ArajanlatToAlvallalkozoModal from './ArajanlatToAlvallalkozoModal';
import VallalkozoValaszModal from './VallalkozoValaszModal';

import PageHeaderAdmin from '../components/Header'
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

class ArajanlatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin_user_id: localStorage.getItem('user_id'),
            arajanlat_id: this.props.match.params.arajanlat_id,
            data: [],
            user_data: [],
            company_data: [],
            comments: [],
            adminInfo: [],
            alvallalkozok: [],
            megjegyzes: '',

            emailTargy: '',
            emailCim: '',
            emailTartalom: '',
            selectedAlvallalkozo_id: -1,

            arajanlatok_to_alvallalkozo: [],
            arajanlatDetailsModalData: [],
            arajanlatDetailsModal: false,
            vallalkozoValaszModalData: '',
            vallalkozoValaszModal: false,
            bekertAlvallalkozoiArajanlatokCount: 0,

            kiajanlasEmail: '',
            kiajanlasTargy: '',
            kiajanlasTartalom: '',
            calculatedSum: 0,

            arjegyzek: [],
            arjegyzekFull: [],
            arjegyzekRows: [],

            arajanlat_to_ugyfel: [],

            submitBtn: true,
            sendEmailBtn: true,
            saveAndSendBtn: true
        }
        this.getData();
        this.getAlvallalkozok();
        this.getArajanlatokToAlvallalkozo();
        this.getArjegyzek();
        this.getArajanlatToUgyfel();
        this.handleChange = this.handleChange.bind(this)
        this.changeAlvallalkozo = this.changeAlvallalkozo.bind(this)
        this.handleChange_Megnevezes = this.handleChange_Megnevezes.bind(this)
        this.handleChange_Megjegyzes = this.handleChange_Megjegyzes.bind(this)
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
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

    getData(){
        API.get(`arajanlat/adminGet/${this.state.arajanlat_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ data: response, user_data: response.user_data, company_data: response.company_data, comments:response.comments }, () => {
                    this.setState({ kiajanlasEmail: this.state.user_data.email, kiajanlasTargy: 'Árajánlat: '+this.state.data.megnevezes })
                });
            }else{
                this.props.history.push("/admin/arajanlatok");
            }
        })
        .catch(error => console.log("Error: "+error));

        API.get(`admin/adminInfo/${this.state.admin_user_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res2 => {
            var response2 = res2.data;
            if(response2){
                this.setState({ adminInfo: response2 });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    getArajanlatokToAlvallalkozo(){
        API.get(`arajanlat/arajanlatokToAlvallalkozo/${this.state.arajanlat_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res3 => {
            var response3 = res3.data;
            if(response3){
                this.setState({ arajanlatok_to_alvallalkozo: response3, bekertAlvallalkozoiArajanlatokCount: response3.length });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    getArajanlatToUgyfel(){
        API.get(`arajanlat/getArajanlatToUgyfel/${this.state.arajanlat_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res3 => {
            var response3 = res3.data;
            if(response3){
                this.setState({ arajanlat_to_ugyfel: response3 });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    getAlvallalkozok(){
        API.get(`alvallalkozo`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                let array = []
                response.map(a => {
                    let temp = {
                        key: a.alvallalkozo_id,
                        value: a.alvallalkozo_id,
                        text: a.cegnev
                    }
                    return array.push(temp)
                })
                this.setState({ alvallalkozok: array })
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    addArajanlatToEmail(){
        let newEmailTartalom = this.state.emailTartalom + '\n\n' + this.state.data.tartalom;
        this.setState({ emailTartalom: newEmailTartalom })
    }

    pageArajanlat(){
        return (
            <React.Fragment>
            <Table definition>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Árajánlat kérő</Table.Cell>
                        <Table.Cell><b>{this.state.company_data.cegnev}</b> - {this.state.user_data.vezeteknev} {this.state.user_data.keresztnev} ({this.state.user_data.telefonszam} - <a href={"mailto:"+this.state.user_data.email}>{this.state.user_data.email}</a>)</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width={3}>Megnevezés</Table.Cell>
                        <Table.Cell>{this.state.data.megnevezes}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Dátum</Table.Cell>
                        <Table.Cell>{this.state.data.datum}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Gyártási határidő</Table.Cell>
                        <Table.Cell>{this.state.data.gyartasi_hatarido}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell verticalAlign='top'>Tartalom</Table.Cell>
                        <Table.Cell>{nl2br(this.state.data.tartalom)}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <hr/>
            {this.pageKiajanlas()}
            </React.Fragment>
        )
    }

    submitBtn(){
        this.setState({ submitBtn: false })
        const { admin_user_id, arajanlat_id, megjegyzes } = this.state;
        const name = this.state.adminInfo.vezeteknev + ' ' + this.state.adminInfo.keresztnev
        const email = this.state.adminInfo.email
        
        if(megjegyzes.trim().length === 0){
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

        API.post('arajanlat/createMegjegyzes/'+arajanlat_id, 'user_id='+admin_user_id+'&name='+name+'&email='+email+'&comment='+this.state.megjegyzes+'&API_SECRET='+API_SECRET)
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
            if(response.success){
                this.setState({ 
                    megjegyzes: '',
                    submitBtn: true
                }, () => this.getData())
            }
        })
        .catch(error => {
            this.setState({ submitBtn: true }, () => console.log(error));
        });
    }

    deleteMegjegyzes(megjegyzes_id){
        Swal.fire({
            title: 'Biztos vagy benne?',
            text: "A művelet nem vonható vissza!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Igen, törlöm',
            cancelButtonText: 'Mégse'
        }).then((result) => {
            if (result.value) {
                API.post('arajanlat/deleteMegjegyzes/'+megjegyzes_id, 'API_SECRET='+API_SECRET)
                .then(res => {
                    this.getData()
                })
                .catch(error => console.log("Error: "+error));
                
            }
        })
    }

    pageMegjegyzesek(){
        return (
            <React.Fragment>
                <Form>
                    <TextArea placeholder='Megjegyzés hozzáadása' name='megjegyzes' value={this.state.megjegyzes} onChange={this.handleChange}/>
                    <Button
                        style={{ marginTop: '10px' }}
                        positive
                        compact
                        labelPosition='left' 
                        icon='edit'
                        content="Elküldés"
                        type='submit' 
                        onClick={ () => this.submitBtn() }
                        disabled={!this.state.submitBtn}
                        loading={!this.state.submitBtn}
                    />
                </Form>
                {
                    (this.state.comments.length > 0) ? (
                        <Comment.Group minimal style={{ margin: '0 auto' }}>
                        {
                            this.state.comments.map((comment, i) => (
                                <Comment key={comment.megjegyzes_id} style={ (i !== 0) ? { borderTopWidth: '1px', borderTopColor: '#e5e5e5', borderTopStyle: 'solid' } : null}>
                                    <Comment.Content>
                                        <Comment.Author as='a' to="#!">{comment.name}</Comment.Author>
                                        <Comment.Metadata><span>{comment.date}</span></Comment.Metadata>
                                        <Comment.Text>{nl2br(comment.comment)}</Comment.Text>
                                        <Comment.Actions>
                                            { (parseInt(this.state.admin_user_id) === comment.user_id) ? <Icon onClick={ () => this.deleteMegjegyzes(comment.megjegyzes_id) } name='trash' className="cursorHover"/> : null }
                                        </Comment.Actions>
                                    </Comment.Content>
                                </Comment>
                            ))
                        }
                        </Comment.Group>
                    ) : <h4>Még nincs megjegyzés!</h4>
                }
            </React.Fragment>
        )
    }

    pageArajanlatBekeres(){
        return (
            <React.Fragment>
                <Divider horizontal>
                    <Header as='h4'>
                        Árajánlat bekérés
                    </Header>
                </Divider>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>Először válaszd ki az alvállalkozót</label>
                            <Select placeholder='Válaszd ki az alvállalkozót' options={this.state.alvallalkozok} onChange={ this.changeAlvallalkozo }/>
                        </Form.Field>
                        <Form.Field required>
                            <label>E-mail cím</label>
                            <input placeholder='E-mail cím' name='emailCim' value={this.state.emailCim} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Tárgy</label>
                            <input placeholder='Tárgy' name='emailTargy' value={this.state.emailTargy} onChange={this.handleChange}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Field 
                        required
                        control={TextareaAutosize}
                        label="Árajánlat tartalma"
                        placeholder="Árajánlat tartalma"
                        onChange={this.handleChange}
                        useCacheForDOMMeasurements
                        value={this.state.emailTartalom}
                        name='emailTartalom'
                    />
                    <Button.Group basic compact size='mini'>
                        <Button type='button' onClick={ () => this.addArajanlatToEmail() }>Árajánlat tartalmának betöltése</Button>
                    </Button.Group>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Button 
                            type='button'
                            animated
                            positive
                            onClick={ () => this.sendEmail() }
                            disabled={!this.state.sendEmailBtn}
                            loading={!this.state.sendEmailBtn}
                        >
                            <Button.Content visible>E-mail küldése</Button.Content>
                            <Button.Content hidden>
                                <Icon name='send' />
                            </Button.Content>
                        </Button>
                    </div>
                </Form>
            </React.Fragment>
        )
    }

    openAlVaMa(token){
        let url = process.env.REACT_APP_BASE_URL + 'reply/' + token
        window.open(url, "_blank")
        return
    }

    pageAlvallalkozoiArajanlatok(){
        return (this.state.arajanlatok_to_alvallalkozo.length > 0) ? (
             
                <Table striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Alvállalkozó</Table.HeaderCell>
                            <Table.HeaderCell>E-mail</Table.HeaderCell>
                            <Table.HeaderCell>Dátum</Table.HeaderCell>
                            <Table.HeaderCell>Válasz</Table.HeaderCell>
                            <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            this.state.arajanlatok_to_alvallalkozo.map(a => (
                                <Table.Row key={a.ar_to_al_id}  positive={ (a.valasz) ? true : false }>
                                    <Table.Cell>{a.alvallalkozo.cegnev}</Table.Cell>
                                    <Table.Cell>{a.email}</Table.Cell>
                                    <Table.Cell>{a.datum}</Table.Cell>
                                    <Table.Cell>{a.valasz_datum}</Table.Cell>
                                    <Table.Cell>
                                        <Icon title='Árajánlatkérés megtekintése' link name='eye' color='blue' onClick={ () => this.setState({ arajanlatDetailsModalData: a, arajanlatDetailsModal: true }) }/>
                                        { (a.valasz) ? ( <Icon style={{ marginLeft: '5px' }} title='Alvállalkozó válaszának megtekintése' link name='external' color='blue' onClick={ () => this.setState({ vallalkozoValaszModalData: a.valasz, vallalkozoValaszModal: true }) }/> ) : <Icon style={{ marginLeft: '5px' }} title='Alvállalkozó válaszának megadása' link name='external square alternate' color='blue' onClick={ () => this.openAlVaMa(a.token) }/> }
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            
        ) : ''
    }

    sendEmail(){
        this.setState({ sendEmailBtn: false })
        const { emailCim, emailTargy, emailTartalom, selectedAlvallalkozo_id, arajanlat_id, admin_user_id } = this.state;
        
        if(emailCim.trim().length === 0 || emailTargy.trim().length === 0 || emailTartalom.trim().length === 0){
            this.setState({ sendEmailBtn: true }, () => {
                Swal.fire({
                    title: 'Hiba',
                    text: 'A csillaggal jelölt mezők kitöltése kötelező!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2000
                })
            });
            return;
        }

        API.post('arajanlat/sendEmailToAlvallalkozo', 'alvallalkozo_id='+selectedAlvallalkozo_id+'&email='+emailCim+'&targy='+emailTargy+'&tartalom='+emailTartalom+'&arajanlat_id='+arajanlat_id+'&user_id='+admin_user_id+'&API_SECRET='+API_SECRET)
            .then(res => {
                var response = res.data;
                if(response.error){
                    this.setState({ sendEmailBtn: true }, () => {
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
                if(response.success){
                    this.setState({ sendEmailBtn: true, selectedAlvallalkozo_id: -1, emailCim: '', emailTargy: '', emailTartalom: ''})
                    Swal.fire({
                        title: 'Sikeres',
                        text: 'Az árajánlat kiküldve az alvállalkozónak!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    this.getArajanlatokToAlvallalkozo()
                }
            })
            .catch(error => {
                this.setState({ sendEmailBtn: true }, () => {
                    Swal.fire({
                        title: 'Hiba',
                        text: 'Hiba a szerver oldalon!',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 2000
                    })
                });
            });
    }

    changeAlvallalkozo(e, data){
        API.get(`alvallalkozo/${data.value}`, {params: {'API_SECRET': API_SECRET} })
        .then(res4 => {
            var response4 = res4.data;
            if(response4){

                let tartalom = 'Szia ' + response4.keresztnev + ', \n\nSzeretnék árajánlatot kérni tőled az alábbi munkára:\n\n'+this.state.data.tartalom+'\n\nA határidő, amire el kellene készülnie legkésőbb <b>'+this.state.data.gyartasi_hatarido+'</b>.\n\nLégy szíves mielőbb reagálni és lehetőség szerint ma holnap küldj nekünk ajánlatot. Ha bármi kérdésed van, nyugodtan írj vagy hívj.\n\nAz alábbi linken tudsz nekünk válaszolni: <a href="{url}" target="_blank">{url}</a>\n\nKöszönettel és üdvözlettel\n<b>'+this.state.adminInfo.vezeteknev+' '+this.state.adminInfo.keresztnev+'</b>\nMM Nyomdaipari Kft.\n<a href="tel:'+this.state.adminInfo.telefonszam+'">'+this.state.adminInfo.telefonszam+'</a>\n<a href="https://magentamedia.hu/" target="_blank">www.magentamedia.hu</a>'

                this.setState({ emailCim: response4.email, selectedAlvallalkozo_id: response4.alvallalkozo_id, emailTargy: 'Árajánlatkérés: '+this.state.data.megnevezes, emailTartalom: tartalom });
            }
        })
        .catch(error => console.log("Error: "+error));
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

    handleDeleteAr = idx => () => {
        this.setState({
            arjegyzekRows: this.state.arjegyzekRows.filter((s, sidx) => idx !== sidx)
        }, () => this.calcSum() );
    };

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

    calcSum(){
        if(this.state.arjegyzekRows.length > 0){
            let total = 0;
            this.state.arjegyzekRows.map(a => (
                total += a.netto_egysegar*a.mennyiseg
            ))
            this.setState({ calculatedSum: total })
        }
    }

    saveAndSendArajanlat(){
        this.setState({ saveAndSendBtn: false })
        const { kiajanlasEmail, kiajanlasTargy, kiajanlasTartalom, arajanlat_id } = this.state;
        const user_id = this.state.user_data.user_id
        const company_id = this.state.company_data.company_id
        
        if(kiajanlasEmail.trim().length === 0 || kiajanlasTargy.trim().length === 0 || kiajanlasTartalom.trim().length === 0){
            this.setState({ saveAndSendBtn: true }, () => {
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
            this.setState({ saveAndSendBtn: false })
        }

        const arjegyzek = encodeURIComponent(JSON.stringify(this.state.arjegyzekRows))

        const body = 'admin_user_id='+this.state.admin_user_id+'&company_id='+company_id+'&user_id='+user_id+'&arajanlat_id='+arajanlat_id+'&email='+kiajanlasEmail+'&targy='+kiajanlasTargy+'&tartalom='+kiajanlasTartalom+'&arjegyzek='+arjegyzek+'&API_SECRET='+API_SECRET

        API.post('arajanlat/arajanlatToUgyfel/', body)
        .then(res => {
            console.log(res)
            var response = res.data;
            if(response.error){
                this.setState({ saveAndSendBtn: true }, () => {
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
                text: 'Sikeres kiajánlás!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            })
            this.getArajanlatToUgyfel()
            
        })
        .catch(error => {
            this.setState({ saveAndSendBtn: true }, () => console.log(error));
        });
    }

    italic(string){
        return <React.Fragment><br /><span style={{ fontStyle: 'italic', fontSize: '11px' }}>{string}</span></React.Fragment>;
    }

    pageKiajanlasIsset(){
        const arajanlat = this.state.arajanlat_to_ugyfel
        const arjegyzek = this.state.arajanlat_to_ugyfel.arjegyzek
        const sum_netto = arjegyzek.reduce((total, a) => total + a.netto_egysegar*a.mennyiseg, 0);

        return (
            <React.Fragment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width='4'><Header sub style={{ color: '#E80D8A' }}>E-mail</Header><span>{arajanlat.email}</span></Grid.Column>
                        <Grid.Column width='4'><Header sub style={{ color: '#E80D8A' }}>Tárgy</Header><span>{arajanlat.targy}</span></Grid.Column>
                        <Grid.Column width='4'><Header sub style={{ color: '#E80D8A' }}>Dátum</Header><span>{arajanlat.datum}</span></Grid.Column>
                        <Grid.Column width='4'><Header sub style={{ color: '#E80D8A' }}>PDF</Header><span><a href={arajanlat.pdf} target="_blank" rel="noopener noreferrer">megtekintés</a></span></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width='12'><Header sub style={{ color: '#E80D8A' }}>Tartalom</Header><span>{nl2br(arajanlat.tartalom)}</span></Grid.Column>
                    </Grid.Row>
                    {
                        arjegyzek.length !== 0 ? (
                            <div style={{ width: '100%' }}>
                                <Header sub style={{ color: '#E80D8A' }}>Árjegyzék</Header>
                                <Table striped celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell textAlign='center'>#</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center'>Megnevezés</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center'>Mennyiség</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center'>Me. egys.</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center'>Nettó egységár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center'>Nettó ár összesen</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                {
                                    arjegyzek && arjegyzek.map((a, id) => (
                                        <Table.Row key={a.ato_arjegyzek_id} onClick={ () => null }>
                                            <Table.Cell textAlign='center'>{id+1}.</Table.Cell>
                                            <Table.Cell>{a.megnevezes} { (a.megjegyzes.length > 0) ? this.italic(a.megjegyzes) : '' }</Table.Cell>
                                            <Table.Cell textAlign='center'>{a.mennyiseg}</Table.Cell>
                                            <Table.Cell textAlign='center'>{a.mennyiseg_egysege}</Table.Cell>
                                            <Table.Cell textAlign='right'>{numberWithSpace(a.netto_egysegar)} Ft</Table.Cell>
                                            <Table.Cell textAlign='right'>{numberWithSpace(a.netto_egysegar*a.mennyiseg)} Ft</Table.Cell>
                                        </Table.Row>
                                        
                                    ))
                                }
                                    </Table.Body>
                                    <Table.Footer>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='5' textAlign='right'>Összesen bruttó: </Table.HeaderCell>
                                            <Table.HeaderCell positive textAlign='right'>{numberWithSpace(calcBrutto(sum_netto))} Ft</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Footer>
                                    <Table.Footer>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='5' textAlign='right' style={{ fontWeight:'bold' }}>Összesen nettó: </Table.HeaderCell>
                                            <Table.HeaderCell positive textAlign='right' style={{ color: '#E80D8A' }}><b>{numberWithSpace(sum_netto)} Ft</b></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Footer>
                                </Table>
                            </div>
                        ) : null
                    }
                </Grid>
            </React.Fragment>
        )
    }

    pageKiajanlas(){
        if(this.state.arajanlat_to_ugyfel.length !== 0){
            return this.pageKiajanlasIsset()
        }
        return (
            <React.Fragment>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field required>
                            <label>E-mail cím</label>
                            <input placeholder='E-mail cím' name='kiajanlasEmail' value={this.state.kiajanlasEmail} onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Tárgy</label>
                            <input placeholder='Tárgy' name='kiajanlasTargy' value={this.state.kiajanlasTargy} onChange={this.handleChange}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Field 
                        required
                        control={TextareaAutosize}
                        label="Árajánlat tartalma"
                        placeholder="Árajánlat tartalma"
                        onChange={this.handleChange}
                        useCacheForDOMMeasurements
                        value={this.state.kiajanlasTartalom}
                        name='kiajanlasTartalom'
                    />
                    <Divider horizontal style={{ marginTop: '30px' }}><Header as='h4'><Icon name='tag' />Árjegyzék</Header></Divider>
                    {
                        (this.state.arjegyzekRows.length > 0) ? (
                            <React.Fragment>
                                <Table striped celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell textAlign='center' width='1'>#</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='3'>Megnevezés</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='1'>Mennyiség</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='1'>Me.egys.</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='2'>Nettó VIP ár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='2'>Nettó nagyker ár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='2'>Nettó kisker ár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='2'>Nettó egys.ár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center' width='3'>Megjegyzés</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center'>&nbsp;</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                    {
                                        this.state.arjegyzekRows.map((ar, idx) => (
                                            <Table.Row key={idx} onClick={ () => null }>
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
                                                <Table.Cell>
                                                    <Form.Field required>
                                                        <input type='text' placeholder='Megjegyzés' value={ar.megjegyzes} onChange={this.handleChange_Megjegyzes(idx)}/>
                                                    </Form.Field>
                                                </Table.Cell>
                                                <Table.Cell textAlign='center'>
                                                    <Button icon negative compact size='mini' type='button' onClick={ this.handleDeleteAr(idx) }>
                                                        <Icon name='trash' />
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
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
                    <Divider horizontal style={{ marginTop: '30px' }}><Header as='h4'><Icon name='check circle outline' />Befejezés</Header></Divider>
                    <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                        <Button labelPosition='right' type='button' icon='check' content='Árajánlat mentése és küldése' color='green' onClick={ () => this.saveAndSendArajanlat()  } disabled={!this.state.saveAndSendBtn} loading={!this.state.saveAndSendBtn}/>
                    </div>
                </Form>
            </React.Fragment>
        )
    }

    renderInfo(){
        const menus = [
          {
            menuItem: 'Árajánlat',
            render: () => this.pageArajanlat(),
          },
          {
            menuItem: 'Belső megjegyzések',
            render: () => this.pageMegjegyzesek(),
          },
          {
            menuItem: 'Árajánlat bekérés',
            render: () => this.pageArajanlatBekeres(),
          },
          {
            menuItem: (
                <Menu.Item key='baa'>
                    Bekért alvállalkozói árajánlatok <Label>{this.state.bekertAlvallalkozoiArajanlatokCount}</Label>
                </Menu.Item>
            ),
            render: () => this.pageAlvallalkozoiArajanlatok(),
          }
        ]
        return (
        <React.Fragment>
          <Tab menu={{ secondary: true, pointing: true }} panes={menus} />
        </React.Fragment>
        )
    }
    
    render(){
        return (
            <Container>
                <PageHeaderAdmin />
                <p style={{ marginTop: '5em' }}></p>
                <Button basic labelPosition='left' icon='left chevron' content='Vissza' onClick={ () => this.props.history.push("/admin/arajanlatok") }  style={{ marginBottom: '25px' }}/>
                {(this.state.data) ? this.renderInfo() : <PlaceholderComponent /> }  

                <ArajanlatToAlvallalkozoModal data={this.state.arajanlatDetailsModalData} openModal={this.state.arajanlatDetailsModal} closeModal={ () => this.setState({ arajanlatDetailsModal: !this.state.arajanlatDetailsModal })} />

                <VallalkozoValaszModal data={this.state.vallalkozoValaszModalData} openModal={this.state.vallalkozoValaszModal} closeModal={ () => this.setState({ vallalkozoValaszModal: !this.state.vallalkozoValaszModal })} />
                
            </Container>
        )
    }
}
export default ArajanlatPage;