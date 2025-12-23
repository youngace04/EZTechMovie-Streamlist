import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [user, setUser] = useState(null);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Restore previous session
    const restored = localStorage.getItem('auth.session') === 'true';
    if (restored) {
      console.log('[AuthContext] Restored session');
      setAuth(true);
    }

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    console.log('[AuthContext] clientId:', clientId);

    if (window.google?.accounts?.id && clientId) {
      console.log('[AuthContext] Initializing GIS...');
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          console.log('[AuthContext] GIS callback:', response);
          const profile = parseJwt(response?.credential ?? '');
          if (profile) {
            console.log('[AuthContext] Parsed profile:', profile);
            setUser({
              name: profile.name,
              email: profile.email,
              picture: profile.picture,
              sub: profile.sub,
            });
            setAuth(true);
            localStorage.setItem('auth.session', 'true');
          } else {
            console.warn('[AuthContext] No profile parsed from credential');
          }
        },
      });
    } else {
      console.warn('[AuthContext] GIS not available or clientId missing');
    }
  }, []);

  const logout = () => {
    setUser(null);
    setAuth(false);
    localStorage.removeItem('auth.session');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
