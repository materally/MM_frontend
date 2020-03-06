import React, { Component } from 'react';
import { Container, Button, Card, Tab, Table, Icon, Confirm, Divider, Header } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeaderAdmin from '../components/Header'
import PlaceholderComponent from '../../components/Placeholder/Placeholder';
import NewDeliveryModal from './NewDeliveryModal';
import EditDeliveryModal from './EditDeliveryModal';
import EditUserModal from './EditUserModal';
import NewUserModal from './NewUserModal';
import Swal from 'sweetalert2';

class ClientPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      company_id: this.props.match.params.company_id,
      data: [],
      price_scope: '',
      deleteConfirmWindow: false,
      deleteDeliveryId: 0,
      openModal: false,
      openModalEdit: false,
      openModalUser: false,
      editDeliveryId: 0,
      editDeliveryAddress: '',
      companyUsers: [],
      deleteUserConfirmWindow: false,
      deleteUserId: 0,
      editUserId: 0,
      openModalUserEdit: false,
      editUserData: [],
      openModalNewUser: false,
      deleteClientConfirmWindow: false,
    }
    this.getData()
    this.getUsersData()
  }

  closeModal = () => {
    this.setState({ openModal: false, openModalEdit: false, openModalUserEdit: false, openModalNewUser: false });
  }

  getData(){
    API.get(`ugyfel/ugyfeltorzs/${this.state.company_id}`, {params: {'API_SECRET': API_SECRET} })
    .then(res => {
        var response = res.data;
        if(response){
            this.setState({ data: response, price_scope: response.price_scope });
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  getUsersData(){
    API.get(`ugyfel/getCompanyUsers/${this.state.company_id}`, {params: {'API_SECRET': API_SECRET} })
    .then(res => {
        var response = res.data;
        if(response){
            this.setState({ companyUsers: response });
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  pageInfo(){
    return(  
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>{this.state.data.cegnev}</Card.Header>
            <Card.Meta>{this.state.data.adoszam}</Card.Meta>
            <Card.Description>{this.state.data.szamlazasi_cim}</Card.Description>
            <Card.Description>{this.state.data.kozponti_telefonszam}</Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Felhasználók</Card.Header>
            {
              (this.state.data.company_users && this.state.data.company_users.length !== 0) ? (
              this.state.data.company_users.map((user) => (
              <Card.Description key={user.user_id}><b>{user.vezeteknev} {user.keresztnev}</b> {(user.telefonszam) && <i>- ({user.telefonszam})</i>}</Card.Description>
              ))
              ) : <Card.Description>Még nincs felhasználó</Card.Description>
            }
            
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>Kiszállítási címek</Card.Header>
            {
              (this.state.data.company_delivery && this.state.data.company_delivery.length !== 0) ? (
              this.state.data.company_delivery.map((delivery) => (
                <Card.Description key={delivery.delivery_id}>&bull; {delivery.address}</Card.Description>
              ))
              ) : <Card.Description>Még nincs kiszállítási cím</Card.Description>
            }
            
          </Card.Content>
        </Card>
      </Card.Group>
    )
  }

  pageDelivery(){
    return(  
      <React.Fragment>
        <Button floated='right' compact labelPosition='right' icon='plus square' color='green' content='Új kiszállítási cím hozzáadása' onClick={ () => this.setState({ openModal: !this.state.openModal})  }/>
        {
          (this.state.data.company_delivery.length > 0) ? (
          <Table striped style={{ marginTop: '60px' }}>
              <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>Cím</Table.HeaderCell>
                  <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              </Table.Row>
              </Table.Header>
              <Table.Body>
                  {
                    this.state.data.company_delivery && this.state.data.company_delivery.map((delivery) => (
                          <Table.Row key={delivery.delivery_id}>
                              <Table.Cell>{delivery.address}</Table.Cell>
                              <Table.Cell style={{ textAlign: 'right' }}>
                                <Icon link name='edit' color='blue' onClick={ () => this.setState({ editDeliveryId: delivery.delivery_id, openModalEdit: true, editDeliveryAddress: delivery.address  }) }/>
                                <Icon link name='trash' color='red' onClick={ () => this.setState({ deleteConfirmWindow: true, deleteDeliveryId: delivery.delivery_id }) }/>
                              </Table.Cell>
                          </Table.Row>
                      ))
                  }
              </Table.Body>
          </Table>) : <h3>Még nincs kiszállítási cím!</h3>
        }
      </React.Fragment>
    )
  }

  pageUsers(){
    return(  
      <React.Fragment>
        <Button floated='right' compact labelPosition='right' icon='plus square' color='green' content='Új felhasználó hozzáadása' onClick={ () => this.setState({ openModalNewUser: !this.state.openModalNewUser})  }/>
        {
          (this.state.companyUsers.length > 0) ? (
          <Table striped style={{ marginTop: '60px' }}>
              <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>Név</Table.HeaderCell>
                  <Table.HeaderCell>E-mail cím</Table.HeaderCell>
                  <Table.HeaderCell>Telefonszám</Table.HeaderCell>
                  <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              </Table.Row>
              </Table.Header>
              <Table.Body>
                  {
                    this.state.companyUsers && this.state.companyUsers.map((user) => (
                          <Table.Row key={user.user_id}>
                              <Table.Cell>{user.vezeteknev} {user.keresztnev}</Table.Cell>
                              <Table.Cell>{user.email}</Table.Cell>
                              <Table.Cell>{user.telefonszam}</Table.Cell>
                              <Table.Cell style={{ textAlign: 'right' }}>
                                <Icon link name='edit' color='blue' onClick={ () => this.setState({ editUserId: user.user_id, openModalUserEdit: true, editUserData: {vezeteknev: user.vezeteknev, keresztnev: user.keresztnev, email: user.email, telefonszam: user.telefonszam}}) }/>
                                <Icon link name='trash' color='red' onClick={ () => this.setState({ deleteUserConfirmWindow: true, deleteUserId: user.user_id }) }/>
                              </Table.Cell>
                          </Table.Row>
                      ))
                  }
              </Table.Body>
          </Table>) : <h3>Még nincs felhasználó!</h3>
        }
      </React.Fragment>
    )
  }

  changePriceScope(scope){
    this.setState({ price_scope: scope })
    API.post('ugyfel/changePriceScope/', 'company_id='+this.state.company_id+'&price_scope='+scope+'&API_SECRET='+API_SECRET)
    .then(res => {
        var response = res.data;
        if(response.success){
          Swal.fire({
            title: 'Sikeres',
            text: 'Sikeres módosítás',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  pageSettings(){
    return(  
      <React.Fragment>
        <Divider horizontal style={{ marginTop: '40px' }}>
          <Header as='h4'>
            <Icon name='tag' />
            Árkedvezmény
          </Header>
        </Divider>
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <Button.Group>
            <Button active={(this.state.price_scope === 'kisker') ? true : false} onClick={ () => this.changePriceScope('kisker') }>Kisker</Button>
            <Button active={(this.state.price_scope === 'nagyker') ? true : false} onClick={ () => this.changePriceScope('nagyker') }>Nagyker</Button>
            <Button active={(this.state.price_scope === 'vip') ? true : false} onClick={ () => this.changePriceScope('vip') }>VIP</Button>
          </Button.Group>
        </div>
         <Divider horizontal>
          <Header as='h4'>
            <Icon name='trash' />
            Törlés
          </Header>
        </Divider>
        <div style={{ textAlign: 'center' }}>
          <Button compact labelPosition='left' icon='trash' color='red' content='Ügyfél törlése' onClick={ () => this.setState({ deleteClientConfirmWindow: true})  }/>
        </div>
      </React.Fragment>
    )
  }

  deleteDelivery(){
    API.post('ugyfel/deleteDeliveryAddress/', 'company_id='+this.state.company_id+'&delivery_id='+this.state.deleteDeliveryId+'&API_SECRET='+API_SECRET)
    .then(res => {
        var response = res.data;
        if(response.success){
          this.setState({ deleteDeliveryId: 0, deleteConfirmWindow: false }, () => this.getData());
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  deleteUser(){
    API.post('ugyfel/deleteUser/', 'company_id='+this.state.company_id+'&user_id='+this.state.deleteUserId+'&API_SECRET='+API_SECRET)
    .then(res => {
        var response = res.data;
        console.log(res)
        if(response.success){
          this.setState({ deleteUserId: 0, deleteUserConfirmWindow: false }, () => this.getUsersData());
        }
    })
    .catch(error => console.log("Error: "+error));
  }

  deleteClient(){
    API.post('ugyfel/deleteClient/', 'company_id='+this.state.company_id+'&API_SECRET='+API_SECRET)
    .then(res => {
        var response = res.data;
        console.log(res)
        if(response.success){
          this.setState({ deleteClientConfirmWindow: false }, () => this.props.history.push("/admin/clients"));
        }
    })
    .catch(error => console.log("Error: "+error));
  }


  renderInfo(){
    const menus = [
      {
        menuItem: 'Információ',
        render: () => this.pageInfo(),
      },
      {
        menuItem: 'Felhasználók',
        render: () => this.pageUsers(),
      },
      {
        menuItem: 'Kiszállítási címek',
        render: () => this.pageDelivery(),
      },
      {
        menuItem: 'Beállítások',
        render: () => this.pageSettings(),
      }
    ]
    return (
    <React.Fragment>
      <h1>{this.state.data.cegnev}</h1>
      <Tab menu={{ secondary: true, pointing: true }} panes={menus} />
    </React.Fragment>
    )
  }

  render() { 
    return ( 
      <Container>
        <PageHeaderAdmin />
        <p style={{ marginTop: '5em' }}></p>
        <Button basic labelPosition='left' icon='left chevron' content='Vissza' onClick={ () => this.props.history.push("/admin/clients") } />
        {(this.state.data) ? this.renderInfo() : <PlaceholderComponent /> }

        <Confirm
          content='Biztos vagy benne? A művelet nem vonható vissza!'
          size='tiny'
          cancelButton='Mégsem'
          confirmButton='Mehet'
          open={this.state.deleteConfirmWindow}
          onCancel={ () => this.setState({ deleteConfirmWindow: false }) }
          onConfirm={ () => this.deleteDelivery() }
        />

        <Confirm
          content='Biztos vagy benne? A művelet nem vonható vissza!'
          size='tiny'
          cancelButton='Mégsem'
          confirmButton='Mehet'
          open={this.state.deleteUserConfirmWindow}
          onCancel={ () => this.setState({ deleteUserConfirmWindow: false }) }
          onConfirm={ () => this.deleteUser() }
        />

        <Confirm
          content='Biztos vagy benne? Törlődik minden adat, mely az ügyféllel kapcsolatos! A művelet nem vonható vissza!'
          size='tiny'
          cancelButton='Mégsem'
          confirmButton='Mehet'
          open={this.state.deleteClientConfirmWindow}
          onCancel={ () => this.setState({ deleteClientConfirmWindow: false }) }
          onConfirm={ () => this.deleteClient() }
        />

        <NewDeliveryModal openModal={this.state.openModal} closeModal={this.closeModal} getData={() => this.getData()} company_id={this.state.company_id}/>

        <NewUserModal openModal={this.state.openModalNewUser} closeModal={this.closeModal} getData={() => this.getUsersData()} company_id={this.state.company_id}/>

        <EditDeliveryModal 
          openModal={this.state.openModalEdit} 
          closeModal={this.closeModal} 
          getData={() => this.getData()} 
          company_id={this.state.company_id} 
          delivery_id={this.state.editDeliveryId} 
          address={this.state.editDeliveryAddress}
        />
        <EditUserModal 
          openModal={this.state.openModalUserEdit} 
          closeModal={this.closeModal} 
          getData={() => this.getUsersData()} 
          user_id={this.state.editUserId} 
          user_data={this.state.editUserData}
          company_id={this.state.company_id}
        />
      </Container>
    );
  }
}
 
export default ClientPage;