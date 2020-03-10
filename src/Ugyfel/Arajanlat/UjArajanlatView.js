import React, { Component } from 'react';
import { Container, Button, Table, Header } from 'semantic-ui-react'
import nl2br from 'react-nl2br';
import { numberWithSpace, calcBrutto } from '../../Helpers/Helpers'
import API, { API_SECRET } from '../../api';

import PageHeaderUgyfel from '../components/Header';
import FooterUgyfel from '../components/Footer';
import '../components/Footer.css';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

class UjArajanlatView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uj_arajanlat_id: this.props.match.params.uj_arajanlat_id,
            data: []
        }
        this.getData();
    }

    getData(){
        const company_id = localStorage.getItem('company_id')
        API.get(`arajanlat/getUjArajanlatok/${company_id}/${this.state.uj_arajanlat_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response === null){
                this.props.history.push("/ugyfel/arajanlataim")
            }
            if(response){
                this.setState({ data: response });
            }
        })
        .catch(error => console.log("Error: "+error));
        
    }

    pageArajanlat(){
        return (
            (this.state.data.length === 0) ? (
                <PlaceholderComponent />
            ) : (
                <Table definition>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell width={3}>Azonosító</Table.Cell>
                            <Table.Cell><b>{this.state.data.azonosito}</b></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell width={3}>PDF</Table.Cell>
                            <Table.Cell><a href={this.state.data.pdf} target="_blank" rel="noopener noreferrer">megtekintés</a></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell width={3}>Megnevezés</Table.Cell>
                            <Table.Cell>{this.state.data.megnevezes}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Dátum</Table.Cell>
                            <Table.Cell>{this.state.data.datum}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Feladó</Table.Cell>
                            <Table.Cell>{this.state.data.felado_nev} {this.state.data.email}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell verticalAlign='top'>Tartalom</Table.Cell>
                            <Table.Cell>{nl2br(this.state.data.tartalom)}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            )
        )
    }

    viewArjegyzek(){
        const arjegyzek = this.state.data.arjegyzek
        const sum_netto = (this.state.data.arjegyzek) ? arjegyzek.reduce((total, a) => total + a.netto_egysegar*a.mennyiseg, 0) : 0;
        const sum_afa   = calcBrutto(sum_netto)-sum_netto;

        if(this.state.data.arjegyzek && arjegyzek.length !== 0){
        return (
            <React.Fragment>    
                {
                    <div style={{ width: '100%' }}>
                        <Header sub style={{ color: '#E80D8A' }}>Árjegyzék</Header>
                        <Table striped celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign='center'>#</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Megnevezés</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Mennyiség</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Nettó egységár</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Nettó ár összesen</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                        {
                            arjegyzek && arjegyzek.map((a, index) => (
                                <Table.Row key={a.uj_arajanlat_arjegyzek_id} onClick={ () => null }>
                                    <Table.Cell textAlign='center'>{index+1}.</Table.Cell>
                                    <Table.Cell>{a.megnevezes} { (a.megjegyzes.length > 0) ? this.italic(a.megjegyzes) : '' }</Table.Cell>
                                    <Table.Cell textAlign='center'>{a.mennyiseg}</Table.Cell>
                                    <Table.Cell textAlign='right'>{numberWithSpace(a.netto_egysegar)} Ft</Table.Cell>
                                    <Table.Cell textAlign='right'>{numberWithSpace(a.netto_egysegar*a.mennyiseg)} Ft</Table.Cell>
                                </Table.Row>
                                
                            ))
                        }
                            </Table.Body>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='4' textAlign='right'>Összesen bruttó: </Table.HeaderCell>
                                    <Table.HeaderCell positive textAlign='right'>{numberWithSpace(calcBrutto(sum_netto))} Ft</Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='4' textAlign='right' style={{ fontWeight:'bold' }}>Összesen nettó: </Table.HeaderCell>
                                    <Table.HeaderCell positive textAlign='right' style={{ color: '#E80D8A' }}><b>{numberWithSpace(sum_netto)} Ft</b></Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='4' textAlign='right'>Összesen ÁFA: </Table.HeaderCell>
                                    <Table.HeaderCell positive textAlign='right'>{numberWithSpace(sum_afa)} Ft</Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </div>
                
                }
            </React.Fragment>
        )
            }
    }

    italic(string){
        return <React.Fragment><br /><span style={{ fontStyle: 'italic', fontSize: '11px' }}>{string}</span></React.Fragment>;
    }

    render(){
        return (
            <div className="Site">
            <Container className="Site-content">
                <PageHeaderUgyfel />
                <p style={{ marginTop: '5em' }}></p>
                <Button basic labelPosition='left' icon='left chevron' content='Vissza' onClick={ () => this.props.history.push("/ugyfel/uj_arajanlataim") } />
                <div style={{ paddingTop: '10px' }}>
                    { this.pageArajanlat() }
                    { this.viewArjegyzek() }
                </div>
            </Container>
            <FooterUgyfel />
            </div>
        )
    }
}
export default UjArajanlatView;