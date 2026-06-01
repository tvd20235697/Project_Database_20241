import React, { useState, useEffect } from "react";
import { getFields, createField, updateField, deleteField, getBranches, getTimeSlots, createTimeSlot, deleteTimeSlot } from "../../../api/adminApi";
import { useToast } from "../../../hooks/useToast";

const formatCurrency = (v) => v ? Number(v).toLocaleString("vi-VN") : "0";

export default function FieldManager() {
  const { success, error } = useToast();
  const [fields, setFields] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ tenSan: "", loaiSan: "", giaSan: "", chiNhanhId: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotForm, setSlotForm] = useState({ gioBatDau: "", gioKetThuc: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [fRes, bRes] = await Promise.all([getFields(), getBranches()]);
      setFields(fRes.data.data || []);
      setBranches(bRes.data.data || []);
    } catch (e) { error("Không tải dữ liệu"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const loadSlots = async (field) => {
    setSelectedField(field);
    setLoadingSlots(true);
    try {
      const res = await getTimeSlots(field.id);
      setTimeSlots(res.data.data || []);
    } catch (e) { error("Không tải khung giờ"); }
    finally { setLoadingSlots(false); }
  };

  const openAdd = () => { setEditItem(null); setForm({ tenSan: "", loaiSan: "", giaSan: "", chiNhanhId: "" }); setShowForm(true); };
  const openEdit = (f) => { setEditItem(f); setForm({ tenSan: f.tenSan, loaiSan: f.loaiSan, giaSan: f.giaSan, chiNhanhId: f.branchId || f.chiNhanhId }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.tenSan.trim() || !form.loaiSan || !form.giaSan || !form.chiNhanhId) { error("Vui lòng nhập đầy đủ"); return; }
    setSaving(true);
    try {
      const payload = { tenSan: form.tenSan, loaiSan: form.loaiSan, giaSan: Number(form.giaSan), chiNhanhId: Number(form.chiNhanhId) };
      if (editItem) { await updateField(editItem.id, payload); success("Cập nhật thành công"); }
      else { await createField(payload); success("Thêm sân thành công"); }
      setShowForm(false); load();
    } catch (e) { error(e.response?.data?.message || "Lưu thất bại"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteField(id); success("Xóa sân thành công"); setConfirmDelete(null); load(); }
    catch (e) { error(e.response?.data?.message || "Xóa thất bại"); }
  };

  const handleAddSlot = async () => {
    if (!slotForm.gioBatDau || !slotForm.gioKetThuc) { error("Vui lòng nhập đầy đủ giờ"); return; }
    try {
      await createTimeSlot(selectedField.id, slotForm);
      success("Thêm khung giờ thành công");
      setShowSlotForm(false);
      setSlotForm({ gioBatDau: "", gioKetThuc: "" });
      loadSlots(selectedField);
    } catch (e) { error(e.response?.data?.message || "Thêm thất bại"); }
  };

  const handleDeleteSlot = async (id) => {
    try { await deleteTimeSlot(id); success("Xóa khung giờ thành công"); loadSlots(selectedField); }
    catch (e) { error(e.response?.data?.message || "Xóa thất bại"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>🏟️ Quản lý sân bóng</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Thêm, sửa, xóa sân và quản lý khung giờ</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Thêm sân</button>
      </div>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> :
       fields.length === 0 ? <div className="empty-state"><h3>Chưa có sân nào</h3></div> : (
        <table>
          <thead><tr><th>ID</th><th>Tên sân</th><th>Loại</th><th>Chi nhánh</th><th>Giá (VND)</th><th>Thao tác</th></tr></thead>
          <tbody>
            {fields.map(f => (
              <tr key={f.id}>
                <td>#{f.id}</td>
                <td style={{ fontWeight: 600 }}>{f.tenSan}</td>
                <td><span className="badge badge-primary">{f.loaiSan}</span></td>
                <td>{f.tenChiNhanh}</td>
                <td style={{ fontWeight: 600, color: "var(--primary)" }}>{formatCurrency(f.giaSan)}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => loadSlots(f)}>🕐 Giờ</button>
                  <button className="btn btn-outline btn-sm" style={{ marginLeft: 4 }} onClick={() => openEdit(f)}>Sửa</button>
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: 4 }} onClick={() => setConfirmDelete(f.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Time Slots Modal */}
      {selectedField && (
        <div className="modal-overlay" onClick={() => setSelectedField(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🕐 Khung giờ: {selectedField.tenSan}</h2>
              <button className="modal-close" onClick={() => setSelectedField(null)}>×</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: 0 }}>{timeSlots.length} khung giờ</p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowSlotForm(true)}>+ Thêm khung giờ</button>
            </div>
            {loadingSlots ? <div className="loading-spinner"><div className="spinner"></div></div> : (
              <div className="slots-grid">
                {timeSlots.map(s => (
                  <div key={s.id} className="slot" style={{ cursor: "default" }}>
                    <span className="slot-time">{s.gioBatDau?.slice(0,5)} - {s.gioKetThuc?.slice(0,5)}</span>
                    <button className="btn btn-danger btn-sm" style={{ marginTop: 8 }} onClick={() => handleDeleteSlot(s.id)}>Xóa</button>
                  </div>
                ))}
                {timeSlots.length === 0 && <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text-secondary)", padding: 20 }}>Chưa có khung giờ nào</p>}
              </div>
            )}
            {showSlotForm && (
              <div style={{ marginTop: 16, padding: 16, background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                <h4 style={{ marginBottom: 12 }}>Thêm khung giờ mới</h4>
                <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
                  <div className="form-group" style={{ margin: 0, flex: 1 }}>
                    <label className="form-label">Giờ bắt đầu</label>
                    <input type="time" className="form-input" value={slotForm.gioBatDau} onChange={e => setSlotForm(p => ({ ...p, gioBatDau: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ margin: 0, flex: 1 }}>
                    <label className="form-label">Giờ kết thúc</label>
                    <input type="time" className="form-input" value={slotForm.gioKetThuc} onChange={e => setSlotForm(p => ({ ...p, gioKetThuc: e.target.value }))} />
                  </div>
                  <button className="btn btn-primary" onClick={handleAddSlot}>Thêm</button>
                  <button className="btn btn-outline" onClick={() => setShowSlotForm(false)}>Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? "✏️ Sửa sân" : "➕ Thêm sân mới"}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Tên sân</label>
              <input className="form-input" value={form.tenSan} onChange={e => setForm(p => ({ ...p, tenSan: e.target.value }))} placeholder="VD: Sân A" />
            </div>
            <div className="form-group">
              <label className="form-label">Loại sân</label>
              <select className="form-input" value={form.loaiSan} onChange={e => setForm(p => ({ ...p, loaiSan: e.target.value }))}>
                <option value="">-- Chọn loại sân --</option>
                <option value="5 người">5 người</option>
                <option value="7 người">7 người</option>
                <option value="11 người">11 người</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Giá thuê (VND)</label>
              <input type="number" className="form-input" value={form.giaSan} onChange={e => setForm(p => ({ ...p, giaSan: e.target.value }))} placeholder="VD: 150000" />
            </div>
            <div className="form-group">
              <label className="form-label">Chi nhánh</label>
              <select className="form-input" value={form.chiNhanhId} onChange={e => setForm(p => ({ ...p, chiNhanhId: e.target.value }))}>
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.tenChiNhanh}</option>)}
              </select>
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
            <p>Xóa sân này sẽ xóa tất cả dữ liệu liên quan. Tiếp tục?</p>
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
