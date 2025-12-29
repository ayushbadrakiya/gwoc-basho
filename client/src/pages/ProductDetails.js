import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// --- THEME CONFIGURATION ---
const palette = {
    deep: '#442D1C',
    ember: '#652810',
    copper: '#8E5022',
    flame: '#C85428',
    sand: '#EDD8B4',
    lightSand: '#F9F3E9',
    white: '#FFFFFF'
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');

    // --- State for the Address Modal ---
    const [showModal, setShowModal] = useState(false);
    const [addressForm, setAddressForm] = useState({
        address: '', city: '', zip: '', phone: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));

    // --- OTP State ---
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

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
        setShowModal(true);
    };

    // 2. Request OTP Function
    const requestOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/req-otp', { email: user.email });
            setOtpSent(true);
            alert("OTP sent to email for confirmation!");
        } catch (err) { alert("Failed to send OTP"); }
    };

    // 3. Submit Order with Address
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
                navigate('/my-orders');
            }
        } catch (err) {
            alert("Order Failed: " + (err.response?.data?.message || "Server Error"));
        }
    };

    if (!product) return <div style={{ padding: '40px', color: palette.deep, textAlign: 'center' }}>Loading Product...</div>;

    // --- STYLES OBJECT ---
    const styles = {
        page: {
            padding: '40px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: `linear-gradient(180deg, ${palette.lightSand}, rgba(237,216,180,0.2))`,
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif'
        },
        input: {
            padding: '12px',
            borderRadius: '10px',
            border: `1px solid ${palette.copper}40`,
            backgroundColor: 'rgba(255,255,255,0.9)',
            width: '100%',
            boxSizing: 'border-box',
            fontSize: '1rem'
        },
        btnPrimary: {
            background: `linear-gradient(135deg, ${palette.flame}, ${palette.copper})`,
            color: 'white',
            border: 'none',
            padding: '15px 40px',
            fontSize: '1.2rem',
            borderRadius: '999px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 12px 22px rgba(200,84,40,0.24)',
            transition: 'transform 0.2s'
        }
    };

    return (
        <div className="product-details" style={styles.page}>

            {/* RESPONSIVE CSS */}
            <style>{`
                .details-layout {
                    display: flex;
                    gap: 40px;
                    flex-direction: column; /* Mobile Default */
                }
                @media (min-width: 900px) {
                    .details-layout {
                        flex-direction: row; /* Desktop */
                    }
                }
                
                .details-gallery { flex: 1; min-width: 0; } /* min-width 0 prevents flex overflow */
                .details-info { flex: 1; }

                .modal-content {
                    width: 90%;
                    max-width: 450px;
                    background: ${palette.sand};
                    padding: 30px;
                    border-radius: 14px;
                    box-shadow: 0 14px 28px rgba(68,45,28,0.25);
                    border: 1px solid ${palette.copper}35;
                }

                input:focus {
                    outline: none;
                    border-color: ${palette.flame} !important;
                    box-shadow: 0 0 0 3px rgba(200,84,40,0.1);
                }
                
                button:hover {
                    opacity: 0.95;
                    transform: translateY(-2px);
                }
            `}</style>

            <div className="details-layout">
                {/* LEFT: IMAGE GALLERY */}
                <div className="details-gallery">
                    <div style={{ border: `1px solid ${palette.copper}35`, padding: '10px', marginBottom: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.92)', boxShadow: '0 12px 24px rgba(68,45,28,0.08)' }}>
                        <img
                            src={mainImage ? `http://localhost:5000/uploads/${mainImage}` : (product.image || 'https://via.placeholder.com/300')}
                            alt="Main"
                            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
                        />
                    </div>
                    {/* Thumbnails */}
                    <div className="thumbs" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                        {product.images && product.images.map((img, index) => (
                            <img
                                key={index}
                                src={`http://localhost:5000/uploads/${img}`}
                                alt="thumb"
                                onClick={() => setMainImage(img)}
                                style={{
                                    width: '80px', height: '80px', objectFit: 'cover',
                                    border: mainImage === img ? `2px solid ${palette.flame}` : `1px solid ${palette.copper}40`,
                                    cursor: 'pointer', borderRadius: '8px',
                                    flexShrink: 0 // Prevents shrinking
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT: PRODUCT INFO */}
                <div className="details-info">
                    <h1 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '15px', color: palette.deep }}>{product.name}</h1>
                    <p style={{ fontSize: '1.1rem', color: palette.copper, lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {product.description}
                    </p>
                    <hr style={{ margin: '30px 0', border: 'none', borderTop: `1px solid ${palette.copper}40` }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                        <h2 style={{ color: palette.ember, fontSize: '2.5rem', margin: 0 }}>₹{product.price}</h2>
                        <button onClick={initiateBuy} style={styles.btnPrimary}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SHIPPING ADDRESS & OTP MODAL --- */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(68,45,28,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content">
                        <h3 style={{ marginTop: 0, textAlign: 'center', color: palette.deep, fontSize: '1.5rem' }}>Where should we ship this?</h3>

                        <form onSubmit={otpSent ? confirmOrder : requestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>

                            <input
                                required
                                placeholder="Street Address"
                                value={addressForm.address}
                                onChange={e => setAddressForm({ ...addressForm, address: e.target.value })}
                                style={styles.input}
                                disabled={otpSent}
                            />

                            <input
                                required
                                placeholder="City"
                                value={addressForm.city}
                                onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                                style={styles.input}
                                disabled={otpSent}
                            />

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    required
                                    placeholder="Zip Code"
                                    value={addressForm.zip}
                                    onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })}
                                    style={styles.input}
                                    disabled={otpSent}
                                />
                                <input
                                    required
                                    placeholder="Phone Number"
                                    value={addressForm.phone}
                                    onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    style={styles.input}
                                    disabled={otpSent}
                                />
                            </div>

                            {/* OTP SECTION (Added to make buy function work) */}
                            {otpSent && (
                                <div style={{ background: '#FFF5F0', padding: '10px', border: `1px solid ${palette.flame}`, borderRadius: '8px' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: palette.ember }}>OTP sent to {user.email}</p>
                                    <input 
                                        placeholder="Enter OTP" 
                                        value={otp} 
                                        onChange={e => setOtp(e.target.value)} 
                                        required 
                                        style={{...styles.input, textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px'}} 
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="submit"
                                    style={{ flex: 1, background: otpSent ? palette.flame : palette.deep, color: 'white', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                                >
                                    {otpSent ? "Confirm Order" : "Verify & Next"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{ flex: 1, background: palette.copper, color: 'white', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
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