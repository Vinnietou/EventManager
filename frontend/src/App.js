import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import React, { Component } from 'react';

import LoginPage from './components/PageLogin';
import EventsPage from './components/PageEvents';
import BookingsPage from './components/PageBookings';
import MainNavigation from './components/Navigation/MainNavigation';
import LoginContext from './context/login-context';

class App extends Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId});
  };

  logout = () => {
    this.setState({token: null, userId: null});
  };

  render(){
  
    return (
      <BrowserRouter>
        <React.Fragment>
         <LoginContext.Provider 
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && <Redirect from="/login" to="/events" exact />}
                {!this.state.token && <Route path="/login" component={LoginPage}/>}
                <Route path="/events" component={EventsPage}/>
                {this.state.token && <Route path="/bookings" component={BookingsPage}/>}
                {!this.state.token && <Redirect to="/login" exact />}
              </Switch>
            </main>
          </LoginContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
