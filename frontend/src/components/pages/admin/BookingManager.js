import React, { useState, useEffect } from "react";
import { getBookings, getBooking, approveBooking, cancelBooking, completeBooking, deleteBooking } from "../../../api/adminApi";
import { useToast } from "../../../hooks/useToast";

export default function BookingManager() {
  const { success, error } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", fieldId: "" });
  const [detail, setDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [processing, setProcessing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.fieldId) params.fieldId = filters.fieldId;
      const res = await getBookings(params);
      setBookings(res.data.data || []);
    } catch (e) { error("Không tải dữ liệu"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filters]);

  const handleView = async (id) => {
    try {
      const res = await getBooking(id);
      setDetail(res.data.data);
      setShowDetail(true);
    } catch (e) { error("Không tải chi tiết"); }
  };

  const handleAction = async (id, action) => {
    setProcessing(id);
    try {
      if (action === "approve") { await approveBooking(id); success("Duyệt thành công"); }
      else if (action === "cancel") { await cancelBooking(id); success("Hủy thành công"); }
      else if (action === "complete") { await completeBooking(id); success("Hoàn tất thành công"); }
      else if (action === "delete") { await deleteBooking(id); success("Xóa thành công"); }
      setShowDetail(false);
      load();
    } catch (e) { error(e.response?.data?.message || "Thao tác thất bại"); }
    finally { setProcessing(null); }
  };

  const statusConfig = {
    CHO_DUYET: ["⏳ Chờ duyệt", "warning"],
    DA_DUYET: ["✅ Đã duyệt", "success"],
    HOAN_TAT: ["🏁 Hoàn tất", "primary"],
    DA_HUY: ["❌ Đã hủy", "error"],
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>📅 Quản lý đặt sân</h1>
        <p className="page-subtitle" style={{ margin: 0 }}>Duyệt, hủy, xóa các lịch đặt sân</p>
      </div>

      <div className="filter-bar">
        <select className="form-input" style={{ width: 180 }} value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}>
          <option value="">Tất cả trạng thái</option>
          <option value="CHO_DUYET">Chờ duyệt</option>
          <option value="DA_DUYET">Đã duyệt</option>
          <option value="HOAN_TAT">Hoàn tất</option>
          <option value="DA_HUY">Đã hủy</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={() => setFilters({ status: "", fieldId: "" })}>Đặt lại</button>
      </div>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> :
       bookings.length === 0 ? <div className="empty-state"><h3>Không có lịch đặt nào</h3></div> : (
        <table>
          <thead><tr><th>ID</th><th>Khách hàng</th><th>Sân</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {bookings.map(b => {
              const [l, cls] = statusConfig[b.status] || [b.status, "info"];
              return (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.tenKhachHang || b.hoTen || "—"}</td>
                  <td>{b.tenSan}</td>
                  <td>{b.ngay}</td>
                  <td>{b.khungGio || "—"}</td>
                  <td><span className={`badge badge-${cls}`}>{l}</span></td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleView(b.id)}>Chi tiết</button>
                    {b.status === "CHO_DUYET" && (
                      <>
                        <button className="btn btn-success btn-sm" style={{ marginLeft: 4 }} onClick={() => handleAction(b.id, "approve")} disabled={processing === b.id}>Duyệt</button>
                        <button className="btn btn-danger btn-sm" style={{ marginLeft: 4 }} onClick={() => handleAction(b.id, "cancel")} disabled={processing === b.id}>Hủy</button>
                      </>
                    )}
                    {b.status === "DA_DUYET" && (
                      <button className="btn btn-primary btn-sm" style={{ marginLeft: 4 }} onClick={() => handleAction(b.id, "complete")} disabled={processing === b.id}>Hoàn tất</button>
                    )}
                    {b.status === "DA_HUY" && (
                      <button className="btn btn-danger btn-sm" style={{ marginLeft: 4 }} onClick={() => handleAction(b.id, "delete")} disabled={processing === b.id}>Xóa</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showDetail && detail && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Chi tiết đặt sân #{detail.id}</h2>
              <button className="modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                ["Khách hàng", detail.tenKhachHang || detail.hoTen],
                ["Sân", detail.tenSan],
                ["Chi nhánh", detail.tenChiNhanh],
                ["Ngày", detail.ngay],
                ["Giờ", detail.khungGio],
                ["Ghi chú", detail.ghiChu || "—"],
                ["Trạng thái", detail.status],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{label}</span>
                  <strong style={{ fontSize: 14 }}>{value}</strong>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDetail(false)}>Đóng</button>
              {detail.status === "CHO_DUYET" && (
                <>
                  <button className="btn btn-success" onClick={() => handleAction(detail.id, "cancel")} disabled={processing === detail.id}>Hủy</button>
                  <button className="btn btn-primary" onClick={() => handleAction(detail.id, "approve")} disabled={processing === detail.id}>Duyệt</button>
                </>
              )}
              {detail.status === "DA_DUYET" && (
                <button className="btn btn-primary" onClick={() => handleAction(detail.id, "complete")} disabled={processing === detail.id}>Hoàn tất</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
