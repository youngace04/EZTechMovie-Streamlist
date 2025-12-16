// src/components/Subscriptions.js
import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import list from '../data';
import './Subscriptions.css';

// Removed debug logs

function Subscriptions() {
  const [cart, setCart] = useLocalStorage('cart.items', []);
  const [warning, setWarning] = useState('');

  // show warning state only

  const addToCart = (item) => {
    setWarning('');
    const isSubscription = item.id <= 4;
    const existingItem = cart.find((c) => c.id === item.id);

    if (isSubscription && existingItem) {
      setWarning(`Warning: Only one ${item.service} subscription is allowed at a time.`);
      return;
    }

    if (item.amount <= 0) {
      setWarning(`Warning: ${item.service} is out of stock.`);
      return;
    }

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > item.amount) {
        setWarning(`Warning: Only ${item.amount} ${item.service} available.`);
        return;
      }
      setCart((prev) =>
        prev.map((c) =>
          c.id === item.id ? { ...c, quantity: newQuantity } : c
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div className="subscriptions-container">
      <h1>Subscriptions & Accessories</h1>
      {warning && <div className="warning">{warning}</div>}
      <div className="grid">
        {list.map((item) => {
          return (
            <div key={item.id} className="item-card">
              <img src={item.img} alt={item.service} />
              <h3>{item.service}</h3>
              <p>{item.serviceInfo}</p>
              <p className="price">${item.price.toFixed(2)}</p>
              <p className="stock">In Stock: {item.amount}</p>
              <button 
                onClick={() => addToCart(item)} 
                className="add-button"
                disabled={item.amount <= 0}
              >
                {item.amount <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Subscriptions;