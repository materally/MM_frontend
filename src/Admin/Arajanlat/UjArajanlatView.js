import React, { Component } from 'react';
import { Container, Button, Table, Icon, Header, Confirm } from 'semantic-ui-react'
import nl2br from 'react-nl2br';
import { numberWithSpace, calcBrutto } from '../../Helpers/Helpers'
import API, { API_SECRET } from '../../api';

import PlaceholderComponent from '../../components/Placeholder/Placeholder';

import PageHeaderAdmin from '../components/Header'
import FooterUgyfel from '../../Ugyfel/components/Footer';
import '../../Ugyfel/components/Footer.css';

class UjArajanlatViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uj_arajanlat_id: this.props.match.params.uj_arajanlat_id,
            data: [],
            company_data: [],
            arjegyzek: [],
            deleteArajanlat: false
        }
        this.getData();
    }

    getData(){
        API.get(`arajanlat/ujArajanlatok/${this.state.uj_arajanlat_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ data: response, company_data: response.company, arjegyzek: response.arjegyzek });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    italic(string){
        return <React.Fragment><br /><span style={{ fontStyle: 'italic', fontSize: '11px' }}>{string}</span></React.Fragment>;
    }

    renderInfo(){
        const { arjegyzek } = this.state
        const sum_netto = arjegyzek.reduce((total, a) => total + a.netto_egysegar*a.mennyiseg, 0);
        const sum_afa   = calcBrutto(sum_netto)-sum_netto;
        return (
            <React.Fragment>
            <Table definition>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Azonosító</Table.Cell>
                        <Table.Cell><b>{this.state.data.azonosito}</b> <a href={this.state.data.pdf} target="_blank" rel="noopener noreferrer"><Icon name='file pdf' /></a></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Feladó</Table.Cell>
                        <Table.Cell>{this.state.data.felado_nev}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Címzett</Table.Cell>
                        <Table.Cell><b>{this.state.data.cimzett_nev}</b> - ({this.state.data.cimzett_telefonszam} - {(this.state.company_data) ? this.state.company_data.cegnev : ''})</Table.Cell>
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
                        <Table.Cell verticalAlign='top'>Tartalom</Table.Cell>
                        <Table.Cell>{nl2br(this.state.data.tartalom)}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            {
                arjegyzek.length !== 0 ? (
                    <div style={{ width: '100%' }}>
                        <Header sub style={{ color: '#E80D8A' }}>Árjegyzék</Header>
                        <Table striped celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign='center'>#</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Megnevezés</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Mennyiség</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Me. egys.</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Nettó egységár</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Nettó ár összesen</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                        {
                            arjegyzek && arjegyzek.map((a, id) => (
                                <Table.Row key={a.uj_arajanlat_arjegyzek_id} onClick={ () => null }>
                                    <Table.Cell textAlign='center'>{id+1}.</Table.Cell>
                                    <Table.Cell>{a.megnevezes} { (a.megjegyzes.length > 0) ? this.italic(a.megjegyzes) : '' }</Table.Cell>
                                    <Table.Cell textAlign='center'>{a.mennyiseg}</Table.Cell>
                                    <Table.Cell textAlign='center'>{a.mennyiseg_egysege}</Table.Cell>
                                    <Table.Cell textAlign='right'>{numberWithSpace(a.netto_egysegar)} Ft</Table.Cell>
                                    <Table.Cell textAlign='right'>{numberWithSpace(a.netto_egysegar*a.mennyiseg)} Ft</Table.Cell>
                                </Table.Row>
                                
                            ))
                        }
                            </Table.Body>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='5' textAlign='right'>Összesen bruttó: </Table.HeaderCell>
                                    <Table.HeaderCell positive textAlign='right'>{numberWithSpace(calcBrutto(sum_netto))} Ft</Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='5' textAlign='right' style={{ fontWeight:'bold' }}>Összesen nettó: </Table.HeaderCell>
                                    <Table.HeaderCell positive textAlign='right' style={{ color: '#E80D8A' }}><b>{numberWithSpace(sum_netto)} Ft</b></Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='5' textAlign='right'>Összesen ÁFA: </Table.HeaderCell>
                                    <Table.HeaderCell positive textAlign='right'>{numberWithSpace(sum_afa)} Ft</Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </div>
                ) : null
            }
            </React.Fragment>
        )
    }

    deleteArajanlat(){
        const { uj_arajanlat_id } = this.state;
        API.post('arajanlat/deleteUjArajanlat/'+uj_arajanlat_id, 'API_SECRET='+API_SECRET)
        .then(res => {
            this.props.history.push("/admin/uj_arajanlatok")
        })
        .catch(error => console.log("Error: "+error));
    }

    render(){
        return (
            <div className="Site">
              <Container className="Site-content">
                <PageHeaderAdmin />
                <p style={{ marginTop: '5em' }}></p>
                <Button basic labelPosition='left' icon='left chevron' content='Vissza' onClick={ () => this.props.history.push("/admin/uj_arajanlatok") }  style={{ marginBottom: '25px' }}/>

                <Button basic color='red' floated='right' labelPosition='right' icon='trash' content='Árajánlat törlése' onClick={ () => this.setState({ deleteArajanlat: true }) }  style={{ marginBottom: '25px' }}/>

                {(this.state.data.length !== 0) ? this.renderInfo() : <PlaceholderComponent /> }  
                
                <Confirm
                    content='Biztos vagy benne? A művelet nem vonható vissza!'
                    size='tiny'
                    cancelButton='Mégsem'
                    confirmButton='Mehet'
                    open={this.state.deleteArajanlat}
                    onCancel={ () => this.setState({ deleteArajanlat: false }) }
                    onConfirm={ () => this.deleteArajanlat() }
                />
                
            </Container>
            <FooterUgyfel />
            </div>
        )
    }
}
export default UjArajanlatViewPage;