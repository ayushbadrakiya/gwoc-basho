import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const palette = {
  deep: '#442D1C',
  ember: '#652810',
  copper: '#8E5022',
  flame: '#C85428',
  sand: '#EDD8B4'
};

const Orders = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track which product is being bought
  const [addressForm, setAddressForm] = useState({ address: '', phone: '', city: '', zip: '' }); // Form Data
  const user = JSON.parse(localStorage.getItem('user')); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
        console.error(err);
    }
  };

  // 1. User Clicks "Buy Now" -> Open Form
  const initiateBuy = (product) => {
    if (!user) {
        alert("Please Login first!");
        window.location.href = '/login';
        return;
    }
    setSelectedProduct(product); // Show modal
  };

  // 2. User Submits Address -> Process Order
  const confirmOrder = async (e) => {
    e.preventDefault();
    if(!selectedProduct) return;

    try {
      const payload = {
        customerName: user.name,
        email: user.email, 
        amount: selectedProduct.price,
        orderType: 'STANDARD',
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        ...addressForm // Spread address fields
      };

      const res = await axios.post('http://localhost:5000/api/buy', payload);
      
      if (res.data.success) {
        alert(`Order Placed! We will ship to ${addressForm.city}.`);
        setProducts(products.filter(p => p._id !== selectedProduct._id)); // Remove from screen
        setSelectedProduct(null); // Close modal
        setAddressForm({ address: '', phone: '', city: '', zip: '' }); // Reset form
      }
    } catch (error) {
      alert("Order failed.");
    }
  };

  return (
    <div style={{ padding: '20px', background: 'linear-gradient(180deg, rgba(237,216,180,0.45), rgba(237,216,180,0.15))', minHeight: '100vh' }}>
      <h2 style={{ color: palette.deep, letterSpacing: '0.5px' }}>Available Products</h2>
      {products.length === 0 ? <p>No products available.</p> : (
        <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((p) => (
            <div 
              key={p._id} 
              className="orders-card"
              style={{ 
                border: `1px solid rgba(68,45,28,0.15)`, 
                padding: '15px', 
                borderRadius: '12px', 
                transition: 'box-shadow 0.3s, transform 0.2s', 
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 10px 24px rgba(68,45,28,0.08)'
              }}
            >
              
              {/* --- LINK TO DETAILS PAGE --- */}
              <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    // CHECK FOR NEW IMAGE ARRAY vs OLD STRING
                    src={p.images && p.images.length > 0 
                        ? `http://localhost:5000/uploads/${p.images[0]}` 
                        : (p.image || 'https://via.placeholder.com/150')} 
                    alt={p.name} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                  <h3 style={{ margin: '10px 0 5px 0', color: palette.ember }}>{p.name}</h3>
              </Link>
              
              <p style={{ color: palette.copper, fontSize: '0.9rem' }}>
                {p.description ? p.description.substring(0, 60) + "..." : "No description"}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: palette.deep }}>₹{p.price}</h4>
                  <button 
                      onClick={() => initiateBuy(p)}
                      style={{ 
                        background: `linear-gradient(135deg, ${palette.flame}, ${palette.copper})`, 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 16px', 
                        cursor: 'pointer', 
                        borderRadius: '999px', 
                        fontWeight: 'bold',
                        boxShadow: '0 8px 16px rgba(200,84,40,0.25)'
                      }}
                  >
                      Buy Now
                  </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- SHIPPING ADDRESS MODAL --- */}
      {selectedProduct && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(68,45,28,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-box" style={{ background: palette.sand, padding: '30px', borderRadius: '14px', minWidth: '320px', boxShadow: '0 12px 28px rgba(68,45,28,0.25)', border: `1px solid ${palette.copper}30` }}>
                <h3 style={{ marginTop: 0, color: palette.deep }}>Shipping Details for {selectedProduct.name}</h3>
                <form onSubmit={confirmOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input required placeholder="Street Address" value={addressForm.address} onChange={e=>setAddressForm({...addressForm, address: e.target.value})} style={{padding: '10px', borderRadius: '8px', border: `1px solid ${palette.copper}40`}} />
                    <input required placeholder="City" value={addressForm.city} onChange={e=>setAddressForm({...addressForm, city: e.target.value})} style={{padding: '10px', borderRadius: '8px', border: `1px solid ${palette.copper}40`}} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input required placeholder="Zip Code" value={addressForm.zip} onChange={e=>setAddressForm({...addressForm, zip: e.target.value})} style={{padding: '10px', width: '100%', borderRadius: '8px', border: `1px solid ${palette.copper}40`}} />
                        <input required placeholder="Phone" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone: e.target.value})} style={{padding: '10px', width: '100%', borderRadius: '8px', border: `1px solid ${palette.copper}40`}} />
                    </div>
                    
                    <button type="submit" style={{ background: palette.flame, color: 'white', padding: '12px', border: 'none', cursor: 'pointer', marginTop: '10px', borderRadius: '10px', fontWeight: '600' }}>Confirm Purchase</button>
                    <button type="button" onClick={() => setSelectedProduct(null)} style={{ background: palette.ember, color: 'white', padding: '12px', border: 'none', cursor: 'pointer', borderRadius: '10px' }}>Cancel</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Orders;