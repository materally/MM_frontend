import React, { Component } from 'react';
import { Container, Table, Header, Button, Icon, Confirm, Input } from 'semantic-ui-react'
import API, { API_SECRET } from '../../api';
import { numberWithSpace } from '../../Helpers/Helpers'
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

import PageHeaderAdmin from '../components/Header'
import FooterUgyfel from '../../Ugyfel/components/Footer';
import '../../Ugyfel/components/Footer.css';
import NewArModal from './NewArModal';
import EditArModal from './EditArModal';

class Arjegyzek extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingPage: true,
            arData: [],
            openModalNewAr: false,
            openModalEditAr: false,
            editArId: 0,
            deleteArConfirmWindow: false,
            deleteArId: 0,
            hideBekerules: true,
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
        API.get(`arjegyzek`, {params: {'API_SECRET': API_SECRET} })
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

    closeModal = () => {
        this.setState({ openModalNewAr: false, openModalEditAr: false, deleteArConfirmWindow: false });
    }

    deleteAr(){
        const { deleteArId } = this.state;
        API.post('arjegyzek/delete/'+deleteArId, 'API_SECRET='+API_SECRET)
        .then(res => {
            this.closeModal()
            this.getData()
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
                    {
                        (this.state.hideBekerules) ? null : 
                        (   <React.Fragment>
                                <Table.HeaderCell textAlign='center'>Alapanyag nettó bekerülési ára</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center'>Nyomtatás nettó bekerülési ára</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center'>Egyéb költség</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center'>Bekerülési nettó ár</Table.HeaderCell>
                            </React.Fragment>
                        )
                    }
                    <Table.HeaderCell textAlign='center'>Megjegyzés</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Eladási nettó VIP ár</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Eladási NAGYKER nettó ár</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Eladási KISKER nettó ár</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>&nbsp;</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        this.state.filteredData.map((ar) => (
                            <Table.Row key={ar.ar_id} onClick={ () => null }>
                                <Table.Cell>{ ar.megnevezes }</Table.Cell>
                                <Table.Cell textAlign='center'>{ ar.mennyiseg_egysege }</Table.Cell>
                                <Table.Cell textAlign='center'>{ ar.mennyiseg }</Table.Cell>
                                {
                                    (this.state.hideBekerules) ? null : 
                                    (
                                        <React.Fragment>
                                            <Table.Cell textAlign='right'>{ numberWithSpace(ar.alapanyag_netto_bekereules_ar) + ' Ft' }</Table.Cell>
                                            <Table.Cell textAlign='right'>{ numberWithSpace(ar.nyomtatas_netto_bekerules_ar) + ' Ft' }</Table.Cell>
                                            <Table.Cell textAlign='right'>{ numberWithSpace(ar.egyeb_koltseg) + ' Ft' }</Table.Cell>
                                            <Table.Cell textAlign='right'>{ numberWithSpace(ar.bekerules_netto_ar) + ' Ft' } </Table.Cell>
                                        </React.Fragment>
                                    )
                                }
                                <Table.Cell textAlign='right'>{ ar.megjegyzes }</Table.Cell>
                                <Table.Cell textAlign='right'>{ numberWithSpace(ar.eladasi_netto_vip_ar) } Ft</Table.Cell>
                                <Table.Cell textAlign='right'>{ numberWithSpace(ar.eladasi_netto_nagyker_ar) } Ft</Table.Cell>
                                <Table.Cell textAlign='right'>{ numberWithSpace(ar.eladasi_netto_kisker_ar) } Ft</Table.Cell>
                                <Table.Cell textAlign='center'>
                                    <Icon link name='edit' color='blue' onClick={ () => this.setState({ editArId: ar.ar_id, openModalEditAr: true, arData: ar }) }/>
                                    <Icon link name='trash' color='red' onClick={ () => this.setState({ deleteArConfirmWindow: true, deleteArId: ar.ar_id }) }/>
                                </Table.Cell>
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
            return <h4>Még nincs ár felvéve!</h4>
        }else{
            return this.renderList()
        }
    }

    render(){
        return (
            <div className="Site">
              <Container className="Site-content" style={{ width: '95%' }}>
                <Container>
                    <PageHeaderAdmin />
                    <p style={{ marginTop: '5em' }}></p>
                    <div style={{ paddingBottom: '3em' }}>
                        <Header as='h2' floated='left'>Árjegyzék</Header>
                        <Button floated='left' compact icon='lock' color='orange' onClick={ () => this.setState({ hideBekerules: !this.state.hideBekerules})  } />
                        <Button floated='right' compact labelPosition='right' icon='plus square' content='Új ár létrehozása' color='green' onClick={ () => this.setState({ openModalNewAr: !this.state.openModalNewAr})  } />
                    </div>
                    <Input style={{ width: '100%', marginTop: '20px', marginBottom: '10px' }} loading={this.state.loading} icon='search' placeholder='Keresés...' value={this.state.query} onChange={this.handleInputChange}/>
                </Container>
                <Container style={{ width:'95%' }}>
                    { this.renderInit() }
                </Container>

                <NewArModal openModal={this.state.openModalNewAr} closeModal={this.closeModal} getData={() => this.getData()}/>

                <EditArModal openModal={this.state.openModalEditAr} closeModal={this.closeModal} getData={() => this.getData()} arData={this.state.arData} />

                <Confirm
                    content='Biztos vagy benne? A művelet nem vonható vissza!'
                    size='tiny'
                    cancelButton='Mégsem'
                    confirmButton='Mehet'
                    open={this.state.deleteArConfirmWindow}
                    onCancel={ () => this.setState({ deleteArConfirmWindow: false }) }
                    onConfirm={ () => this.deleteAr() }
                />

            </Container>
            <FooterUgyfel />
            </div>
        )
    }
}
export default Arjegyzek;