import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import Home from './views/home/Home.view';

import {
  Nav,
  Navbar,
  MenuItem,
  NavItem
} from 'react-bootstrap' ;

class App extends Component {
  render() {
    return (
      <div style={{maxWidth: '100vw', overflowX: 'hidden', minHeight: '100vh', padding: 0, backgroundColor: '#F0F2F1'}}>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand style={{fontWeight: 'bold', color: '#212121'}}>
                Impressions
              </Navbar.Brand>
            </Navbar.Header>

            <Nav pullRight>
              <NavItem eventKey={1} href={"/"}>
                Lancer une impression
              </NavItem>
              <NavItem eventKey={2} href={"/printings"}>
                Mes impressions
              </NavItem>
            </Nav>
          </Navbar>

          <Router>
            <Switch>
              <Route exact path="/" component={Home}></Route>
            </Switch>
          </Router>
      </div>
    );
  }
}

export default App;
