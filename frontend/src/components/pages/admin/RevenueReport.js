import React, { useState, useEffect } from "react";
import { getRevenue, getRevenueSummary } from "../../../api/adminApi";
import { useToast } from "../../../hooks/useToast";
import "../../../styles/global.css";

const formatCurrency = (v) => v ? Number(v).toLocaleString("vi-VN") : "0";

export default function RevenueReport() {
  const { error } = useToast();
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [year]);

  const load = async () => {
    setLoading(true);
    try {
      const [revRes, sumRes] = await Promise.all([getRevenue(year), getRevenueSummary()]);
      setData(revRes.data.data || {});
      setSummary(sumRes.data.data || {});
    } catch (e) { error("Không tải dữ liệu doanh thu"); }
    finally { setLoading(false); }
  };

  const months = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
  const revenues = data.monthlyRevenue || [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>💰 Báo cáo doanh thu</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Thống kê doanh thu theo tháng trong năm</p>
        </div>
        <select className="form-input" style={{ width: 140 }} value={year} onChange={e => setYear(Number(e.target.value))}>
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="stats-grid">
        <div className="stat-card success">
          <div className="stat-label">Doanh thu năm {year}</div>
          <div className="stat-value">{formatCurrency(data.totalRevenue || summary.yearlyRevenue)} đ</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-label">Doanh thu tháng này</div>
          <div className="stat-value">{formatCurrency(summary.monthlyRevenue)} đ</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tổng booking năm</div>
          <div className="stat-value">{data.totalBookings || 0}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Doanh thu hôm nay</div>
          <div className="stat-value">{formatCurrency(summary.todayRevenue)} đ</div>
        </div>
      </div>

      {/* Revenue table */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>📊 Chi tiết doanh thu theo tháng - Năm {year}</h3>
        {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
          <table>
            <thead><tr><th>Tháng</th><th>Số booking</th><th>Doanh thu (VND)</th></tr></thead>
            <tbody>
              {months.map((m, i) => {
                const r = revenues[i] || {};
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{m}</td>
                    <td>{r.bookingCount || 0}</td>
                    <td style={{ fontWeight: 700, color: "var(--success)" }}>{formatCurrency(r.revenue || 0)} đ</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: "var(--bg)", fontWeight: 700 }}>
                <td>Tổng cộng</td>
                <td>{revenues.reduce((s, r) => s + (r.bookingCount || 0), 0)}</td>
                <td style={{ color: "var(--primary)", fontSize: 18 }}>{formatCurrency(revenues.reduce((s, r) => s + (r.revenue || 0), 0))} đ</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
