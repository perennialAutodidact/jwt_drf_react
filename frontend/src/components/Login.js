import React, { useContext, useState, useEffect } from 'react';

import AuthContext from '../context/auth/authContext';
import AlertContext from '../context/alerts/alertContext';

const Login = props => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { login, isAuthenticated } = authContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    // redirect if an authenticated user exists
    if (isAuthenticated) {
      // redirect to the homepage
      props.history.push('/');
    }
  }, [isAuthenticated, props.history]);

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault(); // ignore default form submit action

    if (username === '' || password === '') {
      setAlert('Please fill in all fields.', 'danger');
    } else {
      login({ username, password });
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2'>
          <h1 className='text-center'>Login</h1>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input
                className='form-control'
                type='text'
                name='username'
                id='username'
                onChange={onChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                className='form-control'
                type='password'
                name='password'
                id='password'
                onChange={onChange}
              />
            </div>

            <input
              className='btn btn-lg btn-primary'
              type='submit'
              value='Login'
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
