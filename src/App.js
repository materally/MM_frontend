import React, { Component } from 'react';
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';

import UgyfelRoot from './Ugyfel/UgyfelRoot/UgyfelRoot'
import AdminRoot from './Admin/AdminRoot/AdminRoot'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/ugyfel" exact />
          <Route path="/ugyfel" component={UgyfelRoot} />
          <Route path="/admin" component={AdminRoot} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
