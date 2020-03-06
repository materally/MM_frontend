import React, { Component } from 'react';
import { Container, Image, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

class PageHeaderUgyfel extends Component {
    static contextType = AuthContext;
    
    logout(){
        this.context.logout()
    }

    render(){
        return (
            <Menu fixed='top'>
                <Container>
                    <Menu.Item as='a' header>
                        <Image size='small' src={process.env.PUBLIC_URL + '/menuheader.png'} style={{  }} />
                    </Menu.Item>

                    <Menu.Item as={Link} to="/ugyfel/uj_arajanlat">Árajánlatot kérek</Menu.Item>
                    <Menu.Item as={Link} to="/ugyfel/arajanlataim">Ajánlataim</Menu.Item>
                    <Menu.Item as={Link} to="/ugyfel/home">Árjegyzék</Menu.Item>
                    <Menu.Item as={Link} to="/ugyfel/beallitasok">Beállítások</Menu.Item>

                    <Menu.Item name='logout' as='a' onClick={() => this.logout()}>Kijelentkezés</Menu.Item>

                </Container>
            </Menu>
        )
    }
}

 
export default PageHeaderUgyfel;