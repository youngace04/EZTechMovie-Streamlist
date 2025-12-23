import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Existing pages
const StreamList   = lazy(() => import('./components/StreamList'));
const Movies       = lazy(() => import('./components/Movies'));
const Cart         = lazy(() => import('./components/Cart'));
const About        = lazy(() => import('./components/About'));

// Auth
const Login        = lazy(() => import('./components/Login'));

// Subscriptions page
const Subscriptions = lazy(() => import('./components/Subscriptions'));

// Credit card management (mask-only, localStorage)
const CreditCard  = lazy(() => import('./components/CreditCard/CreditCard.js')); // explicit .js

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected application routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <StreamList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              }
            />

            <Route
              path="/subscriptions"
              element={
                <ProtectedRoute>
                  <Subscriptions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cards"
              element={
                <ProtectedRoute>
                  <CreditCard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            {/* Fallback to home */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <StreamList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
