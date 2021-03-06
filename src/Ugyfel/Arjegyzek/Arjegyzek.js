import React, { Component } from 'react';
import { Container, Table, Header, Input } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import { numberWithSpace, calcBrutto } from '../../Helpers/Helpers'
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

import PageHeaderUgyfel from '../components/Header'
import FooterUgyfel from '../components/Footer';
import '../components/Footer.css';

class UgyfelArjegyzek extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            company_id: localStorage.getItem('company_id'),
            loadingPage: true,
            loading:false,
            query: '',
            filteredData: []
        }
        this.getData();
    }

    handleInputChange = event => {
        this.setState({ loading: true })
        const query = event.target.value;
        this.setState(prevState => {
          const filteredData = prevState.data.filter(element => {
            return element.megnevezes.toLowerCase().includes(query.toLowerCase());
          });
          return {
            query,
            filteredData
          };
        }, () => this.setState({ loading: false }));
    };

    getData(){
        API.get(`ugyfel/ugyfelArjegyzek/${this.state.company_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                const { query } = this.state;
                const filteredData = response.filter(element => {
                    return element.megnevezes.toLowerCase().includes(query.toLowerCase());
                });
                this.setState({ data: response, filteredData: filteredData, loadingPage: false });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    renderList(){
        return (
            <Table striped compact='very' celled size='small'>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign='center'>Megnevezés</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Menny. egys.</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Mennyiség</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Megjegyzés</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Beszerzési nettó ár</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Beszerzési bruttó ár</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        this.state.filteredData.map((ar) => (
                            <Table.Row key={ar.ar_id} onClick={ () => null }>
                                <Table.Cell>{ ar.megnevezes }</Table.Cell>
                                <Table.Cell textAlign='center'>{ ar.mennyiseg_egysege }</Table.Cell>
                                <Table.Cell textAlign='center'>{ ar.mennyiseg }</Table.Cell>
                                <Table.Cell textAlign='right'>{ ar.megjegyzes }</Table.Cell>
                                <Table.Cell textAlign='right' style={{ color: '#E80D8A' }}><b>{ numberWithSpace(ar.eladasi_ar) } Ft</b></Table.Cell>
                                <Table.Cell textAlign='right'>{ numberWithSpace(calcBrutto(ar.eladasi_ar)) } Ft</Table.Cell>
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
            return <h4>Még nincs árjegyzék!</h4>
        }else{
            return this.renderList()
        }
    }

    render(){
        return (
            <div className="Site">
              <Container className="Site-content" style={{ width: '95%' }}>
                    <Container>
                        <PageHeaderUgyfel />
                        <p style={{ marginTop: '5em' }}></p>
                        <div style={{ paddingBottom: '3em' }}>
                            <Header as='h2' floated='left'>Árjegyzék</Header>
                            
                        </div>
                        <Input style={{ width: '100%', marginTop: '20px', marginBottom: '10px' }} loading={this.state.loading} icon='search' placeholder='Keresés...' value={this.state.query} onChange={this.handleInputChange}/>
                    </Container>
                    <Container style={{ width:'95%' }}>
                        { this.renderInit() }
                    </Container>
                </Container>
                <FooterUgyfel />
            </div>
        )
    }
}
export default UgyfelArjegyzek;