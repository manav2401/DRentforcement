// imports
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';

// local
import './App.css';
import Dashboard from './Dashboard/Dashboard';
import Auth from './Auth/Auth';
import Test from './Test/Test';
import Profile from './Profile/Profile';
import ProductAdd from './Product/ProductAdd';
import Order from './Dashboard/Order/Order';
import Checkout from './Dashboard/Checkout/Checkout';
import Error from './Error/Error';

class App extends Component {

  render() {
    return (

      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/auth" component={Auth} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/add" component={ProductAdd} />
            <Route exact path="/order" component={Order} />
            <Route exact path="/checkout" component={Checkout} />
            {/* <Route exact path="/test" component={Test} /> */}
            <Route exact path="/error" component={Error} />
            <Redirect to="/error" />
          </Switch>
        </Router>

      </div>
    )
  }

}

export default App;