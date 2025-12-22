import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    <div style={{ padding: '20px' }}>
      <h2>Available Products</h2>
      {products.length === 0 ? <p>No products available.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((p) => (
            <div key={p._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', transition: 'box-shadow 0.3s' }}>
              
              {/* --- LINK TO DETAILS PAGE --- */}
              <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img 
                    // CHECK FOR NEW IMAGE ARRAY vs OLD STRING
                    src={p.images && p.images.length > 0 
                        ? `http://localhost:5000/uploads/${p.images[0]}` 
                        : (p.image || 'https://via.placeholder.com/150')} 
                    alt={p.name} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                  <h3 style={{ margin: '10px 0 5px 0', color: '#007bff' }}>{p.name}</h3>
              </Link>
              
              <p style={{ color: '#555', fontSize: '0.9rem' }}>
                {p.description ? p.description.substring(0, 60) + "..." : "No description"}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>₹{p.price}</h4>
                  <button 
                      onClick={() => initiateBuy(p)}
                      style={{ background: '#ffa41c', color: 'black', border: '1px solid #a88734', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
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
            background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', minWidth: '320px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                <h3>Shipping Details for {selectedProduct.name}</h3>
                <form onSubmit={confirmOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input required placeholder="Street Address" value={addressForm.address} onChange={e=>setAddressForm({...addressForm, address: e.target.value})} style={{padding: '8px'}} />
                    <input required placeholder="City" value={addressForm.city} onChange={e=>setAddressForm({...addressForm, city: e.target.value})} style={{padding: '8px'}} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input required placeholder="Zip Code" value={addressForm.zip} onChange={e=>setAddressForm({...addressForm, zip: e.target.value})} style={{padding: '8px', width: '100%'}} />
                        <input required placeholder="Phone" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone: e.target.value})} style={{padding: '8px', width: '100%'}} />
                    </div>
                    
                    <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', marginTop: '10px' }}>Confirm Purchase</button>
                    <button type="button" onClick={() => setSelectedProduct(null)} style={{ background: '#dc3545', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Orders;