import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data);
        } catch (err) { console.error(err); }
    };

    // --- Handlers ---
    const handleFileChange = (e) => setFiles(e.target.files);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) { alert("Please select an image"); return; }

        const data = new FormData();
        data.append('name', name);
        data.append('price', price);
        data.append('description', description);
        for (let i = 0; i < files.length; i++) data.append('images', files[i]);

        try {
            await axios.post('http://localhost:5000/api/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Product Added!');
            setName(''); setPrice(''); setDescription(''); setFiles([]);
            document.querySelector('input[type="file"]').value = "";
            fetchProducts();
        } catch (err) { alert("Error adding product"); }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Delete this product?")) {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();
        }
    };

    const updateTracking = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/tracking`, { trackingStatus: newStatus });
            fetchOrders();
        } catch (err) { alert(err.response?.data?.message || "Update failed"); }
    };

    const cancelOrder = async (id) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            await axios.post(`http://localhost:5000/api/orders/${id}/cancel`);
            fetchOrders();
        } catch (err) { alert("Error cancelling"); }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Admin Dashboard</h1>

            {/* --- ADD PRODUCT SECTION --- */}
            <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>Add New Product</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px' }} />
                    <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required style={{ padding: '8px' }} />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ padding: '8px' }} />
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" />
                    <button type="submit" style={{ background: 'green', color: 'white', padding: '10px' }}>Upload Product</button>
                </form>
            </div>

            {/* --- ORDER HISTORY SECTION --- */}
            <h2>Order History</h2>
            {orders.length === 0 ? <p>No orders yet.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <thead style={{ background: '#333', color: 'white' }}>
                        <tr>
                            <th style={{ padding: '10px' }}>Date</th>
                            <th style={{ padding: '10px', width: '25%' }}>Customer Details</th>
                            <th style={{ padding: '10px', width: '30%' }}>Product / Custom Info</th>
                            <th style={{ padding: '10px' }}>Tracking</th>
                            <th style={{ padding: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid #ddd', background: order.status === 'CANCELLED' ? '#ffeaea' : 'white' }}>

                                <td style={{ padding: '10px', textAlign: 'center' }}>{new Date(order.createdAt).toLocaleDateString()}</td>

                                {/* CUSTOMER INFO COLUMN */}
                                <td style={{ padding: '10px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{order.customerName}</div>
                                    <div style={{ color: '#007bff' }}>{order.email}</div>
                                    <div>📞 {order.phone}</div>
                                    <div style={{ marginTop: '5px', background: '#f9f9f9', padding: '5px', borderRadius: '4px', border: '1px solid #eee' }}>
                                        📍 {order.address}<br />
                                        {order.city} - {order.zip}
                                    </div>
                                </td>

                                {/* PRODUCT INFO COLUMN */}
                                <td style={{ padding: '10px' }}>
                                    {order.orderType === 'STANDARD' ? (
                                        // STANDARD ORDER DISPLAY
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            {order.productImage ? (
                                                <img
                                                    src={`http://localhost:5000/uploads/${order.productImage}`}
                                                    alt="prod"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid #ccc' }}
                                                />
                                            ) : <div style={{ width: '60px', height: '60px', background: '#eee' }}>No Img</div>}
                                            <div>
                                                <strong>{order.productName}</strong><br />
                                                <span style={{ color: 'green' }}>₹{order.amount}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        // CUSTOM ORDER DISPLAY (UPDATED)
                                        <div style={{ background: '#fff8db', padding: '10px', borderRadius: '4px', border: '1px solid #ffeeba' }}>
                                            <strong style={{ color: '#856404' }}>CUSTOM REQUEST</strong>
                                            <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
                                                <b>Desc:</b> {order.customDetails?.description}<br />
                                                <b>Mat:</b> {order.customDetails?.material}
                                            </p>

                                            {/* DISPLAY CUSTOM IMAGES IF ANY */}
                                            {order.customImages && order.customImages.length > 0 && (
                                                <div style={{ marginTop: '5px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                    {order.customImages.map((img, idx) => (
                                                        <a key={idx} href={`http://localhost:5000/uploads/${img}`} target="_blank" rel="noreferrer">
                                                            <img
                                                                src={`http://localhost:5000/uploads/${img}`}
                                                                alt="custom-ref"
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid #999' }}
                                                            />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>

                                {/* TRACKING COLUMN */}
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    {order.status === 'CANCELLED' ? <b style={{ color: 'red' }}>CANCELLED</b> :
                                        order.trackingStatus === 'Delivered' ? <b style={{ color: 'green', border: '1px solid green', padding: '3px' }}>✓ COMPLETED</b> :
                                            (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                                                    <span>Current: <b>{order.trackingStatus}</b></span>
                                                    {(() => {
                                                        const stages = ['Processing', 'Shipped', 'Reached at final station', 'Out for delivery', 'Delivered'];
                                                        const next = stages[stages.indexOf(order.trackingStatus) + 1];
                                                        if (next) return (
                                                            <button onClick={() => updateTracking(order._id, next)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}>
                                                                Mark "{next}"
                                                            </button>
                                                        )
                                                    })()}
                                                </div>
                                            )
                                    }
                                </td>

                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    {order.status !== 'CANCELLED' && order.trackingStatus !== 'Delivered' &&
                                        <button onClick={() => cancelOrder(order._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Cancel</button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Admin;