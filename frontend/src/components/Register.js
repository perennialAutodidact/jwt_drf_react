  import React from "react";

  const Register = () => {
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
