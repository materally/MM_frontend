import React, { Component } from 'react';
import { Container, Table, Header, Button, Icon, Confirm } from 'semantic-ui-react'
import PageHeaderAdmin from '../components/Header'
import FooterUgyfel from '../../Ugyfel/components/Footer';
import '../../Ugyfel/components/Footer.css';
import NewSablonModal from './NewSablonModal'
import EditSablonModal from './EditSablonModal'
import API, { API_SECRET } from '../../api';
import PlaceholderComponent from '../../components/Placeholder/Placeholder';

class ArajanlatSablonokPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        openModalNewSablon: false,
        openModalEditSablon: false,
        deleteSablonConfirmWindow: false,
        deleteSablonId: 0,
        data: [],
        loadingPage: true,
        sablonData: []
    }
    this.getData()
  }

    closeModal = () => {
        this.setState({ openModalNewSablon: false, openModalEditSablon: false, deleteSablonConfirmWindow: false });
    }

    getData(){
        API.get(`arajanlat/sablon`, {params: {'API_SECRET': API_SECRET} })
        .then(res => {
            var response = res.data;
            if(response){
                this.setState({ data: response, loadingPage: false });
            }
        })
        .catch(error => console.log("Error: "+error));
    }

    deleteSablon(){
        const { deleteSablonId } = this.state;
        API.post('arajanlat/deleteSablon/'+deleteSablonId, 'API_SECRET='+API_SECRET)
        .then(res => {
            this.closeModal()
            this.getData()
        })
        .catch(error => console.log("Error: "+error));
    }

    renderList(){
        return (
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign='center' width='1'>#</Table.HeaderCell>
                        <Table.HeaderCell textAlign='left'>Megnevezés</Table.HeaderCell>
                        <Table.HeaderCell textAlign='left'>Sablon</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center' width='1'>&nbsp;</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        this.state.data.map((s) => (
                            <Table.Row key={s.sablon_id} onClick={ () => null }>
                                <Table.Cell textAlign='center'>{ s.sablon_id }</Table.Cell>
                                <Table.Cell textAlign='left'>{ s.megnevezes }</Table.Cell>
                                <Table.Cell textAlign='left'>{ s.sablon.substring(0, 80) }...</Table.Cell>
                                <Table.Cell textAlign='center'>
                                    <Icon link name='edit' color='blue' onClick={ () => this.setState({ openModalEditSablon: true, sablonData: s }) }/>
                                    <Icon link name='trash' color='red' onClick={ () => this.setState({ deleteSablonConfirmWindow: true, deleteSablonId: s.sablon_id }) }/>
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
            return <h4>Még nincs sablon létrehozva!</h4>
        }else{
            return this.renderList()
        }
    }

  render(){
    return (
        <div className="Site">
          <Container className="Site-content">
            <Container>
                <PageHeaderAdmin />
                <p style={{ marginTop: '5em' }}></p>
                <div style={{ paddingBottom: '3em' }}>
                    <Header as='h2' floated='left'>Árajánlat sablonok</Header>
                    <Button floated='right' compact labelPosition='right' icon='plus square' content='Új sablon létrehozása' color='green' onClick={ () => this.setState({ openModalNewSablon: !this.state.openModalNewSablon})  } />
                </div>
            </Container>


            <Container>
            { this.renderInit() }
            </Container>

            <NewSablonModal openModal={this.state.openModalNewSablon} closeModal={this.closeModal} getData={() => this.getData()}/>

            <EditSablonModal openModal={this.state.openModalEditSablon} closeModal={this.closeModal} getData={() => this.getData()} sablonData={this.state.sablonData} />

            <Confirm
                content='Biztos vagy benne? A művelet nem vonható vissza!'
                size='tiny'
                cancelButton='Mégsem'
                confirmButton='Mehet'
                open={this.state.deleteSablonConfirmWindow}
                onCancel={ () => this.setState({ deleteSablonConfirmWindow: false }) }
                onConfirm={ () => this.deleteSablon() }
            />

        </Container>
        <FooterUgyfel />
        </div>
    );
  }
}

export default ArajanlatSablonokPage;
