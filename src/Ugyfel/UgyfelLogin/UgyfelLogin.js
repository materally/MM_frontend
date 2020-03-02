import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Segment, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import API, { API_SECRET } from '../../api';
import LoaderScreen from '../../components/LoaderScreen/LoaderScreen'
import AuthContext from '../../context/auth-context'

class UgyfelLogin extends Component {

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = { 
        inputEmail: '',
        inputPassword: '',
        messageHidden: true,
        messageText: '',
        submitBtn: true,
        loading: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.setState({ loading: false })
  }

  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event){
    this.setState({ submitBtn: false, loading: true })
    const email = this.state.inputEmail;
    const password = this.state.inputPassword;

      if(email.trim().length === 0 || password.trim().length === 0){
          this.setState({ messageHidden: false, messageText: 'Minden mező kitöltése kötelező!', submitBtn: true, loading: false });
          return;
      }else{
          this.setState({ messageHidden: true, messageText: '', submitBtn: true })
      }

    API.post(`ugyfel/login/${email}/${password}`, 'API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.data;
            var user_id = response.user_id;
            var company_id = response.company_id;
            var token = response.token;
            if(response.error){
                this.setState({ messageHidden: false, messageText: response.error, loading: false });
                return;
            }
            if(token){
                this.context.login(user_id, token)
                localStorage.setItem('token', token);
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('company_id', company_id);
            }
        })
        .catch(error => console.log("Error: "+error));
    
        this.setState({ loading: false })
    event.preventDefault();
  }

  render() { 
    return ( 
        <React.Fragment>
            <LoaderScreen loading={this.state.loading}/>
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header textAlign='center'>
                    <Image src={process.env.PUBLIC_URL + '/mm-logo-200.png'} style={{ width: '30%' }}/>
                </Header>
                <Header as='h2' color='grey' textAlign='center'>
                    Ügyfélportál bejelentkezés
                </Header>
                <Form size='large' onSubmit={this.handleSubmit}>
                    <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail cím' name='inputEmail' value={this.state.inputEmail} onChange={this.handleChange} />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Jelszó'
                        type='password'
                        name='inputPassword'
                        value={this.state.inputPassword} 
                        onChange={this.handleChange}
                    />
                    <Button color='olive' fluid size='large' type='submit' disabled={!this.state.submitBtn}>
                        Bejelentkezés
                    </Button>
                    </Segment>
                </Form>
                <Message>
                    Elfelejtetted a jelszavad? <Link to='/ugyfel/lostpw'>Új jelszó igénylése</Link>
                </Message>
                <Message color='red' hidden={this.state.messageHidden}>
                    <b>Hiba!</b> <br />
                    {this.state.messageText}
                </Message>
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );
  }
}
 
export default UgyfelLogin;