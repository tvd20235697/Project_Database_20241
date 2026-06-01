import React, { useState, useEffect } from "react";
import { getMyBookings } from "../../api/bookingApi";
import { cancelUserBooking } from "../../api/userApi";
import { useToast } from "../../hooks/useToast";
import "../../styles/MyBookings.css";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" }) : "—";
const formatCurrency = (v) => v ? Number(v).toLocaleString("vi-VN") : "0";

export default function MyBookings() {
  const { success, error } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [processing, setProcessing] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
      setBookings(res.data.data || []);
    } catch (e) { error("Không tải được danh sách đặt sân"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCancel = async (id) => {
    setProcessing(true);
    try {
      await cancelUserBooking(id);
      success("Hủy đặt sân thành công");
      setConfirmCancel(null);
      loadBookings();
    } catch (e) { error(e.response?.data?.message || "Hủy thất bại"); }
    finally { setProcessing(false); }
  };

  const getTenSan = (b) => b.field?.tenSan || "—";
  const getTenChiNhanh = (b) => b.field?.tenChiNhanh || "—";
  const getKhungGio = (b) => b.timeSlot?.khungGio || "—";
  const getGiaSan = (b) => b.field?.giaSan;

  const upcoming = bookings.filter(b => b.status === "CHO_DUYET" || b.status === "DA_DUYET");
  const completed = bookings.filter(b => b.status === "HOAN_TAT");
  const cancelled = bookings.filter(b => b.status === "DA_HUY");

  const tabs = [
    { key: "upcoming", label: "Sắp tới", count: upcoming.length },
    { key: "completed", label: "Hoàn thành", count: completed.length },
    { key: "cancelled", label: "Đã hủy", count: cancelled.length },
  ];

  const displayList = activeTab === "upcoming" ? upcoming : activeTab === "completed" ? completed : cancelled;

  const statusConfig = {
    CHO_DUYET: ["⏳ Chờ duyệt", "warning"],
    DA_DUYET: ["✅ Đã duyệt", "success"],
    HOAN_TAT: ["🏁 Hoàn tất", "primary"],
    DA_HUY: ["❌ Đã hủy", "error"],
  };

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="page-title">📅 Lịch đặt sân của tôi</h1>

        <div className="tabs">
          {tabs.map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
              {t.label} <span className="tab-count">{t.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : displayList.length === 0 ? (
          <div className="empty-state">
            <p>📅</p>
            <h3>Không có lịch đặt nào</h3>
            <p>Hãy đặt sân để trải nghiệm dịch vụ</p>
            <a href="/booking" className="btn btn-primary" style={{ marginTop: 12 }}>Đặt sân ngay</a>
          </div>
        ) : (
          <div className="bookings-list">
            {displayList.map(b => {
              const [label, cls] = statusConfig[b.status] || [b.status, "info"];
              return (
                <div key={b.id} className="booking-card">
                  <div className="booking-card-header">
                    <div>
                      <h3>🏟️ {getTenSan(b)}</h3>
                      <p className="booking-branch">📍 {getTenChiNhanh(b)}</p>
                    </div>
                    <span className={`badge badge-${cls}`}>{label}</span>
                  </div>
                  <div className="booking-card-body">
                    <div className="booking-detail">
                      <span>📆 Ngày</span>
                      <strong>{formatDate(b.ngay)}</strong>
                    </div>
                    <div className="booking-detail">
                      <span>🕐 Giờ</span>
                      <strong>{getKhungGio(b)}</strong>
                    </div>
                    <div className="booking-detail">
                      <span>💰 Giá</span>
                      <strong className="price">{formatCurrency(getGiaSan(b))} đ</strong>
                    </div>
                  </div>
                  {(b.status === "CHO_DUYET" || b.status === "DA_DUYET") && (
                    <div className="booking-card-footer">
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmCancel(b.id)}>Hủy đặt</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {confirmCancel && (
          <div className="modal-overlay" onClick={() => setConfirmCancel(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
              <div className="modal-header">
                <h2>⚠️ Xác nhận hủy</h2>
                <button className="modal-close" onClick={() => setConfirmCancel(null)}>×</button>
              </div>
              <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Bạn có chắc muốn hủy lịch đặt này không?</p>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setConfirmCancel(null)}>Không, giữ lại</button>
                <button className="btn btn-danger" onClick={() => handleCancel(confirmCancel)} disabled={processing}>
                  {processing ? "Đang hủy..." : "Có, hủy đặt"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
