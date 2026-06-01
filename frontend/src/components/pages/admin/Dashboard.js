import React, { useState, useEffect } from "react";
import { getRevenueSummary, getRevenue, getBookings, getFields, getCustomers } from "../../../api/adminApi";
import { useToast } from "../../../hooks/useToast";
import "../../../styles/Dashboard.css";

const formatCurrency = (v) => v ? Number(v).toLocaleString("vi-VN") : "0";

export default function Dashboard() {
  const { error } = useToast();
  const [summary, setSummary] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sumRes, bookRes, fRes, cRes] = await Promise.all([
          getRevenueSummary().catch(() => ({ data: { data: {} } })),
          getBookings().catch(() => ({ data: { data: [] } })),
          getFields().catch(() => ({ data: { data: [] } })),
          getCustomers().catch(() => ({ data: { data: [] } })),
        ]);
        const bookings = bookRes.data.data || [];
        const fields = fRes.data.data || [];
        const customers = cRes.data.data || [];
        setStats({ totalFields: fields.length, totalCustomers: customers.length, totalBookings: bookings.length });
        setRecentBookings(bookings.slice(-5).reverse());
        setSummary(sumRes.data.data || {});
      } catch (e) {
        error("Không tải được dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusLabel = (s) => {
    const m = { CHO_DUYET: ["⏳ Chờ duyệt", "warning"], DA_DUYET: ["✅ Đã duyệt", "success"], HOAN_TAT: ["🏁 Hoàn tất", "primary"], DA_HUY: ["❌ Đã hủy", "error"] };
    return m[s] || [s, "info"];
  };

  return (
    <div className="dashboard">
      <h1 className="page-title">📊 Dashboard</h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏟️</div>
          <div className="stat-label">Tổng sân</div>
          <div className="stat-value">{stats.totalFields || 0}</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Đặt sân hôm nay</div>
          <div className="stat-value">{stats.todayBookings || 0}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Doanh thu tháng</div>
          <div className="stat-value">{formatCurrency(summary.monthlyRevenue)} đ</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Khách hàng</div>
          <div className="stat-value">{stats.totalCustomers || 0}</div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="page-section">
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>💰 Tổng quan doanh thu</h3>
          <div className="stats-grid" style={{ marginBottom: 0 }}>
            <div className="stat-card">
              <div className="stat-label">Hôm nay</div>
              <div className="stat-value" style={{ fontSize: 22 }}>{formatCurrency(summary.todayRevenue)} đ</div>
            </div>
            <div className="stat-card success">
              <div className="stat-label">Tháng này</div>
              <div className="stat-value" style={{ fontSize: 22 }}>{formatCurrency(summary.monthlyRevenue)} đ</div>
            </div>
            <div className="stat-card accent">
              <div className="stat-label">Năm nay</div>
              <div className="stat-value" style={{ fontSize: 22 }}>{formatCurrency(summary.yearlyRevenue)} đ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="page-section">
        <h2 style={{ marginBottom: 16 }}>📅 Đặt sân gần nhất</h2>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : recentBookings.length === 0 ? (
          <div className="empty-state"><h3>Chưa có đặt sân nào</h3></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Khách hàng</th><th>Sân</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => {
                const [l, cls] = statusLabel(b.status);
                return (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.tenKhachHang || b.hoTen || "—"}</td>
                    <td>{b.tenSan}</td>
                    <td>{b.ngay}</td>
                    <td>{b.khungGio || "—"}</td>
                    <td><span className={`badge badge-${cls}`}>{l}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
