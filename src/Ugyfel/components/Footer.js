import React, { Component } from 'react';
import { Container, Segment } from 'semantic-ui-react'

class FooterUgyfel extends Component {
    render(){
        return (
            <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
                <Container textAlign='center'>
                    <p>
                        Ügyviteli rendszerünket cégünk az <b>MM Nyomdaipari Kft.</b> üzemelteti és a <a  href="https://creativesales.hu/" target="_blank" rel="noopener noreferrer">Creative Sales Consulting</a> készítette.
                        <br />
                        Utolsó frissítés: 2020. 03. 13.
                    </p>
                </Container>
            </Segment>
        )
    }
} 
export default FooterUgyfel;