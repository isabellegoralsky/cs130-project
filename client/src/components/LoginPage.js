import React, { useState } from 'react';
import './LoginReg.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Define the API endpoint
    const loginUrl = 'http://CodeDe-Appli-FvDYBBpWqa6p-642374602.us-east-1.elb.amazonaws.com:8080/user/login'; 
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include', 
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login Success:', data);
        navigate('/profile');
        // Handle successful login here (e.g., redirecting to another page)
      } else {
        throw new Error(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Login Error:', error);
      // Handle login error here (e.g., showing an error message)
    }
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
