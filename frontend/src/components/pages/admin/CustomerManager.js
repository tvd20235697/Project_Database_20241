import React, { useState, useEffect } from "react";
import { getCustomers } from "../../../api/adminApi";
import { useToast } from "../../../hooks/useToast";

export default function CustomerManager() {
  const { error } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data.data || []);
    } catch (e) { error("Không tải danh sách khách hàng"); }
    finally { setLoading(false); }
  };

  const filtered = customers.filter(c =>
    !search || (c.hoTen && c.hoTen.toLowerCase().includes(search.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>👥 Quản lý khách hàng</h1>
        <p className="page-subtitle" style={{ margin: 0 }}>Danh sách tài khoản khách hàng trên hệ thống</p>
      </div>
      <div className="filter-bar">
        <input className="form-input" style={{ width: 300 }} placeholder="🔍 Tìm theo tên hoặc email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> :
       filtered.length === 0 ? <div className="empty-state"><h3>Không có khách hàng nào</h3></div> : (
        <table>
          <thead><tr><th>ID</th><th>Họ tên</th><th>Email</th><th>Số điện thoại</th><th>Ngày đăng ký</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td style={{ fontWeight: 600 }}>{c.hoTen || "—"}</td>
                <td>{c.email}</td>
                <td>{c.soDienThoai || "—"}</td>
                <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString("vi-VN") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: 14 }}>Tổng cộng: {filtered.length} khách hàng</p>
    </div>
  );
}
