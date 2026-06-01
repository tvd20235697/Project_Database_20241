import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import "../../styles/Signin.css";

const Signin = () => {
  const { signin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await signin(form.email, form.password);
      success("Đăng nhập thành công!");
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại";
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">⚽</span>
          <h1>Sân bóng D2HT</h1>
          <p>Đăng nhập để tiếp tục</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email" name="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Nhập email của bạn"
              value={form.email} onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password" name="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Nhập mật khẩu"
              value={form.password} onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
        <p className="auth-footer-text">
          Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
