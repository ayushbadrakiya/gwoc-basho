import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Direct POST request with email & password
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if(res.data.success) {
        alert("Logged in Successfully!");
        
        // Save Token & User Info
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Redirect to Home/Dashboard
        navigate('/');
        window.location.reload(); 
      }
    } catch (err) {
        // Handle Errors (Wrong password, User not found, etc.)
        alert("Login Failed: " + (err.response?.data?.msg || "Server Error"));
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Login</h2>
        
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Email Address</label>
                <input 
                    type="email" 
                    placeholder="Enter email" 
                    required
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <div>
                <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Password</label>
                <input 
                    type="password" 
                    placeholder="Enter password" 
                    required
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <button type="submit" style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                Login
            </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
            New here? <Link to="/Signup" style={{color: '#007bff'}}>Create an Account</Link>
        </p>
    </div>
  );
};

export default Login;