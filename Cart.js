
// src/components/Cart.js
import { useNavigate, Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import './Cart.css';

function Cart() {
  const [cart, setCart] = useLocalStorage('cart.items', []);
  const navigate = useNavigate();

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    // Subscriptions (ID <= 4) limited to quantity 1
    const item = cart.find((c) => c.id === id);
    if (item && item.id <= 4 && newQuantity > 1) {
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: newQuantity } : c))
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const totalItems = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="container app cart-page">
        <div className="section-header section-header-accent">
          <h2>Shopping Cart</h2>
          <div className="section-subtitle">Your items will appear here</div>
        </div>

        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-secondary">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container app cart-page">
      <div className="section-header section-header-accent">
        <h2>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h2>
        <div className="section-subtitle">Review your selections before checkout</div>
      </div>

      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            {/* Left: image */}
            <div className="cart-item-image-wrap">
              <img
                className="cart-item-image"
                src={item.imageUrl || item.img || '/images/subscriptions-fallback.jpg'}
                alt={item.service}
              />
            </div>

            {/* Middle: details */}
            <div className="cart-item-details stack-12">
              <h3 className="cart-item-title">{item.service}</h3>
              {item.serviceInfo && (
                <p className="cart-item-info">{item.serviceInfo}</p>
              )}
              <div className="cart-item-price">
                ${Number(item.price).toFixed(2)} each
              </div>
            </div>

            {/* Right: quantity controls + line total + remove */}
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                  onClick={() =>
                    updateQuantity(item.id, (Number(item.quantity) || 0) - 1)
                  }
                  className="qty-btn"
                  aria-label={`Decrease quantity of ${item.service}`}
                  title="Decrease"
                >
                  −
                </button>

                <span className="qty" aria-live="polite">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, (Number(item.quantity) || 0) + 1)
                  }
                  className="qty-btn"
                  aria-label={`Increase quantity of ${item.service}`}
                  title="Increase"
                  disabled={item.id <= 4 && Number(item.quantity) >= 1}
                >
                  +
                </button>
              </div>

              <div className="line-total">
                ${(
                  (Number(item.price) || 0) *
                  (Number(item.quantity) || 0)
                ).toFixed(2)}
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="remove-btn"
                aria-label={`Remove ${item.service}`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <div className="summary-left">
          <h3 className="summary-title">Order Summary</h3>
          <p className="summary-subtitle">
            Total reflects item prices and quantities
          </p>
        </div>
        <div className="summary-right">
          <div className="grand-total">Total: ${totalPrice.toFixed(2)}</div>
          <div className="cart-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/cards')}
            >
              Checkout
            </button>
            <Link to="/" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
