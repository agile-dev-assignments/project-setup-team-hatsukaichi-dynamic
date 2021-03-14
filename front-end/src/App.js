import './App.css';
import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './Home.js'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/terms-of-service">
          </Route>
          <Route path="/meet-the-team">
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;