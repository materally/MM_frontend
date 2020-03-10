import React, { Component } from 'react';
import { Container, Table, Header, Button } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeaderAdmin from '../components/Header'
import FooterUgyfel from '../../Ugyfel/components/Footer';
import '../../Ugyfel/components/Footer.css';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

import './ClientsPage.css';
import NewClientModal from './NewClientModal';

class ClientsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        data: [],
        loadingPage: true,
        openModal: false
    }
    this.getData();
  }

  getData(){
    API.get(`ugyfel/ugyfeltorzs`, {params: {'API_SECRET': API_SECRET} })
    .then(res => {
        var response = res.data;
        if(response){
            this.setState({ data: response, loadingPage: false });
        }
    })
    .catch(error => console.log("Error: "+error));
  }
  
  selectClient = (client_id) =>{
      this.props.history.push("/admin/clients/"+client_id);
  }

  closeModal = () => {
    this.setState({ openModal: false });
  }

  renderList(){
    return (
      <Table striped selectable>
          <Table.Header>
          <Table.Row>
              <Table.HeaderCell>Cégnév</Table.HeaderCell>
              <Table.HeaderCell>Számlázási cím</Table.HeaderCell>
              <Table.HeaderCell>Adószám</Table.HeaderCell>
          </Table.Row>
          </Table.Header>
          <Table.Body>
              {
                  this.state.data.map((client) => (
                      <Table.Row key={client.company_id} onClick={ () => this.selectClient(client.company_id) } className="stripedTableTr">
                          <Table.Cell>{client.cegnev}</Table.Cell>
                          <Table.Cell>{client.szamlazasi_cim}</Table.Cell>
                          <Table.Cell>{client.adoszam}</Table.Cell>
                      </Table.Row>
                  ))
              }
          </Table.Body>
      </Table>
    )
  }

  renderInit(){
    if(this.state.loadingPage && this.state.data.length === 0){
      return <PlaceholderComponent />
    }else if(!this.state.loadingPage && this.state.data.length === 0){
      return <h4>Még nincs ügyfél!</h4>
    }else{
      return this.renderList()
    }
  }

  render() { 
    return ( 
      <div className="Site">
        <Container className="Site-content">
        <PageHeaderAdmin />
        <p style={{ marginTop: '5em' }}></p>
        <div style={{ paddingBottom: '3em' }}>
            <Header as='h2' floated='left'>Ügyféltörzs</Header>
            <Button floated='right' compact labelPosition='right' icon='plus square' content='Új ügyfél létrehozása' color='green' onClick={ () => this.setState({ openModal: !this.state.openModal})  } />
        </div>
        { this.renderInit() }
        
        <NewClientModal openModal={this.state.openModal} closeModal={this.closeModal} getData={() => this.getData()}/>
      </Container>
      <FooterUgyfel />
      </div>
    );
  }
}
 
export default ClientsPage;