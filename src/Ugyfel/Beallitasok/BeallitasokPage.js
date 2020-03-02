import React, { Component } from 'react';
import PageHeaderUgyfel from '../components/Header';
import { Container, Tab, Form, Message, Button } from 'semantic-ui-react';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';
import API, { API_SECRET } from '../../api';
import Swal from 'sweetalert2';

class BeallitasokPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        user_id: localStorage.getItem('user_id'),
        userData: [],
        company_id: 0,
        vezeteknev: '',
        keresztnev: '',
        email: '',
        telefonszam: '',

        oldpw: '',
        newpw: '',
        newpwre: '',

        saveAdataimBtn: true,
        saveNewPwBtn: true,

        messageHidden: true,
        messageText: '',
        messageHiddenGreen: true,
        messageTextGreen: '',
    }
    this.getUserData();
    this.handleChange = this.handleChange.bind(this)
  }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    getUserData(){
        API.get(`ugyfel/${this.state.user_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                const { vezeteknev, keresztnev, email, telefonszam, company_id } = response[0]
                this.setState({ userData: response[0], vezeteknev, keresztnev, email, telefonszam, company_id });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    renderInfo(){
        const menus = [
            {
                menuItem: 'Adataim',
                render: () => this.pageAdataim(),
            },
            {
                menuItem: 'Jelszóváltoztatás',
                render: () => this.pageJelszoValtoztatas(),
            }
        ]
        return (
        <React.Fragment>
            <Tab menu={{ secondary: true, pointing: true }} panes={menus} />
        </React.Fragment>
        )
    }

    saveAdataimBtn(){
        this.setState({ saveAdataimBtn: false })
        const { vezeteknev, keresztnev, email, telefonszam, user_id, company_id } = this.state

        if(vezeteknev.trim().length === 0 || keresztnev.trim().length === 0 || email.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', saveAdataimBtn: true });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', saveAdataimBtn: false })
        }

        API.post('ugyfel/editCompanyUser/'+company_id+'/'+user_id, 'vezeteknev='+vezeteknev+'&keresztnev='+keresztnev+'&email='+email+'&telefonszam='+telefonszam+'&API_SECRET='+API_SECRET)
            .then(res => {
                var response = res.data;
                if(response.error){
                    this.setState({ messageHidden: false, messageText: response.error, saveAdataimBtn: true });
                    return;
                }
                if(response.success){
                    this.setState({ saveAdataimBtn: true, messageHidden: true, messageText: '' }, () => {
                        Swal.fire({
                            title: 'Sikeres',
                            text: 'Sikeres mentés!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    })
                }
            })
            .catch(error => {
                this.setState({ messageHidden: false, messageText: 'Hiba a szerver oldalon!', saveNewPwBtn: true });
            });
    }

    pageAdataim(){
        return (
        (this.state.userData.length === 0) ? <PlaceholderComponent /> : (
            <React.Fragment>
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
                <Message color='green' hidden={this.state.messageHiddenGreen}>
                    <b>Sikeres!</b> <br />
                    {this.state.messageTextGreen}
                </Message>
                <div style={{ textAlign: 'center', padding: '30px 0px 60px 0px' }}>
                    <Button type='submit'
                            positive
                            icon='save'
                            labelPosition='right'
                            content="Módosítások mentése"
                            onClick={ () => this.saveAdataimBtn() }
                            disabled={!this.state.saveAdataimBtn}
                            loading={!this.state.saveAdataimBtn}
                    />
                </div>
            </React.Fragment>
        )
        )
    }

    pageJelszoValtoztatas(){
        return (
            <React.Fragment>
                <Form>
                    <Form.Field required>
                        <label>Régi jelszó</label>
                        <input type='password' placeholder='Régi jelszó' name='oldpw' value={this.state.oldpw} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Új jelszó</label>
                        <input type='password' placeholder='Új jelszó' name='newpw' value={this.state.newpw} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Új jelszó újra</label>
                        <input type='password' placeholder='Új jelszó újra' name='newpwre' value={this.state.newpwre} onChange={this.handleChange}/>
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
                            positive
                            icon='save'
                            labelPosition='right'
                            content="Módosítások mentése"
                            onClick={ () => this.saveNewPwBtn() }
                            disabled={!this.state.saveNewPwBtn}
                            loading={!this.state.saveNewPwBtn}
                    />
                </div>
            </React.Fragment>
        
        )
    }

    saveNewPwBtn(){
        this.setState({ saveNewPwBtn: false })
        const { user_id, oldpw, newpw, newpwre } = this.state

        if(oldpw.trim().length === 0 || newpw.trim().length === 0 || newpwre.trim().length === 0){
            this.setState({ messageHidden: false, messageText: 'A csillaggal jelölt mezők kitöltése kötelező!', saveNewPwBtn: true });
            return;
        }else if(newpw !== newpwre){
            this.setState({ messageHidden: false, messageText: 'A két új jelszó nem egyezik!', saveNewPwBtn: true });
            return;
        }else{
            this.setState({ messageHidden: true, messageText: '', saveNewPwBtn: false })
        }

        API.post('ugyfel/editUserPassword/'+user_id, 'oldpw='+oldpw+'&newpw='+newpw+'&API_SECRET='+API_SECRET)
            .then(res => {
                var response = res.data;
                if(response.error){
                    this.setState({ messageHidden: false, messageText: response.error, saveNewPwBtn: true });
                    return;
                }
                if(response.success){
                    this.setState({ saveNewPwBtn: true, messageHidden: true, messageText: '', oldpw: '', newpw: '', newpwre: '' }, () => {
                        Swal.fire({
                            title: 'Sikeres',
                            text: 'Sikeres mentés!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    })
                }
            })
            .catch(error => {
                this.setState({ messageHidden: false, messageText: 'Hiba a szerver oldalon!', saveNewPwBtn: true, buttonLoader: false });
            });
    }

    render() { 
        return (
            <Container>
                <PageHeaderUgyfel  />
                <p style={{ marginTop: '5em' }}></p>
                {this.renderInfo()}
            </Container>
        );
    }

}
 
export default BeallitasokPage;