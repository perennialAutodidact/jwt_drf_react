import React from 'react'

const Register = () => {
  return (
    <div className="register">
      <form>
        <input className="form-input" type="text" name="username"/>
        <input className="form-input" type="password" name="password"/>
        <input className="form-input" type="password" name="password2"/>
        <input className="form-submit" type="submit" name="submit" value="Register"/>
      </form>
    </div>
  )
}

export default Register
