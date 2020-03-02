import React, { Component } from 'react';
import { Container, Table, Header, Button } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import './AlvallalkozoPage.css';

import PageHeaderAdmin from '../components/Header'
import NewAlvallalkozoModal from './NewAlvallalkozoModal';

class AlvallalkozokPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openModalNewAlvallalkozo: false
        }
        this.getData();
    }

    getData(){
        API.get(`alvallalkozo`, {params: {'API_SECRET': API_SECRET} } )
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ data: response });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    selectAv = (av_id) => {
        this.props.history.push("/admin/alvallalkozo/"+av_id);
    }

    closeModal = () => {
        this.setState({ openModalNewAlvallalkozo: false });
    }

    render(){
        return (
            <Container>
                <PageHeaderAdmin />
                <p style={{ marginTop: '5em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Alvállalkozók</Header>
                    <Button floated='right' compact labelPosition='right' icon='plus square' content='Új alvállalkozó létrehozása' color='green' onClick={ () => this.setState({ openModalNewAlvallalkozo: !this.state.openModalNewAlvallalkozo})  } />
                </div>
                    {
                        (this.state.data.length !== 0) ? (
                            <Table striped selectable>
                                <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Cégnév</Table.HeaderCell>
                                    <Table.HeaderCell>Kapcsolattartó</Table.HeaderCell>
                                    <Table.HeaderCell>E-mail</Table.HeaderCell>
                                </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        this.state.data.map((av) => (
                                            <Table.Row key={av.alvallalkozo_id} onClick={ () => this.selectAv(av.alvallalkozo_id) } className="stripedTableTr">
                                                <Table.Cell>{av.cegnev}</Table.Cell>
                                                <Table.Cell>{av.vezeteknev} {av.keresztnev} { av.telefon && `(${av.telefon})` }</Table.Cell>
                                                <Table.Cell>{av.email}</Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                </Table.Body>
                            </Table>
                        ) : <h4>Még nincs alvállalkozó!</h4>
                    }
                
                 <NewAlvallalkozoModal openModal={this.state.openModalNewAlvallalkozo} closeModal={this.closeModal} getData={() => this.getData()}/>
            </Container>
        )
    }
}
export default AlvallalkozokPage;