import React, { useState, useContext, useEffect } from 'react';

import AuthContext from '../context/auth/authContext';

const Register = props => {
  // initialize auth context
  const authContext = useContext(AuthContext);

  // destructure context items
  const { register, user, isAuthenticated, errors } = authContext;

  // run effect when error, isAuthenticated or props.history change
  useEffect(() => {
    // redirect if an authenticated user exists
    if (isAuthenticated) {
      // redirect to the homepage
    }

    if (errors) {
      const errorMsg = errors.map(msg => msg[0]).join('\n\n');

      // this could be set up to diplay as
      // as a styled alert too.
      alert(errorMsg);
    }
  }, [errors, isAuthenticated, props.history]);

  // setup app-level state to hold form data
  const [userForm, setUser] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const { username, email, password, password2 } = userForm;

  const onChange = e =>
    setUser({ ...userForm, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault(); // ignore default form submit action

    if (username === '' || email === '' || password === '') {
      alert('Please enter all fields');
    } else if (password !== password2) {
      alert("Passwords don't match");
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
        <div className='col col-6 offset-3'>
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
