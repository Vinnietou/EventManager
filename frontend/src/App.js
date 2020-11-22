import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import LoginPage from './components/Login';
import EventsPage from './components/Events';
import BookingsPage from './components/Bookings';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/login" exact />
        <Route path="/login" component={LoginPage}/>
        <Route path="/events" component={EventsPage}/>
        <Route path="/bookings" component={BookingsPage}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
