import React, { useState, useContext, useEffect } from "react";

import AuthContext from '../context/auth/authContext';

const Register = props => {
  // initialize auth context
  const authContext = useContext(AuthContext);

  // destructure context items

  // redirect if an authenticated user exists
  useEffect(() => {
    if(isAuthenticated){
      // redirect to the homepage
    }
  }, [isAuthenticated, props.history])

  // setup app-level state to hold form data
  const [user, setUser] = useState({
    username: '',
    email:'',
    password: '',
    password2: '',
  });



  return (
    <div className="container">
      <div className="row">
        <div className="col col-6 offset-3">
          <h1 className="text-center">Register</h1>
          <form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                id="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                id="password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password2">Password Confirm</label>
              <input
                className="form-control"
                type="password"
                name="password2"
                id="password2"
              />
            </div>

            <div className="btn btn-lg btn-primary">Register</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
