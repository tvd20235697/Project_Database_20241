import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ToastProvider } from "./hooks/useToast";
import Layout from "./components/layout/Layout";
import ManagerLayout from "./components/layout/ManagerLayout";
import Home from "./components/pages/Home";
import Signin from "./components/pages/Signin";
import Signup from "./components/pages/Signup";
import BookingPage from "./components/pages/BookingPage";
import MyBookings from "./components/pages/MyBookings";
import Reviews from "./components/pages/Reviews";
import Profile from "./components/pages/Profile";
import Dashboard from "./components/pages/admin/Dashboard";
import BranchManager from "./components/pages/admin/BranchManager";
import FieldManager from "./components/pages/admin/FieldManager";
import BookingManager from "./components/pages/admin/BookingManager";
import CustomerManager from "./components/pages/admin/CustomerManager";
import RevenueReport from "./components/pages/admin/RevenueReport";
import ReviewManager from "./components/pages/admin/ReviewManager";
import "./styles/global.css";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/signin" replace />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/signin" element={user ? <Navigate to="/" replace /> : <Signin />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />

      {/* User - requires login */}
      <Route path="/booking" element={<ProtectedRoute><Layout><BookingPage /></Layout></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><Layout><MyBookings /></Layout></ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute><Layout><Reviews /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><ManagerLayout><Dashboard /></ManagerLayout></ProtectedRoute>} />
      <Route path="/admin/branches" element={<ProtectedRoute adminOnly><ManagerLayout><BranchManager /></ManagerLayout></ProtectedRoute>} />
      <Route path="/admin/fields" element={<ProtectedRoute adminOnly><ManagerLayout><FieldManager /></ManagerLayout></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><ManagerLayout><BookingManager /></ManagerLayout></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute adminOnly><ManagerLayout><CustomerManager /></ManagerLayout></ProtectedRoute>} />
      <Route path="/admin/revenue" element={<ProtectedRoute adminOnly><ManagerLayout><RevenueReport /></ManagerLayout></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ProtectedRoute adminOnly><ManagerLayout><ReviewManager /></ManagerLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
