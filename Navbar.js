
import { NavLink } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  // Cart count (defensive in case localStorage contains non-array)
  const [cart] = useLocalStorage('cart.items', []);
  const items = Array.isArray(cart) ? cart : [];
  const itemCount = items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);

  // Auth state for showing/hiding nav items
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="brand">EZTechMovie</div>

      <ul className="nav-links">
        {isAuthenticated ? (
          <>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/movies"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Movies
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/subscriptions"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Subscriptions
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/cart"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Cart{itemCount > 0 ? ` (${itemCount})` : ''}
              </NavLink>
            </li>

            {/* Cards (credit card management) */}
            <li>
              <NavLink
                to="/cards"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Cards
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                About
              </NavLink>
            </li>
          </>
        ) : (
          /* When logged out, only show Login */
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>

      {/* Right-side user area (optional) */}
      <div className="nav-user">
        {isAuthenticated ? (
          <>
            {user?.name && <span className="user-name">Hi, {user.name}</span>}
            <button className="btn-secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
