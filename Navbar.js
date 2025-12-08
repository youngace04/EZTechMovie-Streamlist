// src/components/Navbar.js 
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import './Navbar.css';

function Navbar() {
  const [cart] = useLocalStorage('cart.items', []);
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <nav className="navbar">
      <h2>EZTechMovie</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/subscriptions">Subscriptions</Link></li>
        <li><Link to="/cart">Cart ({itemCount})</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;