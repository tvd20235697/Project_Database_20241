import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <span className="footer-logo">⚽ Sân bóng D2HT</span>
        <p>Hệ thống quản lý đặt sân bóng hiện đại, tiện lợi và dễ sử dụng.</p>
      </div>
      <div className="footer-links">
        <h4>Liên kết</h4>
        <a href="/">Trang chủ</a>
        <a href="/booking">Đặt sân</a>
        <a href="/reviews">Đánh giá</a>
      </div>
      <div className="footer-contact">
        <h4>Liên hệ</h4>
        <p>📍 Phòng 303, tòa B1, ĐH Bách Khoa Hà Nội</p>
        <p>📞 0969272243</p>
        <p>✉️ tranvanduy2k5gtc@gmail.com</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 Sân bóng D2HT. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
