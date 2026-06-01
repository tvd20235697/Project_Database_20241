import React, { useState, useEffect } from "react";
import { getAllReviews, deleteReview } from "../../../api/adminApi";
import { useToast } from "../../../hooks/useToast";

export default function ReviewManager() {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllReviews();
      setReviews(res.data.data || []);
    } catch (e) { error("Không tải đánh giá"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try { await deleteReview(id); success("Xóa đánh giá thành công"); setConfirmDelete(null); load(); }
    catch (e) { error(e.response?.data?.message || "Xóa thất bại"); }
  };

  const renderStars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>⭐ Quản lý đánh giá</h1>
        <p className="page-subtitle" style={{ margin: 0 }}>Xem và quản lý đánh giá từ khách hàng</p>
      </div>
      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> :
       reviews.length === 0 ? <div className="empty-state"><h3>Chưa có đánh giá nào</h3></div> : (
        <div className="reviews-admin-list">
          {reviews.map(r => (
            <div key={r.id} className="review-admin-card">
              <div className="review-header">
                <div>
                  <strong>{r.tenSan || "Sân"}</strong>
                  <div className="review-stars" style={{ color: "#F59E0B", fontSize: 18, marginTop: 4 }}>{renderStars(r.diemSo)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{r.ngayTao ? new Date(r.ngayTao).toLocaleDateString("vi-VN") : "—"}</span>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{r.hoTen || "Khách hàng"}</p>
                </div>
              </div>
              <p className="review-content">{r.noiDung}</p>
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(r.id)}>Xóa</button>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal confirm-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h2>⚠️ Xóa đánh giá</h2>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <p>Bạn có chắc muốn xóa đánh giá này?</p>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Hủy</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
