import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  
  // --- NEW: State for the Address Modal ---
  const [showModal, setShowModal] = useState(false);
  const [addressForm, setAddressForm] = useState({ 
      address: '', city: '', zip: '', phone: '' 
  });
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(res.data);
            if (res.data.images && res.data.images.length > 0) {
                setMainImage(res.data.images[0]);
            }
        } catch (err) { console.error(err); }
    };
    fetchProduct();
  }, [id]);

  // 1. Open the Modal
  const initiateBuy = () => {
    if (!user) {
        alert("Please login to buy");
        navigate('/login');
        return;
    }
    setShowModal(true); // <--- Shows the form
  };
  const [otp, setOtp] = useState('');
const [otpSent, setOtpSent] = useState(false);

// 1. Request OTP Function
const requestOtp = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:5000/api/auth/req-otp', { email: user.email });
        setOtpSent(true);
        alert("OTP sent to email for confirmation!");
    } catch (err) { alert("Failed to send OTP"); }
};
  // 2. Submit Order with Address
  const confirmOrder = async (e) => {
    e.preventDefault();
    if (!product) return;
    if (!otp) return alert("Please enter OTP");

    try {
        const payload = {
            customerName: user.name,
            email: user.email,
            otp: otp,
            amount: product.price,
            orderType: 'STANDARD',
            productId: product._id,
            productName: product.name,
            // --- Send Address Data ---
            address: addressForm.address,
            city: addressForm.city,
            zip: addressForm.zip,
            phone: addressForm.phone
        };

        const res = await axios.post('http://localhost:5000/api/buy', payload);
        
        if (res.data.success) {
            alert("Order Placed Successfully!");
            setShowModal(false);
            navigate('/my-orders'); // Redirect to order tracking
        }
    } catch (err) {
        alert("Order Failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  if (!product) return <div style={{padding:'20px'}}>Loading Product...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '40px', flexDirection: 'row', flexWrap: 'wrap' }}>
            {/* LEFT: IMAGE GALLERY */}
            <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
                    <img 
                        src={mainImage ? `http://localhost:5000/uploads/${mainImage}` : (product.image || 'https://via.placeholder.com/300')} 
                        alt="Main" 
                        style={{ width: '100%', height: '400px', objectFit: 'contain' }} 
                    />
                </div>
                {/* Thumbnails */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                    {product.images && product.images.map((img, index) => (
                        <img 
                            key={index}
                            src={`http://localhost:5000/uploads/${img}`}
                            alt="thumb"
                            onClick={() => setMainImage(img)}
                            style={{ 
                                width: '80px', height: '80px', objectFit: 'cover', 
                                border: mainImage === img ? '2px solid #007bff' : '1px solid #ddd',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div style={{ flex: 1, minWidth: '300px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.name}</h1>
                <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {product.description}
                </p>
                <hr style={{ margin: '20px 0' }} />
                <h2 style={{ color: '#b12704', fontSize: '2rem' }}>₹{product.price}</h2>
                
                <button 
                    onClick={initiateBuy}
                    style={{ 
                        background: '#ffa41c', border: '1px solid #a88734', 
                        padding: '15px 40px', fontSize: '1.2rem', borderRadius: '25px',
                        cursor: 'pointer', marginTop: '20px', fontWeight: 'bold'
                    }}
                >
                    Buy Now
                </button>
            </div>
        </div>

        {/* --- SHIPPING ADDRESS POP-UP MODAL --- */}
        {showModal && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                    <h3 style={{ marginTop: 0, textAlign: 'center' }}>Where should we ship this?</h3>
                    
                    <form onSubmit={confirmOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                        
                        <input 
                            required 
                            placeholder="Street Address" 
                            value={addressForm.address} 
                            onChange={e => setAddressForm({...addressForm, address: e.target.value})} 
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        
                        <input 
                            required 
                            placeholder="City" 
                            value={addressForm.city} 
                            onChange={e => setAddressForm({...addressForm, city: e.target.value})} 
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                required 
                                placeholder="Zip Code" 
                                value={addressForm.zip} 
                                onChange={e => setAddressForm({...addressForm, zip: e.target.value})} 
                                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
                            />
                            <input 
                                required 
                                placeholder="Phone Number" 
                                value={addressForm.phone} 
                                onChange={e => setAddressForm({...addressForm, phone: e.target.value})} 
                                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button 
                                type="submit" 
                                style={{ flex: 1, background: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Confirm Order
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowModal(false)} 
                                style={{ flex: 1, background: '#dc3545', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        )}

    </div>
  );
};

export default ProductDetails;