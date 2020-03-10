import React, { Component } from 'react';
import { Container, Table, Header } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

import PageHeaderAdmin from '../components/Header'
import FooterUgyfel from '../../Ugyfel/components/Footer';
import '../../Ugyfel/components/Footer.css';

class UjArajanlatokPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingPage: true
        }
        this.getData();
    }

    getData(){
        API.get(`arajanlat/ujArajanlatok`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ data: response, loadingPage: false });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    selectArajanlat = (arajanlat_id) => {
        this.props.history.push("/admin/uj_arajanlatok/"+arajanlat_id);
    }

    renderList(){
        return (
            <Table striped selectable>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Címzett</Table.HeaderCell>
                    <Table.HeaderCell>Feladó</Table.HeaderCell>
                    <Table.HeaderCell>Megnevezés</Table.HeaderCell>
                    <Table.HeaderCell>Dátum</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        this.state.data.map((arajanlat) => (
                            <Table.Row key={arajanlat.uj_arajanlat_id} onClick={ () => this.selectArajanlat(arajanlat.uj_arajanlat_id) } className="stripedTableTr">
                                <Table.Cell>{arajanlat.azonosito}</Table.Cell>
                                <Table.Cell>{arajanlat.cimzett_nev} ({(arajanlat.company) ? arajanlat.company.cegnev : ''})</Table.Cell>
                                <Table.Cell>{arajanlat.felado_nev}</Table.Cell>
                                <Table.Cell>{arajanlat.megnevezes}</Table.Cell>
                                <Table.Cell>{arajanlat.datum}</Table.Cell>
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
            return <h4>Még nincs kiajánlás!</h4>
        }else{
            return this.renderList()
        }
    }

    render(){
        return (
            <div className="Site">
              <Container className="Site-content">
                <PageHeaderAdmin />
                <p style={{ marginTop: '5em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Kiajánlások</Header>
                </div>
                    { this.renderInit() }
            </Container>
            <FooterUgyfel />
            </div>
        )
    }
}
export default UjArajanlatokPage;