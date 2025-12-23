
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

function formatPan(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(' '); // "1234 5678 9012 3456"
}

function brandFromPan(digits) {
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'MasterCard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^6(?:011|5)/.test(digits)) return 'Discover';
  return 'Other';
}

export default function AddCard({ onClose, onSave }) {
  const [cardholderName, setName] = useState('');
  const [pan, setPan] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');

  const handlePanChange = (e) => setPan(formatPan(e.target.value));

  const handleSubmit = (e) => {
    e.preventDefault();
    const digits = pan.replace(/\D/g, '');
    if (digits.length !== 16) {
      alert('Card number must be 16 digits (formatted as 1234 5678 9012 3456).');
      return;
    }
    if (!cardholderName.trim()) {
      alert('Cardholder name is required.');
      return;
    }
    const mm = Number(expMonth);
    const yy = Number(expYear);
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    const isFuture = yy > thisYear || (yy === thisYear && mm >= thisMonth);
    if (!(mm >= 1 && mm <= 12) || !isFuture) {
      alert('Please enter a valid future expiry date.');
      return;
    }

    const last4 = digits.slice(-4);
    const brand = brandFromPan(digits);

    const storedCard = {
      id: uuid(),
      cardholderName: cardholderName.trim(),
      brand,
      maskedPan: pan,
      last4,
      expMonth: mm,
      expYear: yy,
      createdAt: new Date().toISOString(),
    };

    onSave(storedCard);
  };

  return (
    <div className="modal">
      <form className="card-form" onSubmit={handleSubmit}>
        <h3>Add Card</h3>

        <label>Cardholder Name</label>
        <input
          className="input"
          type="text"
          value={cardholderName}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Card Number</label>
        <input
          className="input"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          value={pan}
          onChange={handlePanChange}
          maxLength={19}
          required
        />

        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Expiry Month</label>
            <input
              className="input"
              type="number"
              min="1"
              max="12"
              value={expMonth}
              onChange={e => setExpMonth(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Expiry Year</label>
            <input
              className="input"
              type="number"
              min={new Date().getFullYear()}
              value={expYear}
              onChange={e => setExpYear(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>

        <p className="disclaimer">
          This is a non‑paying demo. Cards are stored locally (masked only).
        </p>
      </form>
    </div>
  );
}
