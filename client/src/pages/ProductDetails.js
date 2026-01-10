import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
    const user = JSON.parse(localStorage.getItem('user'));

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [showModal, setShowModal] = useState(false);

    // --- LOADING STATES ---
    const [pageLoading, setPageLoading] = useState(true); // Initial fetch
    const [actionLoading, setActionLoading] = useState(false); // Button actions (OTP/Pay)

    const [addressForm, setAddressForm] = useState({
        address: '',
        city: '',
        zip: '',
        phone: ''
    });

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Product
                const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(productRes.data);
                if (productRes.data.images && productRes.data.images.length > 0) {
                    setMainImage(productRes.data.images[0]);
                }

                // 2. Fetch User Address (if logged in)
                if (user && (user.id || user._id)) {
                    const userId = user.id || user._id;
                    const userRes = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
                    setAddressForm({
                        address: userRes.data.address || '',
                        city: userRes.data.city || '',
                        zip: userRes.data.zip || '',
                        phone: userRes.data.phone || ''
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                // Stop loading animation
                setTimeout(() => setPageLoading(false), 500); 
            }
        };

        fetchData();
    }, [id]);

    const initiateBuy = () => {
        if (!user) {
            alert("Please login to buy");
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    const requestOtp = async (e) => {
        e.preventDefault();
        setActionLoading(true); // Start button spinner
        try {
            await axios.post('http://localhost:5000/api/auth/req-otp', { email: user.email });
            setOtpSent(true);
            alert("OTP sent to email for confirmation!");
        } catch (err) { 
            alert("Failed to send OTP"); 
        } finally {
            setActionLoading(false); // Stop button spinner
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const confirmOrder = async (e) => {
        e.preventDefault();
        if (!product) return;
        if (!otp) return alert("Please enter OTP");

        setActionLoading(true); // Start button spinner

        try {
            // 1. Load Script
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                setActionLoading(false);
                return;
            }

            // 2. Create Order on Server
            const orderPayload = { productId: product._id, amount: product.price };
            const result = await axios.post('http://localhost:5000/api/payment/create-order', orderPayload);
            const { amount, id: order_id, currency } = result.data;

            // 3. Configure Razorpay Options
            const options = {
                key: "rzp_test_RxSehrjb5BD4XK", // 🔴 REPLACE WITH YOUR KEY ID
                amount: amount.toString(),
                currency: currency,
                name: "Basho Pottery",
                description: `Order for ${product.name}`,
                image: "https://your-logo-url.com/logo.png",
                order_id: order_id,

                handler: async function (response) {
                    const paymentData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        customerName: user.name,
                        email: user.email,
                        otp: otp,
                        amount: product.price,
                        orderType: 'STANDARD',
                        productId: product._id,
                        productName: product.name,
                        productImage: product.images[0],
                        address: addressForm.address,
                        city: addressForm.city,
                        zip: addressForm.zip,
                        phone: addressForm.phone
                    };

                    try {
                        const verifyRes = await axios.post('http://localhost:5000/api/buy', paymentData);
                        if (verifyRes.data.success) {
                            alert("Payment Successful! Order Placed.");
                            setShowModal(false);
                            navigate('/my-orders');
                        }
                    } catch (err) {
                        alert("Payment Verified Failed: " + (err.response?.data?.message || "Error"));
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: addressForm.phone,
                },
                theme: {
                    color: "#C85428",
                },
                // Stop loading if user closes modal
                modal: {
                    ondismiss: function() {
                        setActionLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            
            // Note: We don't setActionLoading(false) here immediately, 
            // we wait for the modal ondismiss or handler.

        } catch (err) {
            console.error(err);
            alert("Could not initiate payment.");
            setActionLoading(false);
        }
    };

    // --- PAGE SPINNER ---
    if (pageLoading) return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: palette.lightSand }}>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spinner-large { width: 50px; height: 50px; border: 4px solid rgba(200, 84, 40, 0.2); border-top-color: ${palette.flame}; border-radius: 50%; animation: spin 1s linear infinite; }
            `}</style>
            <div className="spinner-large"></div>
        </div>
    );

    if (!product) return <div style={{ padding: '40px', textAlign: 'center' }}>Product not found.</div>;

    const styles = {
        page: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', background: `linear-gradient(180deg, ${palette.lightSand}, rgba(237,216,180,0.2))`, minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
        input: { padding: '12px', borderRadius: '10px', border: `1px solid ${palette.copper}40`, backgroundColor: 'rgba(255,255,255,0.9)', width: '100%', boxSizing: 'border-box', fontSize: '1rem' },
        btnPrimary: { background: `linear-gradient(135deg, ${palette.flame}, ${palette.copper})`, color: 'white', border: 'none', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 12px 22px rgba(200,84,40,0.24)' },
        changeAddressLink: { color: palette.flame, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', marginLeft: 'auto', display: 'block', width: 'fit-content', marginBottom: '5px' }
    };

    return (
        <div className="product-details" style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@300;400;600&display=swap');

                .product-details { font-family: 'Poppins', sans-serif; }
                
                .details-layout { display: flex; gap: 40px; flex-direction: column; opacity: 0; animation: fadeIn 0.8s ease forwards; }
                @media (min-width: 900px) { .details-layout { flex-direction: row; } }
                
                .details-gallery { flex: 1; min-width: 0; }
                .details-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
                
                .modal-content { width: 90%; max-width: 450px; background: ${palette.white}; padding: 30px; borderRadius: 20px; box-shadow: 0 20px 60px rgba(68,45,28,0.2); border: 1px solid ${palette.copper}20; animation: scaleIn 0.3s ease; }
                
                input:focus { outline: none; border-color: ${palette.flame} !important; box-shadow: 0 0 0 3px rgba(200,84,40,0.1); background: white !important; }
                
                /* ANIMATIONS */
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                
                .spinner-small {
                    width: 20px; height: 20px; 
                    border: 2px solid rgba(255,255,255,0.3); 
                    border-top-color: white; 
                    border-radius: 50%; 
                    animation: spin 0.8s linear infinite;
                    display: inline-block;
                }
            `}</style>

            <div className="details-layout">
                {/* LEFT: GALLERY */}
                <div className="details-gallery">
                    <div style={{ border: `1px solid ${palette.copper}20`, padding: '20px', marginBottom: '15px', borderRadius: '20px', background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <img 
                            src={mainImage ? `http://localhost:5000/uploads/${mainImage}` : (product.image || 'https://via.placeholder.com/300')} 
                            alt="Main" 
                            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block', borderRadius: '10px' }} 
                        />
                    </div>
                    
                    {/* THUMBNAILS */}
                    <div className="thumbs" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                        {product.images && product.images.map((img, index) => (
                            <img 
                                key={index} 
                                src={`http://localhost:5000/uploads/${img}`} 
                                alt="thumb" 
                                onClick={() => setMainImage(img)} 
                                style={{ 
                                    width: '80px', height: '80px', objectFit: 'cover', 
                                    border: mainImage === img ? `2px solid ${palette.flame}` : `2px solid transparent`, 
                                    cursor: 'pointer', borderRadius: '12px', flexShrink: 0,
                                    transition: 'all 0.2s',
                                    opacity: mainImage === img ? 1 : 0.7
                                }} 
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT: INFO */}
                <div className="details-info">
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', marginTop: 0, marginBottom: '10px', color: palette.deep, lineHeight: 1.1 }}>
                        {product.name}
                    </h1>
                    
                    <div style={{ width: '60px', height: '4px', background: palette.flame, marginBottom: '20px', borderRadius: '2px' }}></div>

                    <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: '30px' }}>
                        {product.description}
                    </p>
                    
                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</span>
                            <h2 style={{ color: palette.deep, fontSize: '2rem', margin: 0, fontWeight: '700' }}>₹{product.price}</h2>
                        </div>
                        <button onClick={initiateBuy} style={styles.btnPrimary}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SHIPPING MODAL --- */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(68,45,28,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="modal-content">
                        <h3 style={{ fontFamily: 'Playfair Display, serif', marginTop: 0, textAlign: 'center', color: palette.deep, fontSize: '1.8rem' }}>
                            Shipping Details
                        </h3>
                        
                        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                            <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', ...styles.changeAddressLink }}>
                                Update Saved Address ➜
                            </button>
                        </div>

                        <form onSubmit={otpSent ? confirmOrder : requestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input required placeholder="Street Address" value={addressForm.address} onChange={e => setAddressForm({ ...addressForm, address: e.target.value })} style={styles.input} disabled={otpSent || actionLoading} />
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input required placeholder="City" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} style={styles.input} disabled={otpSent || actionLoading} />
                                <input required placeholder="Zip Code" value={addressForm.zip} onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })} style={styles.input} disabled={otpSent || actionLoading} />
                            </div>
                            
                            <input required placeholder="Phone Number" value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} style={styles.input} disabled={otpSent || actionLoading} />

                            {otpSent && (
                                <div style={{ background: '#FFF5F0', padding: '15px', border: `1px dashed ${palette.flame}`, borderRadius: '10px', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: palette.ember }}>
                                        Enter OTP sent to <strong>{user.email}</strong>
                                    </p>
                                    <input 
                                        placeholder="• • • • • •" 
                                        value={otp} 
                                        onChange={e => setOtp(e.target.value)} 
                                        required 
                                        style={{ ...styles.input, textAlign: 'center', fontWeight: 'bold', letterSpacing: '4px', fontSize: '1.2rem', width: '80%', margin: '0 auto', display: 'block' }} 
                                        disabled={actionLoading}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    disabled={actionLoading}
                                    style={{ flex: 1, background: 'transparent', color: '#888', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
                                >
                                    Cancel
                                </button>
                                
                                <button 
                                    type="submit" 
                                    disabled={actionLoading}
                                    style={{ 
                                        flex: 1, 
                                        background: otpSent ? palette.flame : palette.deep, 
                                        color: 'white', padding: '12px', border: 'none', borderRadius: '10px', 
                                        cursor: actionLoading ? 'not-allowed' : 'pointer', 
                                        fontWeight: 'bold', fontSize: '1rem', 
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}
                                >
                                    {actionLoading ? (
                                        <div className="spinner-small"></div>
                                    ) : (
                                        otpSent ? "Confirm Payment" : "Verify Address"
                                    )}
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
