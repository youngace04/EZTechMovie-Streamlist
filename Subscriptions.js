
import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import list from '../data';
import './Subscriptions.css';

function Subscriptions() {
  const [cart, setCart] = useLocalStorage('cart.items', []);
  const [warning, setWarning] = useState('');

  const addToCart = (item) => {
    setWarning('');

    const isSubscription = item.id <= 4;
    const existingItem = cart.find((c) => c.id === item.id);

    // Enforce single subscription for id <= 4
    if (isSubscription && existingItem) {
      setWarning(`Warning: Only one ${item.service} subscription is allowed at a time.`);
      return;
    }

    // Out of stock guard
    if (item.amount <= 0) {
      setWarning(`Warning: ${item.service} is out of stock.`);
      return;
    }

    if (existingItem) {
      const newQuantity = (existingItem.quantity || 0) + 1;

      // Cap by available amount
      if (newQuantity > item.amount) {
        setWarning(`Warning: Only ${item.amount} ${item.service} available.`);
        return;
      }

      // Update quantity
      setCart((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, quantity: newQuantity } : c))
      );
    } else {
      // Add new item with quantity 1
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  // Optional fallback image if an item is missing imageUrl
  const getImageSrc = (item) =>
    item.imageUrl || '/images/subscriptions-fallback.jpg';

  return (
    <div className="subscriptions-container">
      {/* Hero header accent (uses global styles from App.css if present) */}
      <div className="section-header section-header-accent" style={{ marginBottom: '1.25rem' }}>
        <h2>Subscriptions & Accessories</h2>
        <div className="section-subtitle">Choose your plan and add-ons</div>
      </div>

      {warning && <div className="warning">{warning}</div>}

      <div className="grid">
        {list.map((item) => (
          <div key={item.id} className="item-card">
            {/* Image area (optional) */}
            <img src={getImageSrc(item)} alt={item.service} />

            {/* Content */}
            <h3>{item.service}</h3>
            {item.serviceInfo && <p>{item.serviceInfo}</p>}

            <div className="price">${Number(item.price).toFixed(2)}</div>
            <div className="stock">In Stock: {item.amount}</div>

            <button
              className="add-button"
              onClick={() => addToCart(item)}
              disabled={item.amount <= 0}
            >
              {item.amount <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;
