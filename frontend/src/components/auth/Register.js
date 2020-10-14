import React, { useState, useContext, useEffect } from 'react';

import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alerts/alertContext';
const Register = props => {
  // initialize auth context
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  // destructure context items
  const { register, isAuthenticated } = authContext;
  const { setAlert } = alertContext;

  // run effect when isAuthenticated or props.history change
  useEffect(() => {
    // redirect if an authenticated user exists
    if (isAuthenticated) {
      // redirect to the homepage
      props.history.push('/');
    }
  }, [isAuthenticated, props.history]);

  // setup component-level state to hold form data
  const [userForm, setUser] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const { username, email, password, password2 } = userForm;

  // add new form changes to state
  const onChange = e =>
    setUser({ ...userForm, [e.target.name]: e.target.value });

  // call when form is submitted
  const onSubmit = e => {
    e.preventDefault(); // ignore default form submit action

    // if username, email or password are blank
    // or password doesn't match password 2, raise an alert
    if (username === '' || email === '' || password === '') {
      setAlert('Please enter all fields', 'danger');
    } else if (password !== password2) {
      setAlert("Passwords don't match", 'danger');
    } else {
      // if all info is valid, pass the form data to register() from AuthState
      register({
        username,
        email,
        password,
        password2,
      });
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2'>
          <h1 className='text-center'>Register</h1>
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
              <label htmlFor='username'>Email</label>
              <input
                className='form-control'
                type='text'
                name='email'
                id='email'
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
            <div className='form-group'>
              <label htmlFor='password2'>Password Confirm</label>
              <input
                className='form-control'
                type='password'
                name='password2'
                id='password2'
                onChange={onChange}
              />
            </div>

            <input
              className='btn btn-lg btn-primary'
              type='submit'
              value='Register'
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
