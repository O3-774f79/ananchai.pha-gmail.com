import React from 'react';
import Layout from './components/leyout'
import Login from './pages/login'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import PrivateRoute from './components/privateroute'
// import './App.css';

function App() {
  return (
    <Router>
      <PrivateRoute exact path='/' component={Layout} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
