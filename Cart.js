// src/components/Cart.js
import useLocalStorage from '../hooks/useLocalStorage';
import './Cart.css';

function Cart() {
  const [cart, setCart] = useLocalStorage('cart.items', []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    // For subscriptions (ID <=4), prevent quantity >1
    const item = cart.find((c) => c.id === id);
    if (item && item.id <= 4 && newQuantity > 1) {
      return; // Silently prevent, or could add a message
    }

    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: newQuantity } : c))
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p>Your cart is empty. <a href="/">Start shopping</a>.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart ({totalItems} items)</h1>
      <ul className="cart-items">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={item.img} alt={item.service} className="item-image" />
            <div className="item-details">
              <h3>{item.service}</h3>
              <p>{item.serviceInfo}</p>
              <p className="item-price">${item.price.toFixed(2)} each</p>
            </div>
            <div className="quantity-controls">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="qty-btn"
              >
                -
              </button>
              <span className="qty">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>
            <div className="line-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="remove-btn"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h2>Total: ${totalPrice.toFixed(2)}</h2>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}

export default Cart;