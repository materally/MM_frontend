import React, { Component } from 'react';
import { Container, Button, Message, Tab, Confirm, Form, TextArea } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeaderAdmin from '../components/Header'
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

class AlvallalkozoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alvallalkozo_id: this.props.match.params.alvallalkozo_id,
            data:[],
            saveBeallitasokBtn: true,
            messageHidden: true,
            messageText: '',
            messageHiddenGreen: true,
            messageTextGreen: '',
            deleteAlvallalkozoConfirmWindow: false,

            token: '',
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
        this.getData()
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    getData(){
        API.get(`alvallalkozo/${this.state.alvallalkozo_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({
                    data: response,
                    email: response.email,
                    token: response.token,
                    vezeteknev: response.vezeteknev,
                    keresztnev: response.keresztnev,
                    telefon: (response.telefon === null) ? '' : response.telefon,
                    cegnev: response.cegnev,
                    megnevezes: (response.megnevezes === null) ? '' : response.megnevezes,
                    adoszam: (response.adoszam === null) ? '' : response.adoszam,
                    bankszamlaszam: (response.bankszamlaszam === null) ? '' : response.bankszamlaszam,
                    megjegyzes: (response.megjegyzes === null) ? '' : response.megjegyzes
                });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    deleteAlvallalkozo(){
        const { alvallalkozo_id, token } = this.state;
        API.post('alvallalkozo/delete/'+alvallalkozo_id+'/'+token, 'API_SECRET='+API_SECRET)
        .then(res => {
            this.props.history.push("/admin/alvallalkozo")
        })
        .catch(error => console.log("Error: "+error));
    }

    pageBeallitasok(){
        return (
            <React.Fragment>
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
                <Message color='green' hidden={this.state.messageHiddenGreen}>
                    <b>Sikeres!</b> <br />
                    {this.state.messageTextGreen}
                </Message>
                <div style={{ textAlign: 'center', padding: '30px 0px 60px 0px' }}>
                    <Button type='submit'
                            negative
                            icon='trash'
                            labelPosition='left'
                            content="Alvállalkozó törlése"
                            onClick={ () => this.setState({ deleteAlvallalkozoConfirmWindow: true }) }
                    />
                    <Button type='submit'
                            positive
                            icon='save'
                            labelPosition='right'
                            content="Módosítások mentése"
                            onClick={ () => this.saveBeallitasokBtn() }
                            disabled={!this.state.saveBeallitasokBtn}
                            loading={!this.state.saveBeallitasokBtn}
                    />
                </div>
            </React.Fragment>
        )
    }

    renderInfo(){
        const menus = [
          {
            menuItem: 'Beállítások',
            render: () => this.pageBeallitasok(),
          }
        ]
        return (
        <React.Fragment>
          <h1>{this.state.data.cegnev}</h1>
          <Tab menu={{ secondary: true, pointing: true }} panes={menus} />
        </React.Fragment>
        )
    }

    saveBeallitasokBtn(){
        this.setState({ saveBeallitasokBtn: false })
        const { alvallalkozo_id, email, vezeteknev, keresztnev, telefon, cegnev, megnevezes, adoszam, bankszamlaszam, megjegyzes } = this.state

        if(email.trim().length === 0 || vezeteknev.trim().length === 0 || keresztnev.trim().length === 0 || cegnev.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', saveBeallitasokBtn: true });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', saveBeallitasokBtn: false })
        }
        API.post('alvallalkozo/update/'+alvallalkozo_id, 'email='+email+'&vezeteknev='+vezeteknev+'&keresztnev='+keresztnev+'&telefon='+telefon+'&cegnev='+cegnev+'&megnevezes='+megnevezes+'&adoszam='+adoszam+'&bankszamlaszam='+bankszamlaszam+'&megjegyzes='+megjegyzes+'&API_SECRET='+API_SECRET)
            .then(res => {
                var response = res.data;
                if(response.error){
                    this.setState({ messageHidden: false, messageText: response.error, saveBeallitasokBtn: true });
                    return;
                }
                if(response.success){
                    this.getData();
                    this.setState({ 
                        messageTextGreen: response.success, 
                        messageHiddenGreen: false,
                        saveBeallitasokBtn: true,
                        messageHidden: true,
                        messageText: '',
                    })
                    setTimeout(
                        function() {
                            this.setState({ messageTextGreen: '', messageHiddenGreen: true });
                        }
                        .bind(this),
                        2000
                    );
                }
            })
            .catch(error => {
                console.log(error)
                this.setState({ messageHidden: false, messageText: 'Hiba a szerver oldalon!', saveBeallitasokBtn: true });
            });

            setTimeout(
                function() {
                    this.setState({ messageTextGreen: '', messageHiddenGreen: true, messageHidden: true, messageText: '' });
                }
                .bind(this),
                2000
            );
    }

    render(){
        return (
            <Container>
                <PageHeaderAdmin />
                <p style={{ marginTop: '5em' }}></p>
                <Button basic labelPosition='left' icon='left chevron' content='Vissza' onClick={ () => this.props.history.push("/admin/alvallalkozo") } />
                {(this.state.data) ? this.renderInfo() : <PlaceholderComponent /> }

                <Confirm
                    content='Biztos vagy benne? A művelet nem vonható vissza!'
                    size='tiny'
                    cancelButton='Mégsem'
                    confirmButton='Mehet'
                    open={this.state.deleteAlvallalkozoConfirmWindow}
                    onCancel={ () => this.setState({ deleteAlvallalkozoConfirmWindow: false }) }
                    onConfirm={ () => this.deleteAlvallalkozo() }
                />

            </Container>
        )
    }
}
export default AlvallalkozoPage;