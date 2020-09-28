import React from "react";

const Login = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col col-6 offset-3">
          <h1 className="text-center">Login</h1>
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
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                id="password"
              />
            </div>
            
            <div className="btn btn-lg btn-primary">Login</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
