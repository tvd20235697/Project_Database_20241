import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import "../../styles/Signin.css";

const Signup = () => {
  const { signup } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ hoTen: "", email: "", password: "", soDienThoai: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.hoTen.trim()) errs.hoTen = "Vui lòng nhập họ tên";
    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email không hợp lệ";
    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 6) errs.password = "Mật khẩu phải từ 6 ký tự";
    if (!form.soDienThoai.trim()) errs.soDienThoai = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10,11}$/.test(form.soDienThoai)) errs.soDienThoai = "Số điện thoại không hợp lệ (10-11 số)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form);
      success("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/signin");
    } catch (err) {
      error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "hoTen", label: "Họ và tên", type: "text", placeholder: "Nhập họ và tên" },
    { name: "email", label: "Email", type: "email", placeholder: "Nhập email" },
    { name: "password", label: "Mật khẩu", type: "password", placeholder: "Nhập mật khẩu (tối thiểu 6 ký tự)" },
    { name: "soDienThoai", label: "Số điện thoại", type: "tel", placeholder: "Nhập số điện thoại" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">⚽</span>
          <h1>Tạo tài khoản</h1>
          <p>Đăng ký để bắt đầu đặt sân</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          {fields.map((f) => (
            <div className="form-group" key={f.name}>
              <label className="form-label">{f.label}</label>
              <input
                type={f.type} name={f.name}
                className={`form-input ${errors[f.name] ? "error" : ""}`}
                placeholder={f.placeholder}
                value={form[f.name]} onChange={handleChange}
                autoComplete={f.name === "email" ? "email" : f.name === "password" ? "new-password" : "off"}
              />
              {errors[f.name] && <span className="form-error">{errors[f.name]}</span>}
            </div>
          ))}
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        <p className="auth-footer-text">
          Đã có tài khoản? <Link to="/signin">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
