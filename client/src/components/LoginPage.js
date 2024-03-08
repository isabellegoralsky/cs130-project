import React, { useState } from 'react';
import './LoginReg.css'
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO
    console.log('Form Data:', formData);
  };

  return (
    <div class="login-div">
      <h1 class="bold-text log-reg-title">welcome back!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label class="login-label" htmlFor="email">Email</label>
          <input placeholder="username / email" class="login-input" type="email" name="email" value={formData.email} onChange={handleChange} />
          <div class="login-divider"></div>
        </div>
        <div class="inputs-not-first">
          <label class="login-label" htmlFor="password">Password</label>
          <input placeholder="password" class="login-input" type="password" name="password" value={formData.password} onChange={handleChange} />
          <div class="login-divider"></div>
        </div>
        <div class="button-div">
          <button type="submit" class="bold-text signin-button">sign in</button>
        </div>
        <div id="login-reg-link">New Here?&nbsp;<Link to="/register" id="sign-up-link">Sign Up</Link></div>
      </form>
    </div>
  );
};

export default LoginPage;
