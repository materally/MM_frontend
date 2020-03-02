import React, { Component } from 'react';
import { Modal, Button, List } from 'semantic-ui-react'
import parse from 'html-react-parser';

class ArajanlatToAlvallalkozoModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen: this.props.openModal,
            data: this.props.data,
            alvallalkozo: this.props.data.alvallalkozo,
            admin: this.props.data.admin
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ modalOpen: nextProps.openModal, data: nextProps.data, alvallalkozo: nextProps.data.alvallalkozo, admin: nextProps.data.admin });  
    }

    closeModal = () => {
        this.props.closeModal();
    }

    renderData(){
        if(this.state.data && this.state.alvallalkozo && this.state.alvallalkozo){
            const { data, alvallalkozo, admin } = this.state 
            return (
            <Modal open={this.state.modalOpen} onClose={this.closeModal} size="small" dimmer="blurring">
                <Modal.Header>Árajánlat részletei</Modal.Header>
                <Modal.Content>
                    <List>
                        
                        <List.Item>
                            <List.Header>Alvállalkozó</List.Header>
                            {alvallalkozo.cegnev}
                        </List.Item>
                        <List.Item>
                            <List.Header>E-mail címre kiküldve</List.Header>
                            {data.email}
                        </List.Item>
                        <List.Item>
                            <List.Header>Tárgy</List.Header>
                            {data.targy}
                        </List.Item>
                        <List.Item>
                            <List.Header>Dátum</List.Header>
                            {data.datum}
                        </List.Item>
                        <List.Item>
                            <List.Header>Bekérte</List.Header>
                            {admin.vezeteknev} {admin.keresztnev}
                        </List.Item>
                        <List.Item>
                            <List.Header>Tartalom</List.Header>
                            <div style={{ whiteSpace: 'pre-line' }}>
                                {parse(data.tartalom)}
                            </div>
                        </List.Item>

                    </List>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='grey' onClick={this.closeModal}>Bezárás</Button>
                </Modal.Actions>
            </Modal>
            )
        }else{
            return null
        }
    }

    render(){
        return this.renderData() 
    }
}

 
export default ArajanlatToAlvallalkozoModal;