import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicFields, getFieldDetails, getFieldAvailability, getBranches } from "../../api/fieldApi";
import { createBooking } from "../../api/bookingApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import "../../styles/Home.css";

const formatCurrency = (v) => v ? Number(v).toLocaleString("vi-VN") : "0";
const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" });

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [fields, setFields] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedField, setSelectedField] = useState(null);
  const [fieldSlots, setFieldSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [days, setDays] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const [bookingForm, setBookingForm] = useState({ ghiChu: "" });
  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const d = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date();
      dt.setDate(dt.getDate() + i);
      d.push({ date: dt.toISOString().slice(0, 10), label: dt.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" }) });
    }
    setDays(d);
    setSelectedDate(d[0].date);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fRes, bRes] = await Promise.all([getPublicFields(), getBranches()]);
      setFields(fRes.data.data || []);
      setBranches(bRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openField = async (field) => {
    setLoadingModal(true);
    setSelectedField(field);
    setBooking(null);
    setBookingForm({ ghiChu: "" });
    try {
      const [detailRes, availRes] = await Promise.all([
        getFieldDetails(field.id),
        getFieldAvailability(field.id, selectedDate)
      ]);
      const avail = availRes.data.data;
      setFieldSlots(avail.timeSlots || []);
      setBookedSlots(avail.bookedSlotIds || []);
    } catch (e) {
      error("Không tải được thông tin sân");
    } finally {
      setLoadingModal(false);
    }
  };

  useEffect(() => {
    if (!selectedField) return;
    getFieldAvailability(selectedField.id, selectedDate)
      .then(res => {
        setFieldSlots(res.data.data?.timeSlots || []);
        setBookedSlots(res.data.data?.bookedSlotIds || []);
      })
      .catch(console.error);
  }, [selectedDate, selectedField]);

  const handleBookSlot = (slot) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    setBooking({ slot, date: selectedDate, field: selectedField });
  };

  const confirmBooking = async () => {
    if (!booking) return;
    setBookingLoading(true);
    try {
      await createBooking({
        fieldId: booking.field.id,
        timeSlotId: booking.slot.id,
        ngay: booking.date,
        ghiChu: bookingForm.ghiChu,
      });
      success("Đặt sân thành công! Vui lòng chờ duyệt.");
      setBooking(null);
      openField(booking.field);
    } catch (e) {
      error(e.response?.data?.message || "Đặt sân thất bại");
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredFields = fields.filter(f => {
    if (branchFilter && f.branchId !== Number(branchFilter)) return false;
    if (typeFilter && f.loaiSan !== typeFilter) return false;
    return true;
  });

  const loaiSanOptions = [...new Set(fields.map(f => f.loaiSan).filter(Boolean))];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>⚽ Đặt sân bóng <span className="hero-accent">D2HT</span></h1>
          <p>Tìm và đặt sân bóng dễ dàng, nhanh chóng. Hệ thống quản lý hiện đại cho trải nghiệm tốt nhất.</p>
          <a href="#fields" className="btn btn-accent btn-lg">Đặt sân ngay</a>
        </div>
        <div className="hero-visual">
          <div className="field-icon">⚽</div>
        </div>
      </section>

      {/* Filters */}
      <section className="filter-section" id="fields">
        <div className="filter-bar">
          <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="form-input" style={{ width: 200 }}>
            <option value="">Tất cả chi nhánh</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.tenChiNhanh}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="form-input" style={{ width: 200 }}>
            <option value="">Tất cả loại sân</option>
            {loaiSanOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {(branchFilter || typeFilter) && (
            <button className="btn btn-sm" onClick={() => { setBranchFilter(""); setTypeFilter(""); }}>↺ Đặt lại</button>
          )}
        </div>
      </section>

      {/* Fields Grid */}
      <section className="fields-section">
        <h2 className="section-title">🏟️ Sân bóng khả dụng</h2>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : filteredFields.length === 0 ? (
          <div className="empty-state">
            <p>🚫</p>
            <h3>Không tìm thấy sân nào</h3>
            <p>Thử thay đổi bộ lọc hoặc thêm sân mới</p>
          </div>
        ) : (
          <div className="fields-grid">
            {filteredFields.map(f => (
              <div key={f.id} className="field-card">
                <div className="field-image">
                  <div className="field-type-badge">{f.loaiSan}</div>
                  <div className="field-placeholder">🏟️</div>
                </div>
                <div className="field-info">
                  <h3>{f.tenSan}</h3>
                  <p className="field-branch">📍 {f.tenChiNhanh}</p>
                  <div className="field-meta">
                    <span className="field-price">{formatCurrency(f.giaSan)} đ</span>
                    <span className="field-type">{f.loaiSan}</span>
                  </div>
                  <button className="btn btn-primary" onClick={() => openField(f)}>Xem chi tiết & đặt</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedField && (
        <div className="modal-overlay" onClick={() => { setSelectedField(null); setBooking(null); }}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 Đặt sân: {selectedField.tenSan}</h2>
              <button className="modal-close" onClick={() => { setSelectedField(null); setBooking(null); }}>×</button>
            </div>

            {loadingModal ? (
              <div className="loading-spinner"><div className="spinner"></div></div>
            ) : (
              <>
                <div className="modal-field-info">
                  <span>🏟️ {selectedField.tenSan}</span>
                  <span>📍 {selectedField.tenChiNhanh}</span>
                  <span className="price-tag">{formatCurrency(selectedField.giaSan)} đ</span>
                </div>

                {/* Day selector */}
                <div className="day-selector">
                  {days.map(d => (
                    <button
                      key={d.date}
                      className={`day-btn ${selectedDate === d.date ? "active" : ""}`}
                      onClick={() => setSelectedDate(d.date)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                {/* Time slots */}
                <div className="slots-grid">
                  {fieldSlots.length === 0 ? (
                    <p className="no-slots">Chưa có khung giờ cho sân này</p>
                  ) : fieldSlots.map(slot => {
                    const isBooked = bookedSlots.includes(slot.id);
                    const isSelected = booking?.slot?.id === slot.id;
                    return (
                      <div
                        key={slot.id}
                        className={`slot ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                        onClick={() => !isBooked && handleBookSlot(slot)}
                      >
                        <span className="slot-time">{slot.gioBatDau?.slice(0, 5)} - {slot.gioKetThuc?.slice(0, 5)}</span>
                        {isBooked && <span className="slot-status booked-label">❌ Đã đặt</span>}
                        {isSelected && !isBooked && <span className="slot-status selected-label">✓ Chọn</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Booking form */}
                {booking && !booking.slot ? null : null}
                {booking && (
                  <div className="booking-form">
                    <h4>🎯 Xác nhận đặt sân</h4>
                    <div className="booking-summary">
                      <p><strong>Sân:</strong> {booking.field.tenSan}</p>
                      <p><strong>Ngày:</strong> {formatDate(booking.date)}</p>
                      <p><strong>Giờ:</strong> {booking.slot.gioBatDau?.slice(0, 5)} - {booking.slot.gioKetThuc?.slice(0, 5)}</p>
                      <p><strong>Giá:</strong> {formatCurrency(booking.field.giaSan)} đ</p>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ghi chú (tùy chọn)</label>
                      <textarea
                        className="form-input"
                        rows={2}
                        placeholder="Ví dụ: Cần thuê bóng, ghế ngồi..."
                        value={bookingForm.ghiChu}
                        onChange={e => setBookingForm(p => ({ ...p, ghiChu: e.target.value }))}
                      />
                    </div>
                    <div className="booking-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => setBooking(null)}>Hủy</button>
                      <button className="btn btn-primary" onClick={confirmBooking} disabled={bookingLoading}>
                        {bookingLoading ? "Đang xử lý..." : "✓ Xác nhận đặt sân"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
