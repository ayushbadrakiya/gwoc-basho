import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const Admin = () => {
    // --- STATE MANAGEMENT ---
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);

    // Workshop State
    const [wsForm, setWsForm] = useState({ title: '', date: '', seats: '', description: '', category: 'GROUP' });
    const [wsImage, setWsImage] = useState(null);
    const [registrations, setRegistrations] = useState([]);

    // News State
    const [newsList, setNewsList] = useState([]);
    const [newsForm, setNewsForm] = useState({ title: '', description: '' });
    const [newsImage, setNewsImage] = useState(null);

    // Testimonial State
    const [testList, setTestList] = useState([]);
    const [testForm, setTestForm] = useState({ name: '', message: '', designation: '' });
    const [testMedia, setTestMedia] = useState(null);

    // --- EFFECT & FETCHING ---
    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchRegistrations();
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const resNews = await axios.get('http://localhost:5000/api/content/news');
            setNewsList(resNews.data);
            const resTest = await axios.get('http://localhost:5000/api/content/testimonials');
            setTestList(resTest.data);
        } catch (err) { console.error(err); }
    };

    const fetchRegistrations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/workshops/registrations');
            setRegistrations(res.data);
        } catch (err) { console.error("Error fetching registrations"); }
    };

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

    // --- HANDLERS (NEWS) ---
    const handleAddNews = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', newsForm.title);
        data.append('description', newsForm.description);
        if (newsImage) data.append('image', newsImage);

        try {
            await axios.post('http://localhost:5000/api/content/news/add', data);
            alert("News Added!");
            fetchContent();
            setNewsForm({ title: '', description: '' });
            setNewsImage(null);
        } catch (err) { alert("Error adding news"); }
    };

    const handleDeleteNews = async (id) => {
        if (!window.confirm("Delete this news?")) return;
        await axios.delete(`http://localhost:5000/api/content/news/${id}`);
        fetchContent();
    };

    // --- HANDLERS (TESTIMONIALS) ---
    const handleAddTestimonial = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', testForm.name);
        data.append('message', testForm.message);
        data.append('designation', testForm.designation);
        if (testMedia) data.append('media', testMedia);

        try {
            await axios.post('http://localhost:5000/api/content/testimonials/add', data);
            alert("Testimonial Added Successfully!");
            fetchContent();
            setTestForm({ name: '', message: '', designation: '' });
            setTestMedia(null);
        } catch (err) { console.error(err); alert("Error adding testimonial"); }
    };

    const handleDeleteTestimonial = async (id) => {
        if (!window.confirm("Delete this review?")) return;
        await axios.delete(`http://localhost:5000/api/content/testimonials/${id}`);
        fetchContent();
    };

    // --- HANDLERS (WORKSHOPS) ---
    const handleAddWorkshop = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', wsForm.title);
        data.append('date', wsForm.date);
        data.append('seats', wsForm.seats);
        data.append('description', wsForm.description);
        data.append('category', wsForm.category);
        data.append('isAdmin', true);
        if (wsImage) data.append('image', wsImage);

        try {
            await axios.post('http://localhost:5000/api/workshops/add', data);
            alert("Workshop Added!");
            setWsForm({ title: '', date: '', seats: '', description: '', category: 'GROUP' });
            setWsImage(null);
        } catch (err) { alert("Error adding workshop"); }
    };

    // --- HANDLERS (PRODUCTS) ---
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
            await axios.post('http://localhost:5000/api/products', data);
            alert('Product Added!');
            setName(''); setPrice(''); setDescription(''); setFiles([]);
            fetchProducts();
        } catch (err) { alert("Error adding product"); }
    };

    // --- HANDLERS (ORDERS) ---
    const updateTracking = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/tracking`, { trackingStatus: newStatus });
            fetchOrders();
        } catch (err) { alert(err.response?.data?.message || "Update failed"); }
    };

    const cancelOrder = async (id) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            await axios.post(`http://localhost:5000/api/orders/${id}/cancel`, { isAdmin: true });
            fetchOrders();
        } catch (err) { alert("Error cancelling"); }
    };

    // --- STYLES OBJECT ---
    const styles = {
        page: { padding: '20px', maxWidth: '1200px', margin: '0 auto', background: palette.lightSand, minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
        header: { color: palette.deep, borderBottom: `2px solid ${palette.copper}`, paddingBottom: '10px', marginBottom: '20px' },
        subHeader: { color: palette.ember, marginBottom: '15px', marginTop: '30px' },
        card: { background: palette.white, padding: '20px', borderRadius: '12px', marginBottom: '30px', border: `1px solid ${palette.sand}`, boxShadow: '0 4px 12px rgba(68,45,28,0.08)' },
        input: { padding: '12px', borderRadius: '8px', border: `1px solid ${palette.copper}`, backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' },
        btnPrimary: { background: palette.flame, color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '10px' },
        btnDanger: { background: palette.ember, color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        btnAction: { background: palette.copper, color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
        tableHead: { background: palette.deep, color: 'white', textAlign: 'left' }
    };

    return (
        <div style={styles.page}>
            {/* CSS FOR RESPONSIVENESS */}
            <style>{`
                .form-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
                @media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } }
                .full-width { grid-column: 1 / -1; }
                
                .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
                
                .table-container { overflow-x: auto; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                table { width: 100%; border-collapse: collapse; min-width: 800px; }
                th, td { padding: 12px; border-bottom: 1px solid #ddd; vertical-align: top; }
                
                button:hover { opacity: 0.9; transform: translateY(-1px); transition: all 0.2s; }
            `}</style>

            <h1 style={styles.header}>Admin Dashboard</h1>

            {/* --- ADD PRODUCT SECTION --- */}
            <div style={styles.card}>
                <h3 style={{ color: palette.ember, marginTop: 0 }}>Add New Product</h3>
                <form onSubmit={handleSubmit} className="form-grid">
                    <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
                    <input type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required style={styles.input} />
                    <div className="full-width">
                        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ ...styles.input, height: '80px' }} />
                    </div>
                    <div className="full-width">
                        <label style={{ display: 'block', marginBottom: '5px', color: palette.deep }}>Product Images:</label>
                        <input type="file" multiple onChange={handleFileChange} accept="image/*" style={styles.input} />
                    </div>
                    <div className="full-width">
                        <button type="submit" style={styles.btnPrimary}>Upload Product</button>
                    </div>
                </form>
            </div>

            {/* --- CREATE WORKSHOP SECTION --- */}
            <div style={styles.card}>
                <h3 style={{ color: palette.ember, marginTop: 0 }}>Create Workshop</h3>
                <form onSubmit={handleAddWorkshop} className="form-grid">
                    <input placeholder="Workshop Title" value={wsForm.title} onChange={e => setWsForm({ ...wsForm, title: e.target.value })} required style={styles.input} />
                    <input type="datetime-local" value={wsForm.date} onChange={e => setWsForm({ ...wsForm, date: e.target.value })} required style={styles.input} />
                    <select value={wsForm.category} onChange={e => setWsForm({ ...wsForm, category: e.target.value })} style={styles.input}>
                        <option value="GROUP">Group Workshop</option>
                        <option value="ONE-ON-ONE">One-on-One Session</option>
                    </select>
                    <input type="number" placeholder="Seats" value={wsForm.seats} onChange={e => setWsForm({ ...wsForm, seats: e.target.value })} required style={styles.input} />
                    <div className="full-width">
                        <input type="file" onChange={e => setWsImage(e.target.files[0])} style={styles.input} />
                    </div>
                    <div className="full-width">
                        <textarea placeholder="Description" value={wsForm.description} onChange={e => setWsForm({ ...wsForm, description: e.target.value })} style={{ ...styles.input, height: '60px' }} />
                    </div>
                    <div className="full-width">
                        <button type="submit" style={styles.btnPrimary}>Add Workshop</button>
                    </div>
                </form>
            </div>

            {/* --- NEWS SECTION --- */}
            <div style={styles.card}>
                <h3 style={{ color: palette.ember, marginTop: 0 }}>Manage News & Exhibitions</h3>
                <form onSubmit={handleAddNews} className="form-grid" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: `1px dashed ${palette.sand}` }}>
                    <input placeholder="News Title" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} required style={styles.input} />
                    <input type="file" onChange={e => setNewsImage(e.target.files[0])} style={styles.input} />
                    <div className="full-width">
                        <textarea placeholder="News Description" value={newsForm.description} onChange={e => setNewsForm({ ...newsForm, description: e.target.value })} required style={{ ...styles.input, height: '60px' }} />
                    </div>
                    <div className="full-width">
                        <button type="submit" style={styles.btnPrimary}>Post News</button>
                    </div>
                </form>

                <div className="news-grid">
                    {newsList.map(item => (
                        <div key={item._id} style={{ border: `1px solid ${palette.sand}`, padding: '10px', borderRadius: '8px', background: '#fff' }}>
                            {item.image && <img src={`http://localhost:5000/uploads/${item.image}`} alt="news" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />}
                            <h4 style={{ color: palette.deep, margin: '10px 0 5px' }}>{item.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>{item.description.substring(0, 50)}...</p>
                            <button onClick={() => handleDeleteNews(item._id)} style={{ ...styles.btnDanger, width: '100%' }}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- TESTIMONIALS SECTION --- */}
            <div style={styles.card}>
                <h3 style={{ color: palette.ember, marginTop: 0 }}>Manage Testimonials</h3>
                <form onSubmit={handleAddTestimonial} className="form-grid" style={{ marginBottom: '20px' }}>
                    <input placeholder="Client Name" value={testForm.name} onChange={e => setTestForm({ ...testForm, name: e.target.value })} required style={styles.input} />
                    <input placeholder="Role (e.g. Student)" value={testForm.designation} onChange={e => setTestForm({ ...testForm, designation: e.target.value })} style={styles.input} />
                    <div className="full-width">
                        <input type="file" accept="image/*,video/*" onChange={e => setTestMedia(e.target.files[0])} style={styles.input} />
                    </div>
                    <div className="full-width">
                        <textarea placeholder="Client Message" value={testForm.message} onChange={e => setTestForm({ ...testForm, message: e.target.value })} required style={{ ...styles.input, height: '60px' }} />
                    </div>
                    <div className="full-width">
                        <button type="submit" style={styles.btnPrimary}>Add Testimonial</button>
                    </div>
                </form>

                <div className="table-container">
                    <table>
                        <thead style={styles.tableHead}>
                            <tr>
                                <th>Name</th>
                                <th>Message</th>
                                <th>Media</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testList.map(t => (
                                <tr key={t._id}>
                                    <td><strong>{t.name}</strong><br /><span style={{ fontSize: '0.8em', color: palette.copper }}>{t.designation}</span></td>
                                    <td>{t.message}</td>
                                    <td>{t.mediaType !== 'none' ? <span style={{ color: 'green' }}>✔ {t.mediaType}</span> : '-'}</td>
                                    <td>
                                        <button onClick={() => handleDeleteTestimonial(t._id)} style={styles.btnDanger}>X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- REGISTRATIONS SECTION (UPDATED) --- */}
            <h2 style={styles.subHeader}>Workshop Registrations</h2>
            <div className="table-container">
                <table>
                    <thead style={styles.tableHead}>
                        <tr>
                            <th style={{ padding: '12px' }}>Date</th>
                            <th style={{ padding: '12px' }}>Customer Name</th>
                            <th style={{ padding: '12px' }}>Contact Info</th>
                            <th style={{ padding: '12px' }}>Workshop</th>
                            <th style={{ padding: '12px' }}>Booking Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((reg) => (
                            <tr key={reg._id} style={{ borderBottom: '1px solid #eee' }}>
                                {/* 1. Date */}
                                <td style={{ padding: '12px' }}>
                                    {new Date(reg.bookedAt).toLocaleDateString()}
                                </td>

                                {/* 2. Customer Name */}
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                    {reg.userName}
                                </td>

                                {/* 3. Contact Info (Email & Phone) */}
                                <td style={{ padding: '12px' }}>
                                    <div style={{ color: palette.flame }}>{reg.userEmail}</div>
                                    {reg.phone && (
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                                            📞 {reg.phone}
                                        </div>
                                    )}
                                </td>

                                {/* 4. Workshop Title */}
                                <td style={{ padding: '12px' }}>
                                    {reg.workshopTitle}
                                </td>

                                {/* 5. Booking Details (Seats & Experience) */}
                                <td style={{ padding: '12px' }}>
                                    <strong>{reg.seatsBooked} Seat(s)</strong>
                                    <br />
                                    {reg.experience && (
                                        <span style={{
                                            fontSize: '0.8rem',
                                            background: palette.lightSand,
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            border: `1px solid ${palette.copper}40`,
                                            display: 'inline-block',
                                            marginTop: '5px'
                                        }}>
                                            Exp: {reg.experience}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* --- ORDER HISTORY SECTION --- */}
            <h2 style={styles.subHeader}>Order History</h2>
            <div style={styles.card}>
                {orders.length === 0 ? <p>No orders yet.</p> : (
                    <div className="table-container">
                        <table>
                            <thead style={styles.tableHead}>
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
                                    <tr key={order._id} style={{ borderBottom: '1px solid #ddd', background: order.status === 'CANCELLED' ? '#fff5f5' : 'white' }}>

                                        <td style={{ padding: '10px', textAlign: 'center' }}>{new Date(order.createdAt).toLocaleDateString()}</td>

                                        {/* CUSTOMER INFO COLUMN */}
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{order.customerName}</div>
                                            <div style={{ color: palette.flame }}>{order.email}</div>
                                            <div>📞 {order.phone}</div>
                                            <div style={{ marginTop: '5px', background: palette.lightSand, padding: '5px', borderRadius: '4px', border: `1px solid ${palette.sand}` }}>
                                                📍 {order.address}<br />
                                                {order.city} - {order.zip}
                                            </div>
                                        </td>

                                        {/* PRODUCT INFO COLUMN */}
                                        <td style={{ padding: '10px' }}>
                                            {order.orderType === 'STANDARD' ? (
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    {order.productImage ? (
                                                        <img
                                                            src={`http://localhost:5000/uploads/${order.productImage}`}
                                                            alt="prod"
                                                            style={{ width: '60px', height: '60px', objectFit: 'cover', border: `1px solid ${palette.copper}`, borderRadius: '4px' }}
                                                        />
                                                    ) : <div style={{ width: '60px', height: '60px', background: '#eee' }}>No Img</div>}
                                                    <div>
                                                        <strong>{order.productName}</strong><br />
                                                        <span style={{ color: palette.ember, fontWeight: 'bold' }}>₹{order.amount}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ background: palette.lightSand, padding: '10px', borderRadius: '8px', border: `1px solid ${palette.copper}` }}>
                                                    <strong style={{ color: palette.deep }}>CUSTOM REQUEST</strong>
                                                    <p style={{ margin: '5px 0', fontSize: '0.9rem', color: palette.copper }}>
                                                        <b>Desc:</b> {order.customDetails?.description}<br />
                                                        <b>Mat:</b> {order.customDetails?.material}
                                                    </p>
                                                    {order.customImages && order.customImages.length > 0 && (
                                                        <div style={{ marginTop: '5px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                            {order.customImages.map((img, idx) => (
                                                                <a key={idx} href={`http://localhost:5000/uploads/${img}`} target="_blank" rel="noreferrer">
                                                                    <img
                                                                        src={`http://localhost:5000/uploads/${img}`}
                                                                        alt="custom-ref"
                                                                        style={{ width: '40px', height: '40px', objectFit: 'cover', border: `1px solid ${palette.copper}`, borderRadius: '6px' }}
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
                                            {order.status === 'CANCELLED' ? <b style={{ color: palette.flame }}>CANCELLED</b> :
                                                order.trackingStatus === 'Delivered' ? <b style={{ color: 'green', border: `1px solid green`, padding: '3px', borderRadius: '6px' }}>✓ COMPLETED</b> :
                                                    (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                                                            <span>Current: <b>{order.trackingStatus}</b></span>
                                                            {(() => {
                                                                const stages = ['Processing', 'Shipped', 'Reached at final station', 'Out for delivery', 'Delivered'];
                                                                const next = stages[stages.indexOf(order.trackingStatus) + 1];
                                                                if (next) return (
                                                                    <button onClick={() => updateTracking(order._id, next)} style={styles.btnAction}>
                                                                        Mark "{next}"
                                                                    </button>
                                                                )
                                                            })()}
                                                        </div>
                                                    )
                                            }
                                        </td>

                                        {/* ACTION COLUMN */}
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            {order.status !== 'CANCELLED' && order.trackingStatus !== 'Delivered' &&
                                                <button onClick={() => cancelOrder(order._id)} style={styles.btnDanger}>Cancel</button>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;