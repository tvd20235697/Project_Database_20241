import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">Sân bóng <strong>D2HT</strong></span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)}>Đặt sân</Link>
          {user && (
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>Lịch đặt</Link>
          )}
          {user && (
            <Link to="/reviews" onClick={() => setMenuOpen(false)}>Đánh giá</Link>
          )}
        </nav>

        <div className="header-right">
          {user ? (
            <div className="user-menu-wrap">
              <button className="user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <span className="user-avatar">{user.hoTen?.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.hoTen}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)}>👤 Hồ sơ</Link>
                  <Link to="/my-bookings" onClick={() => setUserMenuOpen(false)}>📅 Lịch đặt</Link>
                  {user.role === "ADMIN" && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)}>⚙️ Quản trị</Link>
                  )}
                  <button onClick={handleLogout} className="logout-btn">🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/signin" className="btn btn-outline btn-sm">Đăng nhập</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Đăng ký</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
};

export default Header;
