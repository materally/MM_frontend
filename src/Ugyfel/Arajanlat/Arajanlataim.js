import React, { Component } from 'react';
import { Container, Table, Header, Icon } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';

import PageHeaderUgyfel from '../components/Header';
import FooterUgyfel from '../components/Footer';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';
import '../components/Footer.css';

class ArajanlataimPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingPage: true,
        }
        this._isMounted = false;
        this.getData();
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted){
            this.timer = setInterval(
                () => this.getData(),
                500,
            );
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this._isMounted = false
    }

    async getData(){
        const company_id = localStorage.getItem('company_id')
        API.get(`arajanlat/${company_id}`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this._isMounted && this.setState({ data: response, loadingPage: false });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    selectArajanlat = (arajanlat_id) => {
        this.props.history.push("/ugyfel/arajanlataim/"+arajanlat_id);
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
                        <Table.HeaderCell>Ekkor kértük</Table.HeaderCell>
                        <Table.HeaderCell>Gyártási határdidő</Table.HeaderCell>
                        <Table.HeaderCell>Felhasználó</Table.HeaderCell>
                        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                <Table.Body>
                    {
                        this.state.data.map((a) => (
                            <Table.Row key={a.arajanlat_id} onClick={ () => this.selectArajanlat(a.arajanlat_id) } className="stripedTableTr" positive={ (a.to_ugyfel && a.to_ugyfel.pdf != null) ? true : false }>
                                <Table.Cell>{(a.to_ugyfel && a.to_ugyfel.azonosito !== '') ? <b>{a.to_ugyfel.azonosito}</b> : '-'}</Table.Cell>
                                <Table.Cell>{a.megnevezes}</Table.Cell>
                                <Table.Cell>{a.datum}</Table.Cell>
                                <Table.Cell>{a.gyartasi_hatarido}</Table.Cell>
                                <Table.Cell>{a.user_data.vezeteknev} {a.user_data.keresztnev}</Table.Cell>
                                <Table.Cell>{
                                (a.to_ugyfel && a.to_ugyfel.pdf !== null) ? <Icon name='file pdf' /> : ''
                                }</Table.Cell>
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
                    <Header as='h2' floated='left'>Árajánlataim</Header>
                </div>
                    { this.renderInit() }
            </Container>
            <FooterUgyfel />
            </div>
        )
    }
}
export default ArajanlataimPage;