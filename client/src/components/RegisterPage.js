import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginReg.css';

const RegisterPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const registerUrl = 'http://localhost:3001/user/register';
    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstname,
          lastName: formData.lastname,
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        navigate('/profile');
      } else {
        throw new Error(data || 'Failed to register');
      }
    } catch (error) {
      console.error('Register Error:', error);
    }
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
