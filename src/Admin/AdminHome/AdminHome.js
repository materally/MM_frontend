import React, { Component } from 'react';
import { Container, Table, Header, Segment, Icon } from 'semantic-ui-react'
import PageHeaderAdmin from '../components/Header'
import API, { API_SECRET } from '../../api';

class AdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.getData();
  }

  getData(){
    API.get(`arajanlat/adminGet`, {params: {'API_SECRET': API_SECRET} })
    .then(res => {
        var response = res.data;
        if(response){
            response.forEach((a) => {
              if(a.feldolgozva === "0"){
                this.setState(prevState => ({
                  data: [...prevState.data, a]
                }))
              }
            })
        }
    })
    .catch(error => console.log("Error: "+error));
}

  selectArajanlat = (arajanlat_id) => {
    this.props.history.push("/admin/arajanlatok/"+arajanlat_id);
  }

  gag(){
    return (
      <Segment placeholder>
        <Header as='h1' icon>
          <Icon name='check circle' color='green' />
          Gratulálok! Nincs árajánlatkérésed!
        </Header>
      </Segment>
    )
  }

  render(){
    return (
      <Container>
        <PageHeaderAdmin  />
          <p style={{ marginTop: '5em' }}></p>
          <div style={{ paddingBottom: '3em' }}>
              <Header as='h2' floated='left'>Friss árajánlatkérések</Header>
          </div>
        {
          (this.state.data.length !== 0) ? (
            <Table striped selectable>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Cégnév</Table.HeaderCell>
                    <Table.HeaderCell>Megnevezés</Table.HeaderCell>
                    <Table.HeaderCell>Dátum</Table.HeaderCell>
                    <Table.HeaderCell>Gyártási határidő</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        this.state.data.map((arajanlat) => (
                            <Table.Row key={arajanlat.arajanlat_id} onClick={ () => this.selectArajanlat(arajanlat.arajanlat_id) } className="stripedTableTr">
                                <Table.Cell>{arajanlat.arajanlat_id}</Table.Cell>
                                <Table.Cell>{arajanlat.company_data.cegnev}</Table.Cell>
                                <Table.Cell>{arajanlat.megnevezes}</Table.Cell>
                                <Table.Cell>{arajanlat.datum}</Table.Cell>
                                <Table.Cell>{arajanlat.gyartasi_hatarido}</Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
        ) : this.gag()
        }
      </Container>
    );
  }
}

export default AdminHome;
