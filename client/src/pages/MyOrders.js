import React, { useState, useEffect } from 'react';
import axios from 'axios';

const palette = {
  deep: '#442D1C',
  ember: '#652810',
  copper: '#8E5022',
  flame: '#C85428',
  sand: '#EDD8B4'
};

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if(user) fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    const res = await axios.get('http://localhost:5000/api/orders');
    // Filter for current user
    const userOrders = res.data.filter(o => o.email === user.email); 
    setMyOrders(userOrders);
  };

  const cancelOrder = async (id) => {
    if(!window.confirm("Are you sure you want to cancel? We will send an OTP to your email.")) return;

    const user = JSON.parse(localStorage.getItem('user'));

    try {
        // 2. REQUEST THE OTP FIRST
        alert("Sending OTP...");
        await axios.post('http://localhost:5000/api/auth/req-otp', { email: user.email });
        
        // 3. Prompt user to enter the OTP they just received
        const enteredOtp = prompt("OTP sent to your email. Please enter it to confirm cancellation:");
        
        if (!enteredOtp) return; // User pressed cancel on prompt

        // 4. VERIFY OTP AND CANCEL (Calls the route you posted)
        const res = await axios.post(`http://localhost:5000/api/orders/${id}/cancel`, {
            email: user.email,
            otp: enteredOtp
        });

        if (res.data.success) {
            alert("Order Cancelled Successfully");
            // Refresh the orders list
            window.location.reload(); 
        }

    } catch (err) {
        alert(err.response?.data?.message || "Error cancelling order");
    }
  };

  // --- PROGRESS BAR COMPONENT ---
  const Tracker = ({ currentStatus }) => {
    const stages = ['Processing', 'Shipped', 'Reached at final station', 'Out for delivery', 'Delivered'];
    const activeIndex = stages.indexOf(currentStatus);

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', position: 'relative' }}>
        
        {/* Grey Background Line */}
        <div style={{ 
            position: 'absolute', top: '15px', left: '0', width: '100%', height: '4px', 
            background: 'rgba(68,45,28,0.1)', zIndex: 0 
        }}></div>

        {/* Green Progress Line (Calculated Width) */}
        <div style={{ 
            position: 'absolute', top: '15px', left: '0', height: '4px', 
            background: palette.flame, zIndex: 0, transition: 'width 0.3s',
            width: `${(activeIndex / (stages.length - 1)) * 100}%`
        }}></div>

        {/* Steps */}
        {stages.map((stage, index) => {
            const isActive = index <= activeIndex;
            return (
                <div key={stage} style={{ textAlign: 'center', zIndex: 1, width: '20%' }}>
                    {/* Circle */}
                    <div style={{ 
                        width: '30px', height: '30px', borderRadius: '50%', margin: '0 auto',
                        background: isActive ? palette.flame : 'rgba(68,45,28,0.12)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '14px', border: '2px solid white'
                    }}>
                        {isActive ? '✓' : index + 1}
                    </div>
                    {/* Text Label */}
                    <p style={{ fontSize: '12px', marginTop: '5px', color: isActive ? palette.deep : '#999', fontWeight: isActive ? 'bold' : 'normal' }}>
                        {stage}
                    </p>
                </div>
            )
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(180deg, rgba(237,216,180,0.35), rgba(237,216,180,0.15))', minHeight: '100vh' }}>
      <h2 style={{ color: palette.deep }}>My Order History</h2>
      {myOrders.length === 0 && <p>You haven't placed any orders yet.</p>}
      
      {myOrders.map(order => (
        <div key={order._id} style={{ 
            border: `1px solid ${palette.copper}30`, padding: '20px', marginBottom: '20px', borderRadius: '12px',
            boxShadow: '0 12px 24px rgba(68,45,28,0.08)', background: order.status === 'CANCELLED' ? 'rgba(200,84,40,0.08)' : 'rgba(255,255,255,0.95)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div>
                    <h3 style={{ margin: 0, color: palette.deep }}>{order.orderType === 'STANDARD' ? order.productName : 'Custom Request'}</h3>
                    <small>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</small>
                </div>
                <div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: palette.ember }}>₹{order.amount}</span>
                </div>
            </div>

            {/* SHOW TRACKER IF NOT CANCELLED */}
            {order.status === 'CANCELLED' ? (
                <div style={{ padding: '20px', textAlign: 'center', color: palette.ember, fontWeight: 'bold' }}>
                    🚫 ORDER CANCELLED
                </div>
            ) : (
                <Tracker currentStatus={order.trackingStatus} />
            )}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                {order.status !== 'CANCELLED' && order.trackingStatus !== 'Delivered' && (
                    <button onClick={() => cancelOrder(order._id)} style={{ background: palette.ember, color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight:'600' }}>
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;