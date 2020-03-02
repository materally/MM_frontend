import React, { Component } from 'react';
import { Container, Table, Header } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeaderAdmin from '../components/Header'

class ArajanlatokPage extends Component {
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
                this.setState({ data: response });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    selectArajanlat = (arajanlat_id) => {
        this.props.history.push("/admin/arajanlatok/"+arajanlat_id);
    }

    render(){
        return (
            <Container>
                <PageHeaderAdmin />
                <p style={{ marginTop: '5em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Árajánlatkérések</Header>
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
                                            <Table.Row key={arajanlat.arajanlat_id} onClick={ () => this.selectArajanlat(arajanlat.arajanlat_id) } className="stripedTableTr" positive={ (arajanlat.feldolgozva === 1) ? true : false }>
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
                        ) : <h4>Még nincs árajánlatkérés!</h4>
                    }
            </Container>
        )
    }
}
export default ArajanlatokPage;