import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginReg.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verifypassword: '',
    firstname: '',
    lastname: ''
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
      <h1 class="bold-text log-reg-title">Register Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label class="login-label" htmlFor="firstname">First Name:</label>
          <input placeholder="first name" class="login-input" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} />
          <div class="reg-divider"></div>
        </div>
        <div class="inputs-not-first-reg">
          <label class="login-label" htmlFor="lastname">Last Name:</label>
          <input placeholder="last name" class="login-input" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} />
          <div class="reg-divider"></div>
        </div>
        <div class="inputs-not-first-reg">
          <label class="login-label" htmlFor="email">Email:</label>
          <input placeholder="email address" class="login-input" id="email" type="email" name="email" value={formData.email} onChange={handleChange} />
          <div class="reg-divider"></div>
        </div>
        <div class="inputs-not-first-reg">
          <label class="login-label" htmlFor="password">Password:</label>
          <input placeholder="create password" class="login-input" id="password" type="password" name="password" value={formData.password} onChange={handleChange} />
          <div class="reg-divider"></div>
        </div>
        <div class="inputs-not-first-reg">
          <label class="login-label" htmlFor="verifypassword">Verify Password:</label>
          <input placeholder="verify password" class="login-input" id="verifypassword" type="password" name="verifypassword" value={formData.verifypassword} onChange={handleChange} />
          <div class="reg-divider"></div>
        </div>
        <div class="button-div">
          <button class="bold-text signin-button" type="submit">sign up</button>
        </div>
        <div id="login-reg-link">Have an account already?&nbsp;<Link to="/" id="sign-up-link">Sign In</Link></div>

      </form>
    </div>
  );
};

export default RegisterPage;
