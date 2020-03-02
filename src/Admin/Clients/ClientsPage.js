import React, { Component } from 'react';
import { Container, Table, Header, Button } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeaderAdmin from '../components/Header'

import './ClientsPage.css';
import NewClientModal from './NewClientModal';

class ClientsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        data: [],
        openModal: false
    }
    this.getData();
  }

  getData(){
    API.get(`ugyfel/ugyfeltorzs`, {params: {'API_SECRET': API_SECRET} })
    .then(res => {
        var response = res.data;
        if(response){
            this.setState({ data: response });
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

  render() { 
    return ( 
      <Container>
        <PageHeaderAdmin />
        <p style={{ marginTop: '5em' }}></p>
        <div style={{ paddingBottom: '3em' }}>
            <Header as='h2' floated='left'>Ügyféltörzs</Header>
            <Button floated='right' compact labelPosition='right' icon='plus square' content='Új ügyfél létrehozása' color='green' onClick={ () => this.setState({ openModal: !this.state.openModal})  } />
        </div>
        {
            (this.state.data.length !== 0) ? (
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
            ) : <h4>Még nincs ügyfél!</h4>
        }
        
        <NewClientModal openModal={this.state.openModal} closeModal={this.closeModal} getData={() => this.getData()}/>
      </Container>
    );
  }
}
 
export default ClientsPage;