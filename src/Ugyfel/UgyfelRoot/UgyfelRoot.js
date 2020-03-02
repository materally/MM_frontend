import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import API, { API_SECRET } from '../../api';

// PAGES
import UgyfelLogin from '../UgyfelLogin/UgyfelLogin'
import UjArajanlat from '../Arajanlat/UjArajanlat'
import ErrorPage from '../../ErrorPage/ErrorPage'
import ArajanlataimPage from '../Arajanlat/Arajanlataim';
import ArajanlatPage from '../Arajanlat/Arajanlat';
import BeallitasokPage from '../Beallitasok/BeallitasokPage';
import LostPasswordPage from '../LostPassword/LostPasswordPage';

class UgyfelRoot extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user_id: localStorage.getItem('user_id'),
      token: localStorage.getItem('token')
    }
    this.checkIsUgyfel();
  }

  checkIsUgyfel(){
    const { user_id, token } = this.state;
    if(user_id && token){
        API.post(`ugyfel/isUgyfel/${user_id}/${token}`, 'API_SECRET='+API_SECRET)
        .then(res => {
            var response = res.data;
            if(response.error){
                this.logout()
                return;
            }
        })
        .catch(error => console.log("Error: "+error));
    }
  }

  login = (user_id, token) => {
    this.setState({ user_id: user_id, token: token });
  }

  logout = () => {
    this.setState({ user_id: null, token: null });
    localStorage.clear();
    window.location.replace("/ugyfel/login");
  }

  render() {

    const ScrollToTop = () => {
      window.scrollTo(0, 0);
      return null;
    };

    return ( 
      <BrowserRouter>
        <AuthContext.Provider value={{ user_id: this.state.user_id, token: this.state.token, login: this.login, logout: this.logout }}>
          <Route component={ScrollToTop} />
          <Switch>
            {/* NINCS BEJELENTKEZVE: */}
            {!this.state.token && <Redirect exact from="/" to="/ugyfel/login" />}
            {!this.state.token && <Redirect exact from="/ugyfel" to="/ugyfel/login" />}
            {!this.state.token && <Redirect exact from="/ugyfel/uj_arajanlat" to="/ugyfel/login" />}
            {!this.state.token && <Redirect exact from="/ugyfel/arajanlataim" to="/ugyfel/login" />}
            {!this.state.token && <Redirect exact from="/ugyfel/beallitasok" to="/ugyfel/login" />}
            {!this.state.token && (
              <Route path="/ugyfel/login" component={UgyfelLogin} exact/>
            )}
            {!this.state.token && (
              <Route path="/ugyfel/lostpw" component={LostPasswordPage} exact/>
            )}

            {/* BEJELENTKEZETT FELHASZNÁLÓ: */}
            {this.state.token && <Redirect exact from="/ugyfel" to="/ugyfel/arajanlataim"/>}
            {this.state.token && <Redirect exact from="/ugyfel/login" to="/ugyfel/arajanlataim"/>}
            {this.state.token && <Redirect exact from="/ugyfel/lostpw" to="/ugyfel/arajanlataim"/>}
            {this.state.token && (
              <Route path="/ugyfel/uj_arajanlat" component={UjArajanlat} exact/>
            )}
            {this.state.token && (
              <Route path="/ugyfel/arajanlataim" component={ArajanlataimPage} exact/>
            )}
            {this.state.token && (
              <Route path="/ugyfel/arajanlataim/:arajanlat_id" component={ArajanlatPage} exact/>
            )}
            {this.state.token && (
              <Route path="/ugyfel/beallitasok/" component={BeallitasokPage} exact/>
            )}

            <Route component={ErrorPage}/> 
            
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}
 
export default UgyfelRoot;