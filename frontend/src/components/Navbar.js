import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info">
      <a className="navbar-brand" href="/">
        <h1>JWT Auth</h1>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto mr-4">
          <li className="nav-item">
            <a className="nav-link" href="register">
              <h4 className="m-0">Register</h4>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/login">
              <h4 className="m-0">Login</h4>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
