import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            background: '#e0e0e0', zIndex: 0 
        }}></div>

        {/* Green Progress Line (Calculated Width) */}
        <div style={{ 
            position: 'absolute', top: '15px', left: '0', height: '4px', 
            background: '#28a745', zIndex: 0, transition: 'width 0.3s',
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
                        background: isActive ? '#28a745' : '#e0e0e0',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '14px', border: '2px solid white'
                    }}>
                        {isActive ? '✓' : index + 1}
                    </div>
                    {/* Text Label */}
                    <p style={{ fontSize: '12px', marginTop: '5px', color: isActive ? 'black' : '#999', fontWeight: isActive ? 'bold' : 'normal' }}>
                        {stage}
                    </p>
                </div>
            )
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>My Order History</h2>
      {myOrders.length === 0 && <p>You haven't placed any orders yet.</p>}
      
      {myOrders.map(order => (
        <div key={order._id} style={{ 
            border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: order.status === 'CANCELLED' ? '#f9f9f9' : 'white'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div>
                    <h3 style={{ margin: 0 }}>{order.orderType === 'STANDARD' ? order.productName : 'Custom Request'}</h3>
                    <small>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</small>
                </div>
                <div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{order.amount}</span>
                </div>
            </div>

            {/* SHOW TRACKER IF NOT CANCELLED */}
            {order.status === 'CANCELLED' ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
                    🚫 ORDER CANCELLED
                </div>
            ) : (
                <Tracker currentStatus={order.trackingStatus} />
            )}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                {order.status !== 'CANCELLED' && order.trackingStatus !== 'Delivered' && (
                    <button onClick={() => cancelOrder(order._id)} style={{ background: 'red', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
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