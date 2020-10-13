import React, { Fragment, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);

  const { logout } = authContext;

  const onLogout = () => {
    logout();
  };

  const {
    isAuthenticated,
    user,
    accessToken,
    requestAccessToken,
  } = authContext;

  const guestLinks = (
    <Fragment>
      <li className='nav-item'>
        <Link className='nav-link' to='/register'>
          <h4 className='m-0'>Register</h4>
        </Link>
      </li>
      <li className='nav-item'>
        <Link className='nav-link' to='/login'>
          <h4 className='m-0'>Login</h4>
        </Link>
      </li>
    </Fragment>
  );

  const authLinks = (
    <Fragment>
      <li className='nav-item'>
        <Link className='nav-link' to='/account'>
          <h4 className='m-0'>Account</h4>
        </Link>
      </li>
      <li className='nav-item'>
        <Link className='nav-link' onClick={onLogout}>
          <h4 className='m-0'>Logout</h4>
        </Link>
      </li>
    </Fragment>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-info'>
      <Link className='navbar-brand' to='/'>
        <h1>JWT Auth</h1>
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarNav'
        aria-controls='navbarNav'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav ml-auto mr-4'>
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
