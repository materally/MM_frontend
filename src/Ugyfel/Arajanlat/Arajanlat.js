import React, { Component } from 'react';
import { Container, Button, Table, Grid, Header, Icon } from 'semantic-ui-react'
import nl2br from 'react-nl2br';
import { numberWithSpace, calcBrutto } from '../../Helpers/Helpers'
import API, { API_SECRET } from '../../api';

import PageHeaderUgyfel from '../components/Header';
import FooterUgyfel from '../components/Footer';
import '../components/Footer.css';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

class ArajanlatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arajanlat_id: this.props.match.params.arajanlat_id,
            data: [],
            arajanlatToUgyfel: []
        }
        this.getData();
    }

    getData(){
        const company_id = localStorage.getItem('company_id')
        API.get(`arajanlat/${company_id}/0/${this.state.arajanlat_id}`, {params: {'API_SECRET': API_SECRET} })
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

        API.get(`arajanlat/getArajanlatToUgyfelUgyfel/${this.state.arajanlat_id}/${company_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res2 => {
            var response2 = res2.data;
            if(response2){
                this.setState({ arajanlatToUgyfel: response2 });
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
                            <Table.Cell width={3}>Megnevezés</Table.Cell>
                            <Table.Cell>{this.state.data.megnevezes}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Dátum</Table.Cell>
                            <Table.Cell>{this.state.data.datum}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Gyártási határidő</Table.Cell>
                            <Table.Cell>{this.state.data.gyartasi_hatarido}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Felhasználó</Table.Cell>
                            <Table.Cell>{this.state.data.user_data.vezeteknev} {this.state.data.user_data.keresztnev}</Table.Cell>
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

    italic(string){
        return <React.Fragment><br /><span style={{ fontStyle: 'italic', fontSize: '11px' }}>{string}</span></React.Fragment>;
    }

    pageErkezettArajanlat(){
        if(this.state.arajanlatToUgyfel.length === 0) return <h4>Egyenlőre nem érkezett árajánlat</h4>

        const arajanlat = this.state.arajanlatToUgyfel
        const arjegyzek = this.state.arajanlatToUgyfel.arjegyzek
        const admin     = this.state.arajanlatToUgyfel.admin
        const sum_netto = arjegyzek.reduce((total, a) => total + a.netto_egysegar*a.mennyiseg, 0);
        const sum_afa   = calcBrutto(sum_netto)-sum_netto;

        return (
            <React.Fragment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width='2'><Header sub style={{ color: '#E80D8A' }}>Azonosító</Header><span><b>{arajanlat.azonosito}</b></span></Grid.Column>
                        <Grid.Column width='3'><Header sub style={{ color: '#E80D8A' }}>Tárgy</Header><span>{arajanlat.targy}</span></Grid.Column>
                        <Grid.Column width='3'><Header sub style={{ color: '#E80D8A' }}>Dátum</Header><span>{arajanlat.datum}</span></Grid.Column>
                        <Grid.Column width='3'><Header sub style={{ color: '#E80D8A' }}>Feladó</Header><span>{admin.vezeteknev} {admin.keresztnev}</span></Grid.Column>
                        <Grid.Column width='3'><Header sub style={{ color: '#E80D8A' }}>Elérhetőség</Header><span><Icon name='envelope' /><a href={"mailto:"+admin.email}>{admin.email}</a> <br /><Icon name='phone'/><a href={"tel:"+admin.telefonszam}>{admin.telefonszam}</a></span></Grid.Column>
                        <Grid.Column width='2' textAlign='right'><Header sub style={{ color: '#E80D8A' }}>PDF</Header><span><Icon name='file pdf' /><a target="_blank" rel="noopener noreferrer" href={arajanlat.pdf}>letöltés</a></span></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width='12'><Header sub style={{ color: '#E80D8A' }}>Tartalom</Header><span>{nl2br(arajanlat.tartalom)}</span></Grid.Column>
                    </Grid.Row>
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
                                            <Table.HeaderCell textAlign='center'>Nettó egységár</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='center'>Nettó ár összesen</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                {
                                    arjegyzek && arjegyzek.map((a, index) => (
                                        <Table.Row key={a.ato_arjegyzek_id} onClick={ () => null }>
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
                        ) : null
                    }
                </Grid>
            </React.Fragment>
        )
    }

    render(){
        return (
            <div className="Site">
            <Container className="Site-content">
                <PageHeaderUgyfel />
                <p style={{ marginTop: '5em' }}></p>
                <Button basic labelPosition='left' icon='left chevron' content='Vissza' onClick={ () => this.props.history.push("/ugyfel/arajanlataim") } />
                <div style={{ paddingTop: '10px' }}>
                    {this.pageArajanlat()}
                    { (this.state.arajanlatToUgyfel.length === 0) ? ( null ) : (
                        <React.Fragment>
                            <hr />
                            <h3>Érkezett árajánlat</h3>
                            {this.pageErkezettArajanlat()}
                        </React.Fragment> )
                    }
                </div>
            </Container>
            <FooterUgyfel />
            </div>
        )
    }
}
export default ArajanlatPage;