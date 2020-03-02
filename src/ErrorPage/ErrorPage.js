import React, { Component } from 'react';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

class ErrorPage extends Component {

    goBack(){
        this.props.history.goBack();
    }

  render() { 
    return ( 
    <React.Fragment>
        <Segment placeholder color='red' style={{ width:'90%', margin: '50px auto', }}>
            <Header icon>
            <Icon name='delete' />
            Sajnáljuk, de a keresett oldal nem található!
            </Header>
            <Segment.Inline>
            <Button primary onClick={ () => this.goBack() }>Vissza az előző oldalra</Button>
            </Segment.Inline>
        </Segment>
    </React.Fragment> );
  }
}
 
export default ErrorPage;