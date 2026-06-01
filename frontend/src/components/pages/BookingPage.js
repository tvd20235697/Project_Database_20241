import React, { useState, useEffect } from "react";
import { getPublicFields, getFieldDetails, getFieldAvailability, getBranches } from "../../api/fieldApi";
import { createBooking } from "../../api/bookingApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import "../../styles/BookingPage.css";

const formatCurrency = (v) => v ? Number(v).toLocaleString("vi-VN") : "0";
const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" });

export default function BookingPage() {
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [branches, setBranches] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [fieldDetails, setFieldDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlotIds, setBookedSlotIds] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [bookingForm, setBookingForm] = useState({ ghiChu: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const d = [];
    for (let i = 0; i < 14; i++) {
      const dt = new Date();
      dt.setDate(dt.getDate() + i);
      d.push({ date: dt.toISOString().slice(0, 10), label: dt.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" }) });
    }
    setDays(d);
    setSelectedDate(d[0].date);
    loadBranches();
  }, []);

  const loadBranches = async () => {
    setLoading(true);
    try {
      const bRes = await getBranches();
      setBranches(bRes.data.data || []);
      const fRes = await getPublicFields();
      setFields(fRes.data.data || []);
    } catch (e) {
      error("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredFields = selectedBranch ? fields.filter(f => f.branchId === Number(selectedBranch)) : fields;

  const selectField = async (f) => {
    setSelectedField(f);
    setSelectedSlot(null);
    setStep(2);
    setLoadingSlots(true);
    try {
      const [dRes, aRes] = await Promise.all([getFieldDetails(f.id), getFieldAvailability(f.id, selectedDate)]);
      setFieldDetails(dRes.data.data);
      setTimeSlots(aRes.data.data?.timeSlots || []);
      setBookedSlotIds(aRes.data.data?.bookedSlotIds || []);
    } catch (e) {
      error("Không tải được thông tin sân");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (!selectedField) return;
    getFieldAvailability(selectedField.id, selectedDate)
      .then(r => {
        setTimeSlots(r.data.data?.timeSlots || []);
        setBookedSlotIds(r.data.data?.bookedSlotIds || []);
      })
      .catch(console.error);
  }, [selectedDate, selectedField]);

  const handleBook = async () => {
    if (!isAuthenticated) { navigate("/signin"); return; }
    setSubmitting(true);
    try {
      await createBooking({ fieldId: selectedField.id, timeSlotId: selectedSlot.id, ngay: selectedDate, ghiChu: bookingForm.ghiChu });
      success("Đặt sân thành công! Vui lòng chờ duyệt.");
      setStep(1); setSelectedField(null); setSelectedSlot(null); setBookingForm({ ghiChu: "" });
    } catch (e) {
      error(e.response?.data?.message || "Đặt sân thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">📅 Đặt sân bóng</h1>

        {/* Steps indicator */}
        <div className="steps">
          {[1, 2, 3].map(s => (
            <div key={s} className={`step ${step >= s ? "active" : ""}`}>
              <div className="step-number">{s}</div>
              <span className="step-label">{["Chọn sân", "Chọn thời gian", "Xác nhận"][s-1]}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="step-content">
            <div className="form-group" style={{ maxWidth: 400 }}>
              <label className="form-label">Chi nhánh</label>
              <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="form-input">
                <option value="">Tất cả chi nhánh</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.tenChiNhanh} - {b.diaChi}</option>)}
              </select>
            </div>
            {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
              <div className="fields-grid">
                {filteredFields.map(f => (
                  <div key={f.id} className="field-select-card" onClick={() => selectField(f)}>
                    <div className="field-icon-big">🏟️</div>
                    <h3>{f.tenSan}</h3>
                    <p>📍 {f.tenChiNhanh}</p>
                    <div className="field-select-meta">
                      <span className="badge badge-primary">{f.loaiSan}</span>
                      <span className="price">{formatCurrency(f.giaSan)} đ</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <button className="btn btn-outline btn-sm" onClick={() => setStep(1)} style={{ marginBottom: 16 }}>← Chọn sân khác</button>
            {fieldDetails && (
              <div className="selected-field-info card">
                <h3>🏟️ {fieldDetails.tenSan}</h3>
                <p>📍 {fieldDetails.tenChiNhanh} • <strong>{formatCurrency(fieldDetails.giaSan)} đ</strong></p>
              </div>
            )}
            <div className="form-group" style={{ maxWidth: 300, marginTop: 16 }}>
              <label className="form-label">Ngày đặt</label>
              <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="form-input">
                {days.map(d => <option key={d.date} value={d.date}>{d.label}</option>)}
              </select>
            </div>
            <h3 style={{ marginTop: 24, marginBottom: 12 }}>🕐 Chọn khung giờ</h3>
            {loadingSlots ? <div className="loading-spinner"><div className="spinner"></div></div> : (
              <div className="slots-grid">
                {timeSlots.map(slot => {
                  const isBooked = bookedSlotIds.includes(slot.id);
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <div key={slot.id} className={`slot ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={() => !isBooked && setSelectedSlot(slot)}>
                      <span className="slot-time">{slot.gioBatDau?.slice(0, 5)} - {slot.gioKetThuc?.slice(0, 5)}</span>
                      {isBooked && <span className="slot-status booked-label">❌ Đã đặt</span>}
                      {isSelected && <span className="slot-status selected-label">✓ Đã chọn</span>}
                    </div>
                  );
                })}
              </div>
            )}
            {selectedSlot && (
              <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} style={{ marginTop: 24 }}>
                Tiếp tục → Xác nhận
              </button>
            )}
          </div>
        )}

        {step === 3 && selectedField && selectedSlot && (
          <div className="step-content">
            <button className="btn btn-outline btn-sm" onClick={() => setStep(2)} style={{ marginBottom: 16 }}>← Quay lại</button>
            <div className="confirm-card card">
              <h2 style={{ color: "var(--primary)", marginBottom: 20 }}>🎯 Xác nhận đặt sân</h2>
              <div className="confirm-grid">
                <div className="confirm-item"><span>Sân</span><strong>{selectedField.tenSan}</strong></div>
                <div className="confirm-item"><span>Chi nhánh</span><strong>{selectedField.tenChiNhanh}</strong></div>
                <div className="confirm-item"><span>Ngày</span><strong>{formatDate(selectedDate)}</strong></div>
                <div className="confirm-item"><span>Giờ</span><strong>{selectedSlot.gioBatDau?.slice(0, 5)} - {selectedSlot.gioKetThuc?.slice(0, 5)}</strong></div>
                <div className="confirm-item"><span>Giá thuê</span><strong className="confirm-price">{formatCurrency(selectedField.giaSan)} đ</strong></div>
              </div>
              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">Ghi chú (tùy chọn)</label>
                <textarea className="form-input" rows={2} placeholder="Ví dụ: Cần thuê bóng, ghế ngồi..." value={bookingForm.ghiChu}
                  onChange={e => setBookingForm(p => ({ ...p, ghiChu: e.target.value }))} />
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleBook} disabled={submitting} style={{ width: "100%", marginTop: 16 }}>
                {submitting ? "Đang xử lý..." : "✓ Xác nhận đặt sân"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
