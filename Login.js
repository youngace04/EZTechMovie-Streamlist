
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Render the Google Sign-in button (do NOT initialize here)
  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    console.log('[Login] Render button — clientId:', clientId);

    if (window.google?.accounts?.id && clientId) {
      const target = document.getElementById('google-btn');
      if (target) {
        window.google.accounts.id.renderButton(target, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
        });
      } else {
        console.warn('[Login] #google-btn not found');
      }
    } else {
      console.warn('[Login] GIS not available or clientId missing');
    }
  }, []);

  // Navigate when auth becomes true
  useEffect(() => {
    console.log('[Login] isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  return (
    <div className="app" style={{ padding: 24 }}>
      <h2>Login</h2>
      <p>Please sign in to access the application.</p>
      <div id="google-btn" style={{ marginTop: 16 }} />
    </div>
  );
}
