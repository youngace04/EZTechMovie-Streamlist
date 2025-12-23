
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import useLocalStorage from '../../hooks/useLocalStorage';
import AddCard from './AddCard';
import './CreditCard.css';

export default function CreditCards() {
  // Saved cards (mask-only, localStorage)
  const [cards, setCards] = useLocalStorage('cards.store.v1', []);
  // Current Cart
  const [cart, setCart] = useLocalStorage('cart.items', []);
  // Orders History
  const [orders, setOrders] = useLocalStorage('orders.history.v1', []);
  // UI state
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState(null); // last order summary

  // Compute totals
  const { totalItems, totalPrice } = useMemo(() => {
    const items = Array.isArray(cart) ? cart : [];
    const totalItems = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const totalPrice = items.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
      0
    );
    return { totalItems, totalPrice };
  }, [cart]);

  // Helpful UX: preselect first card
  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards, selectedCardId]);

  const removeCard = (id) => setCards(prev => prev.filter(c => c.id !== id));

  // ---- MOCK PAYMENT FLOW ----
  const canCheckout = cards.length > 0 && Array.isArray(cart) && cart.length > 0;

  const payNow = () => {
    setMessage('');
    if (!canCheckout) {
      setMessage('Add a card and ensure your cart has items before checking out.');
      return;
    }

    const card = cards.find(c => c.id === selectedCardId);
    if (!card) {
      setMessage('Please select a card to continue.');
      return;
    }

    // Build order summary
    const orderId = uuid();
    const now = new Date().toISOString();
    const items = cart.map(it => ({
      id: it.id,
      service: it.service,
      quantity: Number(it.quantity) || 0,
      price: Number(it.price) || 0,
      lineTotal: (Number(it.price) || 0) * (Number(it.quantity) || 0),
    }));
    const order = {
      id: orderId,
      createdAt: now,
      items,
      totalItems,
      totalPrice: Number(totalPrice.toFixed(2)),
      card: {
        brand: card.brand,
        last4: card.last4,
        maskedPan: card.maskedPan,
        expMonth: card.expMonth,
        expYear: card.expYear,
        cardholderName: card.cardholderName,
      },
      // purely demo flags
      status: 'PAID (Mock)',
      note: 'Non-paying demo: no real transaction processed.',
    };

    // Persist order, clear cart, show receipt
    setOrders(prev => [order, ...prev]);
    setCart([]); // empty the cart after "payment"
    setReceipt(order);
    setMessage('Payment successful (mock). Your order has been recorded.');
  };

  return (
    <div className="container credit-cards">
      <div className="section-header section-header-accent">
        <h2>Checkout</h2>
        <div className="section-subtitle">Select a card to pay for items in your cart (mock)</div>
      </div>

      {/* ---- CART SUMMARY ---- */}
      <div className="summary-box stack-12">
        <div className="summary-row">
          <span className="summary-label">Items in Cart</span>
          <span className="summary-value">{totalItems}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Amount</span>
          <span className="summary-value total">${totalPrice.toFixed(2)}</span>
        </div>

        {Array.isArray(cart) && cart.length > 0 ? (
          <ul className="summary-items">
            {cart.map(it => (
              <li key={it.id} className="summary-item">
                <div className="summary-item-left">
                  <div className="summary-item-title">{it.service}</div>
                  {it.serviceInfo && <div className="summary-item-info">{it.serviceInfo}</div>}
                </div>
                <div className="summary-item-right">
                  <div className="summary-qty">x{it.quantity}</div>
                  <div className="summary-line">${((Number(it.price)||0)*(Number(it.quantity)||0)).toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-note">Your cart is empty.</div>
        )}
      </div>

      {/* ---- CARDS LIST ---- */}
      <div className="section-header" style={{ marginTop: 16 }}>
        <h2>Saved Cards</h2>
        <div className="row-12">
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Add Card</button>
        </div>
      </div>

      {showAdd && (
        <AddCard
          onClose={() => setShowAdd(false)}
          onSave={(card) => {
            setCards(prev => [card, ...prev]);
            setSelectedCardId(card.id);
            setShowAdd(false);
          }}
        />
      )}

      <ul className="cards-list">
        {cards.length === 0 && <li className="empty-note">No saved cards yet.</li>}
        {cards.map(card => (
          <li key={card.id} className="card-item">
            <label className="card-radio">
              <input
                type="radio"
                name="selectedCard"
                value={card.id}
                checked={selectedCardId === card.id}
                onChange={() => setSelectedCardId(card.id)}
              />
              <span className="card-radio-display">
                <strong>{card.brand}</strong> •••• {card.last4}
                <span className="card-meta">
                  Expires {String(card.expMonth).padStart(2,'0')}/{card.expYear} — {card.cardholderName}
                </span>
              </span>
            </label>

            <button className="btn btn-danger" onClick={() => removeCard(card.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* ---- ACTIONS ---- */}
      <div className="actions-bar">
        <button
          className="btn btn-primary"
          disabled={!canCheckout}
          onClick={payNow}
          title={!canCheckout ? 'Add a card and ensure your cart has items' : 'Pay (mock)'}
        >
          Pay Now (Mock)
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = '/cart')}
        >
          Back to Cart
        </button>
      </div>

      {message && <div className="banner success">{message}</div>}

      {/* ---- RECEIPT ---- */}
      {receipt && (
        <div className="receipt stack-12">
          <h3>Receipt</h3>
          <div className="receipt-row">
            <span className="receipt-label">Order ID</span>
            <span className="receipt-value mono">{receipt.id}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Date</span>
            <span className="receipt-value">{new Date(receipt.createdAt).toLocaleString()}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Status</span>
            <span className="receipt-value">{receipt.status}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Card</span>
            <span className="receipt-value">
              {receipt.card.brand} •••• {receipt.card.last4} — {String(receipt.card.expMonth).padStart(2,'0')}/{receipt.card.expYear}
            </span>
          </div>

          <ul className="receipt-items">
            {receipt.items.map(line => (
              <li key={line.id} className="receipt-item">
                <div className="receipt-item-left">
                  <div className="receipt-item-title">{line.service}</div>
                  <div className="receipt-item-meta">Qty: {line.quantity}</div>
                </div>
                <div className="receipt-item-right mono">${line.lineTotal.toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <div className="receipt-total">
            <span>Total</span>
            <strong className="mono">${receipt.totalPrice.toFixed(2)}</strong>
          </div>

          <p className="disclaimer">
            This is a non‑paying demo. No real transactions are processed.
          </p>
        </div>
      )}

      {/* ---- ORDER HISTORY (optional, latest 5) ---- */}
      {orders.length > 0 && (
        <div className="order-history">
          <h3>Recent Orders</h3>
          <ul className="history-list">
            {orders.slice(0,5).map(o => (
              <li key={o.id} className="history-item">
                <span className="mono">{o.id.slice(0,8)}…</span>
                <span>{new Date(o.createdAt).toLocaleString()}</span>
                <span>${o.totalPrice.toFixed(2)}</span>
                <span>{o.card.brand} •••• {o.card.last4}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
