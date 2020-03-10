import React, { Component } from 'react';
import { Container, Table, Header } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeaderUgyfel from '../components/Header';
import FooterUgyfel from '../components/Footer';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';
import '../components/Footer.css';

class UjArajanlatokPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingPage: true,
        }
        this.getData();
    }

    getData(){
        const company_id = localStorage.getItem('company_id')
        API.get(`arajanlat/getUjArajanlatok/${company_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ data: response, loadingPage: false });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    selectArajanlat = (arajanlat_id) => {
        this.props.history.push("/ugyfel/uj_arajanlataim/"+arajanlat_id);
    }

    renderInit(){
        if(this.state.loadingPage && this.state.data.length === 0){
          return <PlaceholderComponent />
        }else if(!this.state.loadingPage && this.state.data.length === 0){
          return <h4>Még nincs árajánlatkérésed!</h4>
        }else{
          return this.renderList()
        }
    }

    renderList(){
        return (
            <Table striped selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Azonosító</Table.HeaderCell>
                        <Table.HeaderCell>Megnevezés</Table.HeaderCell>
                        <Table.HeaderCell>Dátum</Table.HeaderCell>
                        <Table.HeaderCell>Feladó</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                <Table.Body>
                    {
                        this.state.data.map((a) => (
                            <Table.Row key={a.uj_arajanlat_id} onClick={ () => this.selectArajanlat(a.uj_arajanlat_id) } className="stripedTableTr">
                                <Table.Cell><b>{a.azonosito}</b></Table.Cell>
                                <Table.Cell>{a.megnevezes}</Table.Cell>
                                <Table.Cell>{a.datum}</Table.Cell>
                                <Table.Cell>{a.felado_nev}</Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
        )
    }

    render(){
        return (
            <div className="Site">
            <Container className="Site-content">
                <PageHeaderUgyfel />
                <p style={{ marginTop: '5em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Kapott árajánlataim</Header>
                </div>
                    { this.renderInit() }
            </Container>
            <FooterUgyfel />
            </div>
        )
    }
}
export default UjArajanlatokPage;