import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Register} />
        <Route exact path="/login" component={Login} />
      </Router>
    </div>
  );
};

export default App;
