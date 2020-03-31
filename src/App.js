import React from 'react';
import Layout from './components/leyout'
import Login from './pages/login'
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom'
import DemoApp from './components/googlemap'
import PrivateRoute from './components/privateroute'
// import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path='/' component={Layout} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
