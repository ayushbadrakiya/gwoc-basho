import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";

// --- THEME CONFIGURATION ---
const palette = {
    deep: '#442D1C',      // Dark Coffee
    ember: '#652810',     // Clay
    copper: '#8E5022',    // Bronze
    flame: '#C85428',     // Terracotta
    sand: '#EDD8B4',      // Beige
    lightSand: '#Fdfbf7', // Off-white background
    white: '#FFFFFF',
    sidebarBg: '#2C1B10', // Almost Black
    border: '#E5E0D8'
};

const Admin = () => {
    // --- NAVIGATION STATE ---
    const [activeTab, setActiveTab] = useState('products');
    
    // --- DATA STATE ---
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [newsList, setNewsList] = useState([]);
    const [testList, setTestList] = useState([]);
    
    // Inquiries State
    const [inquiries, setInquiries] = useState([]);
    const [loadingInquiries, setLoadingInquiries] = useState(false);

    // --- CHART STATE ---
    const [chartData, setChartData] = useState([["Workshop", "Seats"]]);

    // --- FORM STATES ---
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);

    const [wsForm, setWsForm] = useState({ title: '', date: '', seats: '', description: '', category: 'GROUP' });
    const [wsImage, setWsImage] = useState(null);

    const [newsForm, setNewsForm] = useState({ title: '', description: '' });
    const [newsImage, setNewsImage] = useState(null);

    const [testForm, setTestForm] = useState({ name: '', message: '', designation: '' });
    const [testMedia, setTestMedia] = useState(null);

    // --- EFFECT & FETCHING ---
    useEffect(() => {
        // Fetch common data
        fetchProducts();
        fetchOrders();
        fetchRegistrations();
        fetchContent();
        
        // Fetch tab specific data
        if (activeTab === 'inquiries') fetchInquiries();
    }, [activeTab]);

    // --- UPDATE CHART ---
    useEffect(() => {
        if (registrations.length > 0) {
            const counts = {};
            registrations.forEach(reg => {
                counts[reg.workshopTitle] = (counts[reg.workshopTitle] || 0) + (reg.seatsBooked || 1);
            });
            const formatted = [["Workshop", "Seats Booked"]];
            Object.keys(counts).forEach(key => {
                formatted.push([key, counts[key]]);
            });
            setChartData(formatted);
        }
    }, [registrations]);

    // --- FETCH FUNCTIONS ---
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
    
    // --- INQUIRY FETCH & DELETE ---
    const fetchInquiries = async () => {
        setLoadingInquiries(true);
        try {
            const res = await axios.get('http://localhost:5000/api/corporate');
            setInquiries(res.data);
        } catch (err) {
            console.error("Error fetching inquiries", err);
        }
        setLoadingInquiries(false);
    };

    const handleDeleteInquiry = async (id) => {
        if(!window.confirm("Are you sure you want to delete this inquiry?")) return;
        
        try {
            const res = await axios.delete(`http://localhost:5000/api/corporate/${id}`);
            if(res.data.success) {
                // Remove from state immediately
                setInquiries(inquiries.filter(item => item._id !== id));
            }
        } catch (err) {
            alert("Failed to delete");
        }
    };

    // --- HANDLERS ---
    const handleAddNews = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', newsForm.title);
        data.append('description', newsForm.description);
        if (newsImage) data.append('image', newsImage);
        try {
            await axios.post('http://localhost:5000/api/content/news/add', data);
            alert("News Added!"); fetchContent();
            setNewsForm({ title: '', description: '' }); setNewsImage(null);
        } catch (err) { alert("Error adding news"); }
    };
    const handleDeleteNews = async (id) => {
        if (!window.confirm("Delete this news?")) return;
        await axios.delete(`http://localhost:5000/api/content/news/${id}`); fetchContent();
    };
    const handleAddTestimonial = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', testForm.name);
        data.append('message', testForm.message);
        data.append('designation', testForm.designation);
        if (testMedia) data.append('media', testMedia);
        try {
            await axios.post('http://localhost:5000/api/content/testimonials/add', data);
            alert("Testimonial Added!"); fetchContent();
            setTestForm({ name: '', message: '', designation: '' }); setTestMedia(null);
        } catch (err) { alert("Error adding testimonial"); }
    };
    const handleDeleteTestimonial = async (id) => {
        if (!window.confirm("Delete this review?")) return;
        await axios.delete(`http://localhost:5000/api/content/testimonials/${id}`); fetchContent();
    };
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
            setWsForm({ title: '', date: '', seats: '', description: '', category: 'GROUP' }); setWsImage(null);
        } catch (err) { alert("Error adding workshop"); }
    };
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
            setName(''); setPrice(''); setDescription(''); setFiles([]); fetchProducts();
        } catch (err) { alert("Error adding product"); }
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
            await axios.post(`http://localhost:5000/api/orders/${id}/cancel`, { isAdmin: true });
            fetchOrders();
        } catch (err) { alert("Error cancelling"); }
    };

    // --- HELPER: Service Type Badge Color ---
    const getBadgeColor = (type) => {
        switch(type) {
            case 'Gifting': return '#E8F5E9'; // Green-ish
            case 'Workshop': return '#E3F2FD'; // Blue-ish
            case 'Collaboration': return '#F3E5F5'; // Purple-ish
            default: return '#FFF3E0'; // Orange-ish
        }
    };

    const getBadgeTextColor = (type) => {
        switch(type) {
            case 'Gifting': return '#2E7D32';
            case 'Workshop': return '#1565C0';
            case 'Collaboration': return '#7B1FA2';
            default: return '#EF6C00';
        }
    };

    // --- STYLES OBJECT ---
    const styles = {
        container: { display: 'flex', minHeight: '100vh', fontFamily: "'Lato', sans-serif", background: palette.lightSand },
        sidebar: {
            width: '280px',
            background: `linear-gradient(180deg, ${palette.sidebarBg} 0%, #1a100a 100%)`,
            color: palette.sand,
            display: 'flex',
            flexDirection: 'column',
            padding: '30px 20px',
            boxShadow: '5px 0 15px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 100
        },
        mainContent: {
            flex: 1,
            padding: '40px 60px',
            overflowY: 'auto'
        },
        menuItem: (isActive) => ({
            padding: '16px 24px',
            marginBottom: '12px',
            cursor: 'pointer',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1.05rem',
            transition: 'all 0.3s ease',
            background: isActive ? 'rgba(237, 216, 180, 0.15)' : 'transparent',
            color: isActive ? palette.white : palette.sand,
            borderLeft: isActive ? `4px solid ${palette.flame}` : `4px solid transparent`,
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            opacity: isActive ? 1 : 0.7
        }),
        header: { 
            color: palette.deep, 
            fontFamily: "'Playfair Display', serif",
            fontWeight: '700',
            borderBottom: `1px solid ${palette.border}`, 
            paddingBottom: '20px', 
            marginBottom: '40px', 
            fontSize: '2.5rem',
            letterSpacing: '-0.5px'
        },
        card: { 
            background: palette.white, 
            padding: '35px', 
            borderRadius: '16px', 
            marginBottom: '35px', 
            border: `1px solid ${palette.border}`, 
            boxShadow: '0 8px 30px rgba(68, 45, 28, 0.04)' 
        },
        cardHeader: {
            color: palette.ember, 
            marginTop: 0, 
            marginBottom: '25px', 
            fontSize: '1.4rem', 
            fontFamily: "'Playfair Display', serif",
            borderBottom: `1px dashed ${palette.sand}`,
            paddingBottom: '15px'
        },
        input: { 
            padding: '14px 16px', 
            borderRadius: '8px', 
            border: `1px solid #ddd`, 
            backgroundColor: '#FAFAFA', 
            width: '100%', 
            boxSizing: 'border-box',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border 0.3s'
        },
        btnPrimary: { 
            background: `linear-gradient(135deg, ${palette.flame} 0%, ${palette.copper} 100%)`, 
            color: 'white', 
            padding: '14px 24px', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            fontSize: '1rem',
            cursor: 'pointer', 
            width: '100%', 
            marginTop: '15px',
            boxShadow: '0 4px 12px rgba(200, 84, 40, 0.3)',
            transition: 'transform 0.2s'
        },
        btnDanger: { 
            background: '#fff0f0', 
            color: '#d32f2f', 
            padding: '6px 14px', 
            border: '1px solid #ffcdd2', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600'
        },
        btnAction: { 
            background: palette.deep, 
            color: 'white', 
            padding: '8px 16px', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontSize: '0.85rem',
            fontWeight: '600' 
        },
        tableHead: { 
            background: palette.lightSand, 
            color: palette.deep, 
            textAlign: 'left',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.1rem'
        }
    };

    return (
        <div id="admin-container" style={styles.container}>
            {/* INJECT GOOGLE FONTS & CUSTOM CSS */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@400;700&display=swap');
                
                /* Layouts */
                .form-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
                .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
                .inquiries-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
                
                /* Tables */
                .table-container { overflow-x: auto; border-radius: 12px; border: 1px solid ${palette.border}; }
                table { width: 100%; border-collapse: collapse; min-width: 900px; }
                th { padding: 18px 24px; border-bottom: 2px solid ${palette.border}; font-weight: 700; }
                td { padding: 18px 24px; border-bottom: 1px solid ${palette.border}; vertical-align: top; color: #444; }
                tr:last-child td { border-bottom: none; }
                tr:hover { background-color: #faf8f5; }

                /* Inputs & Interactions */
                input:focus, textarea:focus, select:focus { border-color: ${palette.copper} !important; background-color: #fff !important; box-shadow: 0 0 0 3px rgba(142, 80, 34, 0.1); }
                button:hover { opacity: 0.95; transform: translateY(-1px); }
                button:active { transform: translateY(1px); }
                
                /* Utilities */
                .full-width { grid-column: 1 / -1; }
                .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
                .badge-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
                .badge-warn { background: #fff8e1; color: #f57f17; border: 1px solid #ffe0b2; }
                .badge-error { background: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }

                /* Inquiries Specific Styles */
                .inquiry-card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #EEE; transition: 0.2s; position: relative; }
                .inquiry-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
                .company-name { font-size: 1.1rem; font-weight: 600; color: ${palette.deep}; margin: 0; }
                .contact-person { font-size: 0.9rem; color: #888; }
                .contact-row { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #666; margin-bottom: 5px; }
                .card-body { font-size: 0.95rem; color: #555; margin-bottom: 20px; line-height: 1.6; background: #FAFAFA; padding: 15px; border-radius: 8px; }
                .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #EEE; padding-top: 15px; margin-top: 15px; }
                .action-btn { padding: 8px; border-radius: 6px; border: none; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 5px; font-size: 0.85rem; }
                .btn-email { background: ${palette.lightSand}; color: ${palette.copper}; text-decoration: none; }
                .btn-email:hover { background: #EEE; }
                .btn-delete-icon { background: #FFEBEE; color: #D32F2F; }
                .btn-delete-icon:hover { background: #FFCDD2; }

                /* Responsive */
                @media (min-width: 900px) { .form-grid { grid-template-columns: 1fr 1fr; } }
                @media (max-width: 900px) {
                    #admin-container { flex-direction: column; }
                    .admin-sidebar { width: 100% !important; height: auto !important; position: relative !important; padding: 15px !important; flex-direction: row !important; overflow-x: auto; white-space: nowrap; align-items: center; background: ${palette.sidebarBg} !important; }
                    .admin-sidebar h2 { display: none; }
                    .admin-content { padding: 20px !important; }
                    .menu-item-wrapper { display: flex; gap: 10px; margin-bottom: 0 !important; }
                }
            `}</style>

            <div className="admin-sidebar" style={styles.sidebar}>
                <h2 style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: '2rem', 
                    marginBottom: '50px', 
                    textAlign: 'center', 
                    color: palette.sand,
                    letterSpacing: '1px'
                }}>
                    Basho Admin
                </h2>
                <div className="menu-item-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <div style={styles.menuItem(activeTab === 'products')} onClick={() => setActiveTab('products')}>🛍️ Products</div>
                    <div style={styles.menuItem(activeTab === 'workshops')} onClick={() => setActiveTab('workshops')}>📅 Workshops</div>
                    <div style={styles.menuItem(activeTab === 'inquiries')} onClick={() => setActiveTab('inquiries')}>📅 Corporate Inquiries</div>
                    <div style={styles.menuItem(activeTab === 'orders')} onClick={() => setActiveTab('orders')}>📦 Orders</div>
                    <div style={styles.menuItem(activeTab === 'content')} onClick={() => setActiveTab('content')}>📝 Content</div>
                </div>
            </div>

            <div className="admin-content" style={styles.mainContent}>
                
                {/* 5. INQUIRIES TAB (New) */}
                {activeTab === 'inquiries' && (
                    <>
                        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ ...styles.header, marginBottom: 0, borderBottom: 'none' }}>Corporate Requests</h2>
                            <div style={{color: '#888'}}>Total: {inquiries.length}</div>
                        </div>

                        {loadingInquiries ? (
                            <p>Loading...</p>
                        ) : inquiries.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '60px', color: '#999', background: 'white', borderRadius: '12px'}}>
                                <p>No business inquiries yet.</p>
                            </div>
                        ) : (
                            <div className="inquiries-grid">
                                {inquiries.map(inq => (
                                    <div key={inq._id} className="inquiry-card">
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                            <div>
                                                <h3 className="company-name">{inq.companyName}</h3>
                                                <span className="contact-person">{inq.contactPerson}</span>
                                            </div>
                                            <span 
                                                className="badge" 
                                                style={{ 
                                                    backgroundColor: getBadgeColor(inq.serviceType),
                                                    color: getBadgeTextColor(inq.serviceType)
                                                }}
                                            >
                                                {inq.serviceType}
                                            </span>
                                        </div>

                                        <div className="contact-row">
                                            ✉️ {inq.email}
                                        </div>
                                        <div className="contact-row" style={{marginBottom: '15px'}}>
                                            📞 {inq.phone}
                                        </div>

                                        {inq.message && (
                                            <div className="card-body">
                                                "{inq.message}"
                                            </div>
                                        )}

                                        <div className="card-footer">
                                            <span style={{ fontSize: '0.85rem', color: '#AAA' }}>
                                                📅 {new Date(inq.createdAt).toLocaleDateString()}
                                            </span>
                                            
                                            <div style={{display: 'flex', gap: '10px'}}>
                                                <a href={`mailto:${inq.email}`} className="action-btn btn-email">
                                                    ✉️ Reply
                                                </a>
                                                <button 
                                                    onClick={() => handleDeleteInquiry(inq._id)} 
                                                    className="action-btn btn-delete-icon"
                                                    title="Delete Inquiry"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* 1. PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <>
                        <h1 style={styles.header}>Product Inventory</h1>
                        <div style={styles.card}>
                            <h3 style={styles.cardHeader}>Add New Product</h3>
                            <form onSubmit={handleSubmit} className="form-grid">
                                <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
                                <input type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required style={styles.input} />
                                <div className="full-width">
                                    <textarea placeholder="Product Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ ...styles.input, height: '100px', resize: 'vertical' }} />
                                </div>
                                <div className="full-width">
                                    <label style={{ display: 'block', marginBottom: '8px', color: palette.deep, fontWeight: 'bold' }}>Upload Images</label>
                                    <input type="file" multiple onChange={handleFileChange} accept="image/*" style={{...styles.input, padding: '10px'}} />
                                </div>
                                <div className="full-width">
                                    <button type="submit" style={styles.btnPrimary}>Create Product</button>
                                </div>
                            </form>
                        </div>
                        <div style={{color: '#888', fontStyle: 'italic', textAlign:'right'}}>Total Products in Catalog: <strong>{products.length}</strong></div>
                    </>
                )}

                {/* 2. WORKSHOPS TAB */}
                {activeTab === 'workshops' && (
                    <>
                        <h1 style={styles.header}>Workshop Manager</h1>
                        
                        {/* CHART SECTION */}
                        <div style={styles.card}>
                            <h3 style={styles.cardHeader}>📊 Booking Analytics</h3>
                            {registrations.length > 0 ? (
                                <Chart
                                    chartType="PieChart"
                                    data={chartData}
                                    options={{
                                        title: "",
                                        is3D: true,
                                        backgroundColor: 'transparent',
                                        colors: [palette.flame, palette.copper, palette.ember, '#D7CCC8', palette.deep],
                                        chartArea: { width: '95%', height: '85%' },
                                        legend: { position: 'right', textStyle: { fontSize: 14 } }
                                    }}
                                    width={"100%"}
                                    height={"350px"}
                                />
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#999', background: '#f9f9f9', borderRadius: '8px' }}>
                                    No booking data available to display charts.
                                </div>
                            )}
                        </div>

                        <div style={styles.card}>
                            <h3 style={styles.cardHeader}>Schedule New Workshop</h3>
                            <form onSubmit={handleAddWorkshop} className="form-grid">
                                <input placeholder="Workshop Title" value={wsForm.title} onChange={e => setWsForm({ ...wsForm, title: e.target.value })} required style={styles.input} />
                                <input type="datetime-local" value={wsForm.date} onChange={e => setWsForm({ ...wsForm, date: e.target.value })} required style={styles.input} />
                                <select value={wsForm.category} onChange={e => setWsForm({ ...wsForm, category: e.target.value })} style={styles.input}>
                                    <option value="GROUP">Group Workshop</option>
                                    <option value="ONE-ON-ONE">One-on-One Session</option>
                                </select>
                                <input type="number" placeholder="Total Seats" value={wsForm.seats} onChange={e => setWsForm({ ...wsForm, seats: e.target.value })} required style={styles.input} />
                                <div className="full-width">
                                    <input type="file" onChange={e => setWsImage(e.target.files[0])} style={{...styles.input, padding: '10px'}} />
                                </div>
                                <div className="full-width">
                                    <textarea placeholder="Description & Details" value={wsForm.description} onChange={e => setWsForm({ ...wsForm, description: e.target.value })} style={{ ...styles.input, height: '80px' }} />
                                </div>
                                <div className="full-width">
                                    <button type="submit" style={styles.btnPrimary}>Publish Workshop</button>
                                </div>
                            </form>
                        </div>

                        <h2 style={{color: palette.deep, fontFamily: "'Playfair Display', serif", marginTop:'40px'}}>Recent Registrations</h2>
                        <div className="table-container">
                            <table style={{background: 'white'}}>
                                <thead style={styles.tableHead}>
                                    <tr>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Contact</th>
                                        <th>Workshop</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map((reg) => (
                                        <tr key={reg._id}>
                                            <td>{new Date(reg.bookedAt).toLocaleDateString()}</td>
                                            <td style={{ fontWeight: 'bold', color: palette.deep }}>{reg.userName}</td>
                                            <td>
                                                <div style={{ color: palette.flame }}>{reg.userEmail}</div>
                                                {reg.phone && <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>📞 {reg.phone}</div>}
                                            </td>
                                            <td><span className="badge badge-warn">{reg.workshopTitle}</span></td>
                                            <td>
                                                <strong>{reg.seatsBooked} Seat(s)</strong><br/>
                                                {reg.experience && <span style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>Exp: {reg.experience}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* 3. ORDERS TAB */}
                {activeTab === 'orders' && (
                    <>
                        <h1 style={styles.header}>Order Management</h1>
                        <div style={styles.card}>
                            {orders.length === 0 ? <p style={{textAlign:'center', padding:'40px', color:'#999'}}>No orders received yet.</p> : (
                                <div className="table-container">
                                    <table>
                                        <thead style={styles.tableHead}>
                                            <tr>
                                                <th>Date</th>
                                                <th style={{ width: '25%' }}>Customer</th>
                                                <th style={{ width: '30%' }}>Order Details</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id} style={{ background: order.status === 'CANCELLED' ? '#fafafa' : 'white', opacity: order.status === 'CANCELLED' ? 0.7 : 1 }}>
                                                    <td style={{ textAlign: 'center', fontSize:'0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <div style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom:'4px' }}>{order.customerName}</div>
                                                        <div style={{ color: palette.flame, fontSize:'0.9rem' }}>{order.email}</div>
                                                        <div style={{fontSize:'0.9rem'}}>📞 {order.phone}</div>
                                                        <div style={{ marginTop: '8px', background: palette.lightSand, padding: '8px', borderRadius: '6px', border: `1px solid ${palette.border}`, fontSize:'0.85rem' }}>
                                                            📍 {order.address}, {order.city} - {order.zip}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {order.orderType === 'STANDARD' ? (
                                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                                {order.productImage ? (
                                                                    <img src={`http://localhost:5000/uploads/${order.productImage}`} alt="prod" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: `1px solid #eee`, boxShadow:'0 2px 5px rgba(0,0,0,0.05)' }} />
                                                                ) : <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '8px' }}></div>}
                                                                <div>
                                                                    <strong style={{fontSize:'1.1rem', color: palette.deep}}>{order.productName}</strong><br />
                                                                    <span style={{ color: palette.ember, fontWeight: 'bold', fontSize:'1rem' }}>₹{order.amount}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ background: '#FFF8E1', padding: '12px', borderRadius: '8px', border: `1px solid #FFECB3` }}>
                                                                <strong style={{ color: '#F57F17', letterSpacing:'1px', fontSize:'0.8rem' }}>★ CUSTOM REQUEST</strong>
                                                                <p style={{ margin: '8px 0', fontSize: '0.9rem', color: palette.deep }}>
                                                                    <b>Desc:</b> {order.customDetails?.description}<br />
                                                                    <b>Mat:</b> {order.customDetails?.material}
                                                                </p>
                                                                {order.customImages && order.customImages.length > 0 && (
                                                                    <div style={{ marginTop: '5px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                                        {order.customImages.map((img, idx) => (
                                                                            <a key={idx} href={`http://localhost:5000/uploads/${img}`} target="_blank" rel="noreferrer">
                                                                                <img src={`http://localhost:5000/uploads/${img}`} alt="ref" style={{ width: '40px', height: '40px', objectFit: 'cover', border: `1px solid ${palette.copper}`, borderRadius: '6px' }} />
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {order.status === 'CANCELLED' ? <span className="badge badge-error">CANCELLED</span> :
                                                            order.trackingStatus === 'Delivered' ? <span className="badge badge-success">✓ COMPLETED</span> :
                                                                (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                                                        <span className="badge badge-warn" style={{color: palette.deep, border:'1px solid #ddd', background:'#fff'}}>{order.trackingStatus}</span>
                                                                        {(() => {
                                                                            const stages = ['Processing', 'Shipped', 'Reached at final station', 'Out for delivery', 'Delivered'];
                                                                            const next = stages[stages.indexOf(order.trackingStatus) + 1];
                                                                            if (next) return <button onClick={() => updateTracking(order._id, next)} style={styles.btnAction}>Mark "{next}"</button>;
                                                                        })()}
                                                                    </div>
                                                                )
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {order.status !== 'CANCELLED' && order.trackingStatus !== 'Delivered' &&
                                                            <button onClick={() => cancelOrder(order._id)} style={styles.btnDanger}>Cancel Order</button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* 4. CONTENT TAB */}
                {activeTab === 'content' && (
                    <>
                        <h1 style={styles.header}>Site Content & CMS</h1>
                        <div style={styles.card}>
                            <h3 style={styles.cardHeader}>📢 News & Announcements</h3>
                            <form onSubmit={handleAddNews} className="form-grid" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: `1px dashed ${palette.sand}` }}>
                                <input placeholder="News Headline" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} required style={styles.input} />
                                <input type="file" onChange={e => setNewsImage(e.target.files[0])} style={{...styles.input, padding:'10px'}} />
                                <div className="full-width">
                                    <textarea placeholder="Write your announcement..." value={newsForm.description} onChange={e => setNewsForm({ ...newsForm, description: e.target.value })} required style={{ ...styles.input, height: '80px' }} />
                                </div>
                                <div className="full-width"><button type="submit" style={styles.btnPrimary}>Post News</button></div>
                            </form>
                            <div className="news-grid">
                                {newsList.map(item => (
                                    <div key={item._id} style={{ border: `1px solid ${palette.border}`, borderRadius: '12px', background: '#fff', overflow:'hidden', boxShadow:'0 4px 10px rgba(0,0,0,0.03)' }}>
                                        {item.image && <img src={`http://localhost:5000/uploads/${item.image}`} alt="news" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
                                        <div style={{padding:'20px'}}>
                                            <h4 style={{ color: palette.deep, margin: '0 0 10px', fontSize:'1.2rem', fontFamily: "'Playfair Display', serif" }}>{item.title}</h4>
                                            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>{item.description.substring(0, 80)}...</p>
                                            <button onClick={() => handleDeleteNews(item._id)} style={{ ...styles.btnDanger, width: '100%', marginTop:'10px' }}>Remove Post</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.card}>
                            <h3 style={styles.cardHeader}>💬 Customer Testimonials</h3>
                            <form onSubmit={handleAddTestimonial} className="form-grid" style={{ marginBottom: '20px' }}>
                                <input placeholder="Client Name" value={testForm.name} onChange={e => setTestForm({ ...testForm, name: e.target.value })} required style={styles.input} />
                                <input placeholder="Role (e.g. Student, Buyer)" value={testForm.designation} onChange={e => setTestForm({ ...testForm, designation: e.target.value })} style={styles.input} />
                                <div className="full-width">
                                    <input type="file" accept="image/*,video/*" onChange={e => setTestMedia(e.target.files[0])} style={{...styles.input, padding:'10px'}} />
                                </div>
                                <div className="full-width">
                                    <textarea placeholder="Client's Feedback" value={testForm.message} onChange={e => setTestForm({ ...testForm, message: e.target.value })} required style={{ ...styles.input, height: '80px' }} />
                                </div>
                                <div className="full-width"><button type="submit" style={styles.btnPrimary}>Add Testimonial</button></div>
                            </form>

                            <div className="table-container">
                                <table>
                                    <thead style={styles.tableHead}>
                                        <tr>
                                            <th>Client</th>
                                            <th>Feedback</th>
                                            <th>Media Attachment</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testList.map(t => (
                                            <tr key={t._id}>
                                                <td>
                                                    <strong style={{color: palette.deep, fontSize:'1.05rem'}}>{t.name}</strong><br />
                                                    <span style={{ fontSize: '0.85em', color: palette.copper, fontWeight:'bold' }}>{t.designation}</span>
                                                </td>
                                                <td style={{fontStyle:'italic', color:'#555'}}>"{t.message}"</td>
                                                <td>{t.mediaType !== 'none' ? <span className="badge badge-success">✔ {t.mediaType}</span> : <span style={{color:'#ccc'}}>-</span>}</td>
                                                <td><button onClick={() => handleDeleteTestimonial(t._id)} style={styles.btnDanger}>Delete</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;