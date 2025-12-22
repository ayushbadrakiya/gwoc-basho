import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  // Added 'step' to track if we are entering details (1) or OTP (2)
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState(''); // Store the OTP input
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1: Send Details & Request OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // If backend says OTP sent, switch to Step 2
      if (res.data.step === 'OTP_SENT') {
        setStep(2); 
        alert("OTP sent to your email! Please check inbox.");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  // STEP 2: Verify OTP & Finalize Registration
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/auth/verify-register', { 
            email: formData.email, 
            otp: otp 
        });
        
        if (res.data.success) {
            alert("Account Verified Successfully! Please Login.");
            navigate('/login');
        }
    } catch (err) {
        alert(err.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>
          {step === 1 ? 'Create Account' : 'Verify Email'}
      </h2>

      {/* --- STEP 1: USER DETAILS FORM --- */}
      {step === 1 && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" name="name" placeholder="Full Name" 
              value={formData.name} onChange={handleChange} required 
              style={{ padding: '10px' }}
            />
            
            <input 
              type="email" name="email" placeholder="Email Address" 
              value={formData.email} onChange={handleChange} required 
              style={{ padding: '10px' }}
            />
            
            <input 
              type="password" name="password" placeholder="Password" 
              value={formData.password} onChange={handleChange} required 
              style={{ padding: '10px' }}
            />
            
            <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
              Next (Send OTP)
            </button>
          </form>
      )}

      {/* --- STEP 2: OTP VERIFICATION FORM --- */}
      {step === 2 && (
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <p style={{textAlign:'center', fontSize:'0.9rem', margin:0}}>
                Enter the code sent to <b>{formData.email}</b>
             </p>

             <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                style={{ padding: '10px', textAlign:'center', letterSpacing:'2px' }}
             />

             <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                Verify & Sign Up
             </button>
             
             {/* Option to go back if email was wrong */}
             <button type="button" onClick={() => setStep(1)} style={{background:'none', border:'none', color:'#007bff', cursor:'pointer', textDecoration:'underline'}}>
                Wrong Email? Go Back
             </button>
          </form>
      )}

      {step === 1 && (
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Already have an account? <Link to="/login">Login here</Link>
        </p>
      )}
    </div>
  );
};

export default Signup;