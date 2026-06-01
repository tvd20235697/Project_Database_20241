import React, { useState, useEffect } from "react";
import { getBranches, createBranch, updateBranch, deleteBranch } from "../../../api/adminApi";
import { useToast } from "../../../hooks/useToast";

export default function BranchManager() {
  const { success, error } = useToast();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tenChiNhanh: "", diaChi: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBranches();
      setBranches(res.data.data || []);
    } catch (e) { error("Không tải danh sách chi nhánh"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ tenChiNhanh: "", diaChi: "" }); setShowForm(true); };
  const openEdit = (b) => { setEditItem(b); setForm({ tenChiNhanh: b.tenChiNhanh, diaChi: b.diaChi }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.tenChiNhanh.trim() || !form.diaChi.trim()) { error("Vui lòng nhập đầy đủ thông tin"); return; }
    setSaving(true);
    try {
      if (editItem) {
        await updateBranch(editItem.id, form);
        success("Cập nhật chi nhánh thành công");
      } else {
        await createBranch(form);
        success("Thêm chi nhánh thành công");
      }
      setShowForm(false);
      load();
    } catch (e) { error(e.response?.data?.message || "Lưu thất bại"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBranch(id);
      success("Xóa chi nhánh thành công");
      setConfirmDelete(null);
      load();
    } catch (e) { error(e.response?.data?.message || "Xóa thất bại"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>🏢 Quản lý chi nhánh</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Thêm, sửa, xóa chi nhánh sân bóng</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Thêm chi nhánh</button>
      </div>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> :
       branches.length === 0 ? <div className="empty-state"><h3>Chưa có chi nhánh nào</h3></div> : (
        <table>
          <thead><tr><th>ID</th><th>Tên chi nhánh</th><th>Địa chỉ</th><th>Thao tác</th></tr></thead>
          <tbody>
            {branches.map(b => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td style={{ fontWeight: 600 }}>{b.tenChiNhanh}</td>
                <td>{b.diaChi}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}>Sửa</button>
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={() => setConfirmDelete(b.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? "✏️ Sửa chi nhánh" : "➕ Thêm chi nhánh mới"}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Tên chi nhánh</label>
              <input className="form-input" value={form.tenChiNhanh} onChange={e => setForm(p => ({ ...p, tenChiNhanh: e.target.value }))} placeholder="VD: Chi nhánh Cầu Giấy" />
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ</label>
              <input className="form-input" value={form.diaChi} onChange={e => setForm(p => ({ ...p, diaChi: e.target.value }))} placeholder="VD: Số 123, Cầu Giấy, Hà Nội" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Đang lưu..." : "Lưu"}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal confirm-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h2>⚠️ Xác nhận xóa</h2>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <p>Bạn có chắc muốn xóa chi nhánh này? Hành động này không thể hoàn tác.</p>
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
