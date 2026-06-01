import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./ManagerHeader.css";

const ManagerHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/signin"); };

  const navItems = [
    { to: "/admin", label: "📊 Dashboard", exact: true },
    { to: "/admin/branches", label: "🏢 Chi nhánh" },
    { to: "/admin/fields", label: "🏟️ Sân bóng" },
    { to: "/admin/bookings", label: "📅 Đặt sân" },
    { to: "/admin/customers", label: "👥 Khách hàng" },
    { to: "/admin/reviews", label: "⭐ Đánh giá" },
    { to: "/admin/revenue", label: "💰 Doanh thu" },
  ];

  return (
    <header className="mgr-header">
      <div className="mgr-header-inner">
        <Link to="/" className="mgr-logo">⚽ <strong>D2HT</strong> Admin</Link>
        <nav className={`mgr-nav ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={window.location.pathname === item.to ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mgr-header-right">
          <Link to="/" className="btn btn-sm" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
            ← Về trang chủ
          </Link>
          <button onClick={handleLogout} className="btn btn-sm" style={{ background: "var(--error)", color: "#fff" }}>
            Đăng xuất
          </button>
        </div>
        <button className="mgr-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
};

export default ManagerHeader;
