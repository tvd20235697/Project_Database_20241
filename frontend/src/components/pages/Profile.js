import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import "../../styles/Profile.css";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ hoTen: user?.hoTen || "", soDienThoai: user?.soDienThoai || "" });
  const [loading, setLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  React.useEffect(() => {
    if (user) setForm({ hoTen: user.hoTen || "", soDienThoai: user.soDienThoai || "" });
  }, [user]);

  React.useEffect(() => {
    import("../../api/userApi").then(m => {
      m.getUserBookings().then(r => setUserBookings(r.data.data?.slice(0, 5) || [])).catch(() => {}).finally(() => setLoadingBookings(false));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.hoTen.trim()) { error("Họ tên không được trống"); return; }
    setLoading(true);
    try {
      const { updateCurrentUser } = await import("../../api/userApi");
      await updateCurrentUser(form);
      await refreshUser();
      setIsEditing(false);
      success("Cập nhật thông tin thành công!");
    } catch (e) {
      error(e.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (s) => {
    const map = { CHO_DUYET: ["Chờ duyệt", "warning"], DA_DUYET: ["Đã duyệt", "success"], DA_HUY: ["Đã hủy", "error"], HOAN_TAT: ["Hoàn tất", "primary"] };
    return map[s] || [s, "info"];
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">👤 Hồ sơ cá nhân</h1>

        <div className="profile-grid">
          <div className="card profile-card">
            <div className="profile-avatar">{user?.hoTen?.charAt(0)?.toUpperCase() || "?"}</div>
            <div className="profile-info">
              {isEditing ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Họ và tên</label>
                    <input name="hoTen" value={form.hoTen} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input name="soDienThoai" value={form.soDienThoai} onChange={handleChange} className="form-input" />
                  </div>
                  <div className="profile-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(false)}>Hủy</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="profile-field"><span className="field-label">Họ và tên</span><span className="field-value">{user?.hoTen}</span></div>
                  <div className="profile-field"><span className="field-label">Email</span><span className="field-value">{user?.email}</span></div>
                  <div className="profile-field"><span className="field-label">Số điện thoại</span><span className="field-value">{user?.soDienThoai || "Chưa cập nhật"}</span></div>
                  <div className="profile-field"><span className="field-label">Vai trò</span><span className="badge badge-primary">{user?.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}</span></div>
                  <button className="btn btn-outline" onClick={() => setIsEditing(true)}>✏️ Chỉnh sửa thông tin</button>
                </>
              )}
            </div>
          </div>

          <div className="recent-bookings">
            <h3 style={{ marginBottom: 16 }}>📅 Lịch sử đặt sân gần đây</h3>
            {loadingBookings ? (
              <div className="loading-spinner"><div className="spinner"></div></div>
            ) : userBookings.length === 0 ? (
              <div className="empty-state" style={{ padding: "30px" }}>
                <p>Chưa có lịch đặt sân nào</p>
                <a href="/booking" className="btn btn-primary" style={{ marginTop: 12, display: "inline-flex" }}>Đặt sân ngay</a>
              </div>
            ) : (
              <div className="bookings-list">
                {userBookings.map(b => {
                  const [label, cls] = statusLabel(b.status);
                  return (
                    <div key={b.id} className="booking-mini-card">
                      <div>
                        <strong>{b.tenSan}</strong>
                        <p className="booking-date">{b.ngay} • {b.khungGio}</p>
                      </div>
                      <span className={`badge badge-${cls}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
