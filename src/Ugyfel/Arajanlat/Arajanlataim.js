import React, { Component } from 'react';
import { Container, Table, Header, Icon } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeaderUgyfel from '../components/Header';

class ArajanlataimPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.getData();
    }

    getData(){
        const company_id = localStorage.getItem('company_id')
        API.get(`arajanlat/${company_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ data: response });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    selectArajanlat = (arajanlat_id) => {
        this.props.history.push("/ugyfel/arajanlataim/"+arajanlat_id);
    }

    render(){
        return (
            <Container>
                <PageHeaderUgyfel />
                <p style={{ marginTop: '5em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Árajánlataim</Header>
                </div>
                    {
                        (this.state.data.length === 0) ? (
                            <h4>Még nincs árajánlatkérésed!</h4>
                        ) : (<Table striped selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Megnevezés</Table.HeaderCell>
                                <Table.HeaderCell>Ekkor kértük</Table.HeaderCell>
                                <Table.HeaderCell>Gyártási határdidő</Table.HeaderCell>
                                <Table.HeaderCell>Felhasználó</Table.HeaderCell>
                                <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                            </Table.Row>
                            </Table.Header>
                        <Table.Body>
                            {
                                this.state.data.map((a) => (
                                    <Table.Row key={a.arajanlat_id} onClick={ () => this.selectArajanlat(a.arajanlat_id) } className="stripedTableTr" positive={ (a.to_ugyfel.pdf === '') ? false : true }>
                                        <Table.Cell>{a.arajanlat_id}</Table.Cell>
                                        <Table.Cell>{a.megnevezes}</Table.Cell>
                                        <Table.Cell>{a.datum}</Table.Cell>
                                        <Table.Cell>{a.gyartasi_hatarido}</Table.Cell>
                                        <Table.Cell>{a.user_data.vezeteknev} {a.user_data.keresztnev}</Table.Cell>
                                        <Table.Cell>{
                                        (a.to_ugyfel.pdf === '') ? '' : <Icon name='file pdf' />
                                        }</Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>)
                    }
            </Container>
        )
    }
}
export default ArajanlataimPage;