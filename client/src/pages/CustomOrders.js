import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomOrders = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    description: '', material: '',
    address: '', city: '', zip: '', phone: ''
  });
  
  // New State for Images
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  // Handle File Selection
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // 1. Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
        await axios.post('http://localhost:5000/api/auth/req-otp', { email: user.email });
        setOtpSent(true);
        alert(`OTP sent to ${user.email}`);
    } catch (err) { alert("Failed to send OTP"); }
  };

  // 2. Submit with Images (Using FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData object to handle files
      const data = new FormData();
      
      // Append Fields
      data.append('email', user.email);
      data.append('otp', otp);
      data.append('customerName', user.name);
      data.append('orderType', 'CUSTOM');
      data.append('amount', 0); // Price TBD
      
      // Append Custom Details
      data.append('description', formData.description);
      data.append('material', formData.material);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('zip', formData.zip);
      data.append('phone', formData.phone);

      // Append Images (Loop through FileList)
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append('customImages', selectedFiles[i]);
      }

      // Send Multipart Request
      const res = await axios.post('http://localhost:5000/api/buy', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert("Custom Request Sent Successfully!");
        navigate('/my-orders');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Submission Failed");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Request Custom Item</h2>
      
      <form onSubmit={otpSent ? handleSubmit : handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* DETAILS */}
        <label>1. Item Details</label>
        <textarea name="description" placeholder="Description..." value={formData.description} onChange={handleChange} required disabled={otpSent} style={{padding:'10px', height:'80px'}} />
        <input name="material" placeholder="Material" value={formData.material} onChange={handleChange} required disabled={otpSent} style={{padding:'10px'}} />
        
        {/* NEW: IMAGE UPLOAD INPUT */}
        <label>Upload Reference Images (Max 5):</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={otpSent} />

        {/* ADDRESS */}
        <label>2. Shipping Info</label>
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required disabled={otpSent} style={{padding:'10px'}} />
        <div style={{display:'flex', gap:'10px'}}>
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required disabled={otpSent} style={{flex:1, padding:'10px'}} />
            <input name="zip" placeholder="Zip" value={formData.zip} onChange={handleChange} required disabled={otpSent} style={{flex:1, padding:'10px'}} />
        </div>
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required disabled={otpSent} style={{padding:'10px'}} />

        {/* OTP SECTION */}
        {otpSent && (
            <div style={{ background: '#e9ffe9', padding: '15px', border: '1px solid green' }}>
                <p>Enter OTP sent to {user.email}</p>
                <input placeholder="OTP" value={otp} onChange={e=>setOtp(e.target.value)} required style={{width:'100%', padding:'10px', textAlign:'center'}} />
            </div>
        )}

        <button type="submit" style={{ padding: '12px', background: otpSent ? 'green' : 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
            {otpSent ? "Confirm Custom Order" : "Verify & Next"}
        </button>
      </form>
    </div>
  );
};

export default CustomOrders;