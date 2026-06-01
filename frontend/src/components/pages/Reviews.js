import React, { useState, useEffect } from "react";
import { getPublicFields } from "../../api/fieldApi";
import { createReview, getMyBookings } from "../../api/bookingApi";
import { useToast } from "../../hooks/useToast";
import "../../styles/Reviews.css";

export default function Reviews() {
  const { success, error } = useToast();
  const [fields, setFields] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fieldId: "", diemSo: 5, noiDung: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([getPublicFields(), getMyBookings()])
      .then(([fRes, bRes]) => {
        setFields(fRes.data.data || []);
        const booked = (bRes.data.data || []).filter(b => b.status === "HOAN_TAT" && !b.hasReview);
        setMyBookings(booked);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.fieldId) errs.fieldId = "Vui lòng chọn sân";
    if (!form.noiDung.trim()) errs.noiDung = "Vui lòng nhập nhận xét";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await createReview({ fieldId: Number(form.fieldId), diemSo: form.diemSo, noiDung: form.noiDung });
      success("Cảm ơn bạn đã đánh giá!");
      setForm({ fieldId: "", diemSo: 5, noiDung: "" });
      const bRes = await getMyBookings();
      setMyBookings((bRes.data.data || []).filter(b => b.status === "HOAN_TAT" && !b.hasReview));
    } catch (e) {
      error(e.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSelect = (booking) => {
    setForm(p => ({ ...p, fieldId: booking.fieldId || booking.field?.id || "" }));
  };

  return (
    <div className="reviews-page">
      <div className="container">
        <h1 className="page-title">⭐ Đánh giá sân bóng</h1>

        <div className="reviews-grid">
          {/* Form đánh giá */}
          <div className="card review-form-card">
            <h3>📝 Gửi đánh giá của bạn</h3>
            <form onSubmit={handleSubmit}>
              {myBookings.length > 0 && (
                <div className="quick-select">
                  <p className="quick-label">Chọn nhanh từ lịch đặt hoàn thành:</p>
                  <div className="quick-list">
                    {myBookings.slice(0, 5).map(b => (
                      <button key={b.id} type="button" className="quick-btn" onClick={() => handleQuickSelect(b)}>
                        {b.tenSan} - {b.ngay}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Chọn sân</label>
                <select name="fieldId" value={form.fieldId} onChange={handleChange} className={`form-input ${errors.fieldId ? "error" : ""}`}>
                  <option value="">-- Chọn sân --</option>
                  {fields.map(f => <option key={f.id} value={f.id}>{f.tenSan} - {f.tenChiNhanh}</option>)}
                </select>
                {errors.fieldId && <span className="form-error">{errors.fieldId}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Điểm đánh giá</label>
                <div className="star-rating large">
                  {[1,2,3,4,5].map(n => (
                    <span key={n} className={`star ${n <= form.diemSo ? "filled" : ""}`} onClick={() => setForm(p => ({ ...p, diemSo: n }))}>★</span>
                  ))}
                </div>
                <span className="rating-label">{["","Tệ","Không hài lòng","Bình thường","Tốt","Tuyệt vời"][form.diemSo]}</span>
              </div>
              <div className="form-group">
                <label className="form-label">Nhận xét</label>
                <textarea name="noiDung" value={form.noiDung} onChange={handleChange} className={`form-input ${errors.noiDung ? "error" : ""}`} rows={4} placeholder="Chia sẻ trải nghiệm của bạn về sân bóng này..." />
                {errors.noiDung && <span className="form-error">{errors.noiDung}</span>}
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: "100%" }}>
                {submitting ? "Đang gửi..." : "✓ Gửi đánh giá"}
              </button>
            </form>
          </div>

          {/* Sidebar info */}
          <div className="review-info">
            <div className="card info-card">
              <h3>📋 Hướng dẫn đánh giá</h3>
              <ul>
                <li>Chọn sân bạn đã sử dụng dịch vụ</li>
                <li>Đánh giá từ 1-5 sao dựa trên trải nghiệm</li>
                <li>Viết nhận xét chi tiết để giúp người khác</li>
                <li>Đánh giá trung thực và khách quan</li>
              </ul>
            </div>
            <div className="card info-card">
              <h3>🏆 Thang điểm</h3>
              <div className="rating-guide">
                <div>⭐⭐⭐⭐⭐ <span>Tuyệt vời</span></div>
                <div>⭐⭐⭐⭐ <span>Tốt</span></div>
                <div>⭐⭐⭐ <span>Bình thường</span></div>
                <div>⭐⭐ <span>Không hài lòng</span></div>
                <div>⭐ <span>Tệ</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
