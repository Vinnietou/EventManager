import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import React from 'react';

import LoginPage from './components/PageLogin';
import EventsPage from './components/PageEvents';
import BookingsPage from './components/PageBookings';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/login" exact />
            <Route path="/login" component={LoginPage}/>
            <Route path="/events" component={EventsPage}/>
            <Route path="/bookings" component={BookingsPage}/>
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
