import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import API, { API_SECRET } from '../../api';

// PAGES
import AdminLogin from '../AdminLogin/AdminLogin'
import AdminHome from '../AdminHome/AdminHome'
import ClientsPage from '../Clients/ClientsPage'
import ClientPage from '../Clients/ClientPage'
import AlvallalkozokPage from '../Alvallalkozo/AlvallalkozokPage'
import AlvallalkozoPage from '../Alvallalkozo/AlvallalkozoPage'
import ArajanlatSablonokPage from '../ArajanlatSablonok/ArajanlatSablonokPage'
import ArajanlatPage from '../Arajanlat/Arajanlat'
import ArajanlatokPage from '../Arajanlat/Arajanlatok'
import UjArajanlatPage from '../Arajanlat/UjArajanlat'
import UjArajanlatViewPage from '../Arajanlat/UjArajanlatView'
import UjArajanlatokPage from '../Arajanlat/UjArajanlatok'
import Arjegyzek from '../Arjegyzek/Arjegyzek'
import ErrorPage from '../../ErrorPage/ErrorPage'


class AdminRoot extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user_id: localStorage.getItem('user_id'),
      token: localStorage.getItem('token')
    }
    this.checkIsAdmin();
  }

  checkIsAdmin(){
    const { user_id, token } = this.state;
    if(user_id && token){
        API.post(`admin/isAdmin/${user_id}/${token}`, 'API_SECRET='+API_SECRET)
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
    window.location.replace("/admin/login");
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
            {!this.state.token && <Redirect exact from="/" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin/home" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin/clients" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin/alvallalkozo" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin/arjegyzek" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin/arajanlatok" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin/arajanlat_sablonok" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin/uj_arajanlat" to="/admin/login" />}
            {!this.state.token && <Redirect exact from="/admin/uj_arajanlatok" to="/admin/login" />}
            {!this.state.token && (
              <Route path="/admin/login" component={AdminLogin} exact/>
            )}

            {/* BEJELENTKEZETT FELHASZNÁLÓ: */}
            {this.state.token && <Redirect exact from="/admin" to="/admin/home"/>}
            {this.state.token && <Redirect exact from="/admin/login" to="/admin/home"/>}
            {this.state.token && (
              <Route path="/admin/home" component={AdminHome} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/clients" component={ClientsPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/clients/:company_id" component={ClientPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/alvallalkozo" component={AlvallalkozokPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/alvallalkozo/:alvallalkozo_id" component={AlvallalkozoPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/arjegyzek" component={Arjegyzek} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/arajanlatok" component={ArajanlatokPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/arajanlatok/:arajanlat_id" component={ArajanlatPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/arajanlat_sablonok" component={ArajanlatSablonokPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/uj_arajanlat" component={UjArajanlatPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/uj_arajanlatok" component={UjArajanlatokPage} exact/>
            )}
            {this.state.token && (
              <Route path="/admin/uj_arajanlatok/:uj_arajanlat_id" component={UjArajanlatViewPage} exact/>
            )}
             
            <Route component={ErrorPage}/> 
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}
 
export default AdminRoot;