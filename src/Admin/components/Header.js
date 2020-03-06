import React, { Component } from 'react';
import { Container, Image, Menu, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

class PageHeaderAdmin extends Component {
    static contextType = AuthContext;
    
    logout(){
        this.context.logout()
    }

    render(){
        const name = localStorage.getItem('name')
        return (
            <Menu fixed='top'>
                <Container>
                    <Menu.Item as='a' header>
                        <Image size='small' src={process.env.PUBLIC_URL + '/menuheader.png'} style={{  }} />
                    </Menu.Item>

                    <Menu.Item as={Link} to="/admin/home">Kezdőlap</Menu.Item>

                    <Menu.Item as={Link} to="/admin/clients">Ügyféltörzs</Menu.Item>
                    <Menu.Item as={Link} to="/admin/alvallalkozo">Alvállalkozók</Menu.Item>
                    <Menu.Item as={Link} to="/admin/arjegyzek">Árjegyzék</Menu.Item>

                    <Dropdown text='Árajánlat' pointing className='link item'>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/admin/uj_arajanlat">Új árajánlat</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/admin/uj_arajanlatok">Kiajánlások</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/admin/arajanlatok">Árajánlatkérések</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/admin/arajanlat_sablonok">Árajánlat sablonok</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* <Dropdown text='Beállítások' pointing className='link item'>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/admin/arajanlat_sablonok">Árajánlat sablonok</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}

                    <Menu.Item name='logout' as='a' onClick={() => this.logout()}>Kijelentkezés&nbsp;&nbsp; <b>{name}</b></Menu.Item>

                </Container>
            </Menu>
        )
    }
}

 
export default PageHeaderAdmin;