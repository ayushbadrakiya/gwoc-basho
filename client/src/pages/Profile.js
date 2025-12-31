import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const palette = {
    deep: '#442D1C',
    ember: '#652810',
    copper: '#8E5022',
    flame: '#C85428',
    sand: '#EDD8B4',
    lightSand: '#F9F3E9',
    white: '#FFFFFF',
    shadow: 'rgba(68, 45, 28, 0.08)',
    danger: '#D32F2F',
    success: '#2E7D32',
    warning: '#F57C00'
};

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    // --- TABS & DATA STATE ---
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', city: '', zip: ''
    });
    const [orders, setOrders] = useState([]);
    
    // Loading States
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    // --- CANCELLATION STATE ---
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchProfile();
        fetchOrders();
    }, []);

    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/auth/profile/${user.id || user._id}`);
            setFormData({
                name: res.data.name || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
                address: res.data.address || '',
                city: res.data.city || '',
                zip: res.data.zip || ''
            });
        } catch (err) { console.error(err); }
        setLoadingProfile(false);
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}?email=${user.email}`);
            setOrders(res.data);
        } catch (err) { console.error(err); }
        setLoadingOrders(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile/update', {
                userId: user.id || user._id,
                ...formData
            });
            if (res.data.success) {
                alert("Profile Updated Successfully!");
                let currentUser = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.data.user }));
            }
        } catch (err) { alert("Update Failed"); }
        setIsUpdating(false);
    };

    // --- CANCELLATION HANDLERS ---
    const initiateCancel = (order) => {
        setSelectedOrder(order);
        setOtp('');
        setOtpSent(false);
        setShowCancelModal(true);
    };

    const requestCancelOtp = async () => {
        setIsSendingOtp(true);
        try {
            await axios.post('http://localhost:5000/api/auth/req-otp', { email: user.email });
            setOtpSent(true);
            alert(`OTP sent to ${user.email}`);
        } catch (err) { alert("Failed to send OTP"); }
        setIsSendingOtp(false);
    };

    const confirmCancel = async () => {
        setIsCancelling(true);
        try {
            const url = `http://localhost:5000/api/orders/${selectedOrder._id}/cancel`;
            const res = await axios.post(url, {
                email: user.email,
                otp: otp,
                isAdmin: false 
            });

            if (res.data.success || res.status === 200) {
                alert("Order Cancelled Successfully");
                setShowCancelModal(false);
                fetchOrders(); 
            }
        } catch (err) {
            alert(err.response?.data?.message || "Cancellation Failed");
        }
        setIsCancelling(false);
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

                .profile-page {
                    padding: 40px 20px;
                    min-height: 100vh;
                    background: radial-gradient(circle at top left, ${palette.lightSand}, #F2E6D8);
                    font-family: 'Poppins', sans-serif;
                    color: ${palette.deep};
                }

                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    background: ${palette.white};
                    border-radius: 20px;
                    box-shadow: 0 20px 60px ${palette.shadow}, 0 0 0 1px rgba(142, 80, 34, 0.05);
                    overflow: hidden;
                    animation: slideUp 0.6s ease-out;
                }

                /* --- TABS --- */
                .tab-header {
                    display: flex;
                    background: #FAF8F5;
                    border-bottom: 1px solid rgba(142, 80, 34, 0.1);
                }

                .tab-btn {
                    flex: 1;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    font-weight: 600;
                    color: ${palette.copper};
                    background: transparent;
                    transition: all 0.3s ease;
                    border-bottom: 3px solid transparent;
                    opacity: 0.6;
                }

                .tab-btn:hover {
                    background: rgba(237, 216, 180, 0.2);
                    opacity: 0.8;
                }

                .tab-btn.active {
                    color: ${palette.flame};
                    border-bottom-color: ${palette.flame};
                    background: ${palette.white};
                    opacity: 1;
                }

                .content-area {
                    padding: 40px;
                    min-height: 400px;
                }

                /* --- FORMS --- */
                .section-title {
                    margin: 0 0 20px 0;
                    color: ${palette.deep};
                    font-size: 1.2rem;
                    border-left: 4px solid ${palette.flame};
                    padding-left: 15px;
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .modern-label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: ${palette.ember};
                }

                .modern-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #E0E0E0;
                    background: #FAFAFA;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: all 0.3s;
                    box-sizing: border-box;
                    font-family: inherit;
                }

                .modern-input:focus {
                    outline: none;
                    border-color: ${palette.copper};
                    background: #FFF;
                    box-shadow: 0 4px 10px rgba(142, 80, 34, 0.1);
                }

                .modern-input:disabled {
                    background: #EEE;
                    color: #888;
                }

                .row-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                /* --- ORDER CARDS --- */
                .order-card {
                    border: 1px solid rgba(142, 80, 34, 0.1);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 20px;
                    background: #FFF;
                    transition: all 0.3s;
                    position: relative;
                }

                .order-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    border-color: ${palette.sand};
                }

                .status-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    display: inline-block;
                }

                .status-cancelled { background: #FFEBEE; color: ${palette.danger}; }
                .status-delivered { background: #E8F5E9; color: ${palette.success}; }
                .status-processing { background: #FFF3E0; color: ${palette.warning}; }

                .cancel-btn {
                    padding: 8px 16px;
                    background: transparent;
                    border: 1px solid ${palette.flame};
                    color: ${palette.flame};
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 600;
                    transition: 0.3s;
                }

                .cancel-btn:hover {
                    background: ${palette.flame};
                    color: white;
                }

                /* --- MODAL --- */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(68, 45, 28, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s;
                }

                .modal-box {
                    width: 90%;
                    max-width: 420px;
                    background: ${palette.white};
                    padding: 30px;
                    border-radius: 16px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
                    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-align: center;
                }

                /* --- BUTTONS & SPINNERS --- */
                .primary-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, ${palette.flame}, ${palette.ember});
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-top: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: 0.3s;
                }
                
                .primary-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(200, 84, 40, 0.2);
                }

                .primary-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                .spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #FFF;
                    animation: spin 0.8s linear infinite;
                }

                @media (max-width: 600px) {
                    .row-group { grid-template-columns: 1fr; }
                    .content-area { padding: 20px; }
                }
            `}</style>

            <div className="container">
                {/* TABS HEADER */}
                <div className="tab-header">
                    <div 
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 Profile Settings
                    </div>
                    <div 
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('orders')}
                    >
                        📦 My Orders
                    </div>
                </div>

                <div className="content-area">
                    {/* === TAB 1: PROFILE === */}
                    {activeTab === 'profile' && (
                        <div style={{ animation: 'fadeIn 0.5s' }}>
                            <form onSubmit={handleUpdate}>
                                <h3 className="section-title">Account Details</h3>
                                
                                <div className="input-group">
                                    <label className="modern-label">Full Name</label>
                                    <input 
                                        className="modern-input" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        disabled={loadingProfile}
                                    />
                                </div>
                                
                                <div className="input-group">
                                    <label className="modern-label">Email Address</label>
                                    <input 
                                        className="modern-input" 
                                        name="email" 
                                        value={formData.email} 
                                        disabled 
                                    />
                                </div>

                                <h3 className="section-title" style={{ marginTop: '30px' }}>Shipping Information</h3>
                                
                                <div className="input-group">
                                    <label className="modern-label">Phone Number</label>
                                    <input 
                                        className="modern-input" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                                    />
                                </div>
                                
                                <div className="input-group">
                                    <label className="modern-label">Street Address</label>
                                    <textarea 
                                        className="modern-input" 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={e => setFormData({...formData, address: e.target.value})} 
                                        style={{ height: '80px', resize: 'vertical' }}
                                    />
                                </div>
                                
                                <div className="row-group">
                                    <div className="input-group">
                                        <label className="modern-label">City</label>
                                        <input 
                                            className="modern-input" 
                                            name="city" 
                                            placeholder="City" 
                                            value={formData.city} 
                                            onChange={e => setFormData({...formData, city: e.target.value})} 
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="modern-label">Zip Code</label>
                                        <input 
                                            className="modern-input" 
                                            name="zip" 
                                            placeholder="Zip" 
                                            value={formData.zip} 
                                            onChange={e => setFormData({...formData, zip: e.target.value})} 
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="primary-btn" disabled={isUpdating}>
                                    {isUpdating ? <div className="spinner"></div> : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* === TAB 2: ORDERS === */}
                    {activeTab === 'orders' && (
                        <div style={{ animation: 'fadeIn 0.5s' }}>
                            {loadingOrders ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <div className="spinner" style={{ borderColor: palette.copper, borderTopColor: 'transparent', margin: '0 auto' }}></div>
                                    <p style={{ marginTop: '10px', color: '#999' }}>Fetching orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
                                    <h3>No orders yet!</h3>
                                    <p>Your history will appear here once you make a purchase.</p>
                                </div>
                            ) : (
                                orders.map(order => {
                                    // Helper for status styles
                                    let statusClass = 'status-processing';
                                    if (order.status === 'CANCELLED') statusClass = 'status-cancelled';
                                    else if (order.trackingStatus === 'Delivered') statusClass = 'status-delivered';

                                    return (
                                        <div key={order._id} className="order-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                <div>
                                                    <span className={`status-badge ${statusClass}`}>
                                                        {order.status === 'CANCELLED' ? 'CANCELLED' : order.trackingStatus || 'Processing'}
                                                    </span>
                                                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#999' }}>
                                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {/* CANCEL BUTTON LOGIC */}
                                                {order.status !== 'CANCELLED' && order.trackingStatus !== 'Delivered' && (
                                                    <button 
                                                        onClick={() => initiateCancel(order)}
                                                        className="cancel-btn"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: '#FAFAFA', padding: '10px', borderRadius: '12px' }}>
                                                {order.productImage ? (
                                                    <img 
                                                        src={`http://localhost:5000/uploads/${order.productImage}`} 
                                                        alt="item" 
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                                                    />
                                                ) : (
                                                    <div style={{ width: '60px', height: '60px', background: '#E0E0E0', borderRadius: '8px' }} />
                                                )}
                                                
                                                <div>
                                                    <h4 style={{ margin: '0 0 4px 0', color: palette.deep }}>
                                                        {order.orderType === 'STANDARD' ? order.productName : 'Custom Request'}
                                                    </h4>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: palette.flame, fontWeight: '600' }}>
                                                        ₹{order.amount}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* === CANCEL MODAL === */}
            {showCancelModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3 style={{ marginTop: 0, color: palette.deep }}>Cancel Order?</h3>
                        <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>
                            Are you sure you want to cancel <br />
                            <strong>{selectedOrder?.productName || 'this Item'}</strong>?
                        </p>

                        {!otpSent ? (
                            <button onClick={requestCancelOtp} className="primary-btn" disabled={isSendingOtp}>
                                {isSendingOtp ? <div className="spinner"></div> : "Send OTP to Confirm"}
                            </button>
                        ) : (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <p style={{ fontSize: '0.85rem', color: palette.flame, marginBottom: '10px' }}>
                                    OTP sent to {user.email}
                                </p>
                                <input 
                                    className="modern-input"
                                    placeholder="Enter OTP" 
                                    value={otp} 
                                    onChange={e => setOtp(e.target.value)} 
                                    style={{ textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px' }} 
                                />
                                <button onClick={confirmCancel} className="primary-btn" disabled={isCancelling}>
                                    {isCancelling ? <div className="spinner"></div> : "Confirm Cancellation"}
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={() => setShowCancelModal(false)} 
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: '#999', 
                                marginTop: '15px', 
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Nevermind, keep order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;