import React, { Component } from 'react';
import { Grid, Form, Message, Button, Header, Image, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import API, { API_SECRET } from '../../api';

class LostPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        inputEmail: '',
        submitBtn: true,
        messageHidden: true,
        messageText: '',
        messageHiddenGreen: true,
        messageTextGreen: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event){
    this.setState({ submitBtn: false })
    const email = this.state.inputEmail;

      if(email.trim().length === 0){
          this.setState({ messageHidden: false, messageText: 'Minden mező kitöltése kötelező!', submitBtn: true });
          return;
      }else{
          this.setState({ messageHidden: true, messageText: '', submitBtn: true })
      }

    API.post(`ugyfel/lostpw/${email}`, 'API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.data;
            if(response.error){
                this.setState({ messageHidden: false, messageText: response.error });
                return;
            }
            
            this.setState({ messageHiddenGreen: false, messageTextGreen: response.success });
        })
        .catch(error => console.log("Error: "+error));
    
    event.preventDefault();
  }

  render() { 
    return (
        <React.Fragment>
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header textAlign='center'>
                    <Image src={process.env.PUBLIC_URL + '/mm-logo-200.png'} style={{ width: '30%' }}/>
                </Header>
                <Header as='h2' color='grey' textAlign='center'>
                    Elfelejtett jelszó
                </Header>
                <Form size='large' onSubmit={this.handleSubmit}>
                    <Segment stacked>
                    <Form.Input required fluid icon='envelope' iconPosition='left' placeholder='Új jelszó igénylése' name='inputEmail' value={this.state.inputEmail} onChange={this.handleChange} />
                    
                    <Button color='olive' fluid size='large' type='submit' disabled={!this.state.submitBtn} loading={!this.state.submitBtn}>
                        Új jelszó generálása
                    </Button>
                    </Segment>
                </Form>
                <Message>
                    <Link to='/ugyfel/login'>Vissza a bejelentkezéshez</Link>
                </Message>
                <Message color='red' hidden={this.state.messageHidden}>
                    <b>Hiba!</b> <br />
                    {this.state.messageText}
                </Message>
                <Message color='green' hidden={this.state.messageHiddenGreen}>
                    <b>Sikeres!</b> <br />
                    {this.state.messageTextGreen}
                </Message>
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );
  }
}
 
export default LostPasswordPage;