import React, { Component } from 'react';
import TextareaAutosize from "react-textarea-autosize";
import Swal from 'sweetalert2';
import { Container, Button, Form, Confirm } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import AuthContext from '../../context/auth-context'
import PageHeaderUgyfel from '../components/Header';
import FooterUgyfel from '../components/Footer';
import '../components/Footer.css';

class UjArajanlat extends Component {

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = { 

        dataSablonok: [],

        megnevezes: '',
        gyartasi_hatarido: '',
        tartalom: '',

        loadSablonConfirmWindow: false,
        loadingTartalom: '',
        submitBtn: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.loadSablonok();
  }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    loadSablonok(){
        API.get(`arajanlat/sablon`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ dataSablonok: response });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    submitBtn(){
        this.setState({ submitBtn: false })
        const { megnevezes, gyartasi_hatarido, tartalom } = this.state;
        const user_id = localStorage.getItem('user_id');
        const company_id = localStorage.getItem('company_id');
        if(megnevezes.trim().length === 0 || gyartasi_hatarido.trim().length === 0 || tartalom.trim().length === 0){
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
        API.post('arajanlat/create', 'user_id='+user_id+'&company_id='+company_id+'&megnevezes='+encodeURIComponent(megnevezes)+'&gyartasi_hatarido='+gyartasi_hatarido+'&tartalom='+encodeURIComponent(tartalom)+'&API_SECRET='+API_SECRET)
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
                        megnevezes: '',
                        gyartasi_hatarido: '',
                        tartalom: '',
                        submitBtn: true
                    }, () => {
                        Swal.fire({
                            title: 'Sikeres',
                            text: 'Árajánlat kérésedet hamarosan feldolgozzuk!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2500
                        }).then(() => {
                            this.props.history.push("/ugyfel/arajanlataim");
                          })
                    })
                }
            })
            .catch(error => {
                this.setState({ messageHidden: false, messageText: 'Hiba a szerver oldalon!', submitBtn: true });
            });
    }

  render() { 
    return ( 
        <div className="Site">
        <Container className="Site-content">
            <PageHeaderUgyfel />
            <p style={{ marginTop: '5em' }}></p>
            <h1>Új árajánlat</h1>

            <Form>
                <Form.Field required>
                    <label>Megnevezés</label>
                    <input placeholder='Megnevezés' name='megnevezes' value={this.state.megnevezes} onChange={this.handleChange} />
                </Form.Field>
                <Form.Field required>
                    <label>Gyártási határidő</label>
                    <input type="date" placeholder='Gyártási határidő' name='gyartasi_hatarido' value={this.state.gyartasi_hatarido} onChange={this.handleChange} />
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
        <FooterUgyfel />
        </div>
    );
  }
}
 
export default UjArajanlat;