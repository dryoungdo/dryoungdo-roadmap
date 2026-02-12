import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Building2, Users, Pencil, Save, X } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { DebugPanel } from '../shared/DebugPanel';

const AVAILABLE_COLORS = [
  { name: 'cyan', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500' },
  { name: 'violet', bg: 'bg-violet-500', text: 'text-violet-400', border: 'border-violet-500' },
  { name: 'amber', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500' },
  { name: 'pink', bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500' },
  { name: 'blue', bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500' },
  { name: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500' },
  { name: 'red', bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500' },
  { name: 'orange', bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500' },
  { name: 'teal', bg: 'bg-teal-500', text: 'text-teal-400', border: 'border-teal-500' },
  { name: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500' },
  { name: 'rose', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500' },
  { name: 'lime', bg: 'bg-lime-500', text: 'text-lime-400', border: 'border-lime-500' },
];

const INPUT_CLASS = 'px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-thai text-sm';

export function SettingsPage() {
  const { departments, owners, addDepartment, updateDepartment, removeDepartment, addOwner, updateOwner, removeOwner } = useRoadmapStore();

  // Department form (add new)
  const [newDeptNameTh, setNewDeptNameTh] = useState('');
  const [newDeptNameEn, setNewDeptNameEn] = useState('');
  const [newDeptColor, setNewDeptColor] = useState('cyan');

  // Department edit state
  const [editingDeptKey, setEditingDeptKey] = useState<string | null>(null);
  const [editDeptNameTh, setEditDeptNameTh] = useState('');
  const [editDeptNameEn, setEditDeptNameEn] = useState('');
  const [editDeptColor, setEditDeptColor] = useState('');

  // Owner form (add new)
  const [newOwnerKey, setNewOwnerKey] = useState('');
  const [newOwnerLabel, setNewOwnerLabel] = useState('');

  // Owner edit state
  const [editingOwnerKey, setEditingOwnerKey] = useState<string | null>(null);
  const [editOwnerLabel, setEditOwnerLabel] = useState('');

  // --- Department handlers ---
  const handleAddDepartment = () => {
    if (!newDeptNameTh.trim() || !newDeptNameEn.trim()) return;
    const key = newDeptNameEn.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (departments.some(d => d.key === key)) return;
    const colorConfig = AVAILABLE_COLORS.find(c => c.name === newDeptColor) || AVAILABLE_COLORS[0];
    addDepartment({
      key,
      nameTh: newDeptNameTh.trim(),
      nameEn: newDeptNameEn.trim(),
      color: colorConfig.name,
      bgClass: colorConfig.bg,
      textClass: colorConfig.text,
      borderClass: colorConfig.border,
    });
    setNewDeptNameTh('');
    setNewDeptNameEn('');
  };

  const startEditDept = (key: string) => {
    const dept = departments.find(d => d.key === key);
    if (!dept) return;
    setEditingDeptKey(key);
    setEditDeptNameTh(dept.nameTh);
    setEditDeptNameEn(dept.nameEn);
    setEditDeptColor(dept.color);
  };

  const cancelEditDept = () => {
    setEditingDeptKey(null);
  };

  const saveEditDept = () => {
    if (!editingDeptKey || !editDeptNameTh.trim() || !editDeptNameEn.trim()) return;
    const colorConfig = AVAILABLE_COLORS.find(c => c.name === editDeptColor) || AVAILABLE_COLORS[0];
    updateDepartment(editingDeptKey, {
      nameTh: editDeptNameTh.trim(),
      nameEn: editDeptNameEn.trim(),
      color: colorConfig.name,
      bgClass: colorConfig.bg,
      textClass: colorConfig.text,
      borderClass: colorConfig.border,
    });
    setEditingDeptKey(null);
  };

  // --- Owner handlers ---
  const handleAddOwner = () => {
    if (!newOwnerLabel.trim()) return;
    const key = newOwnerKey.trim() || newOwnerLabel.trim();
    if (owners.some(o => o.key === key)) return;
    addOwner({ key, label: newOwnerLabel.trim(), color: 'purple' });
    setNewOwnerKey('');
    setNewOwnerLabel('');
  };

  const startEditOwner = (key: string) => {
    const owner = owners.find(o => o.key === key);
    if (!owner) return;
    setEditingOwnerKey(key);
    setEditOwnerLabel(owner.label);
  };

  const cancelEditOwner = () => {
    setEditingOwnerKey(null);
  };

  const saveEditOwner = () => {
    if (!editingOwnerKey || !editOwnerLabel.trim()) return;
    updateOwner(editingOwnerKey, { label: editOwnerLabel.trim() });
    setEditingOwnerKey(null);
  };

  return (
    <div className="h-full overflow-auto p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-white font-thai">ตั้งค่า</h2>
          <p className="text-white/60 font-thai mt-1">จัดการแผนกและเจ้าของโปรเจกต์</p>
        </div>

        {/* ===== Departments Section ===== */}
        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white font-thai">แผนก</h3>
            <span className="text-white/40 text-sm">({departments.length})</span>
          </div>

          {/* Existing departments */}
          <div className="space-y-2 mb-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                {editingDeptKey === dept.key ? (
                  /* --- Edit mode --- */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={editDeptNameTh}
                        onChange={(e) => setEditDeptNameTh(e.target.value)}
                        placeholder="ชื่อภาษาไทย"
                        className={INPUT_CLASS}
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editDeptNameEn}
                        onChange={(e) => setEditDeptNameEn(e.target.value)}
                        placeholder="English name"
                        className={INPUT_CLASS}
                      />
                      <select
                        value={editDeptColor}
                        onChange={(e) => setEditDeptColor(e.target.value)}
                        className={INPUT_CLASS}
                      >
                        {AVAILABLE_COLORS.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={cancelEditDept}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg transition-colors border border-white/10 text-sm font-thai"
                      >
                        <X className="w-3.5 h-3.5" />
                        ยกเลิก
                      </button>
                      <button
                        onClick={saveEditDept}
                        disabled={!editDeptNameTh.trim() || !editDeptNameEn.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/50 text-sm font-thai disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Save className="w-3.5 h-3.5" />
                        บันทึก
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- View mode --- */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${dept.bgClass}`} />
                      <span className={`font-thai font-medium ${dept.textClass}`}>{dept.nameTh}</span>
                      <span className="text-white/40 text-sm">({dept.nameEn})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditDept(dept.key)}
                        className="p-2 text-white/40 hover:text-emerald-400 transition-colors"
                        title="แก้ไข"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeDepartment(dept.key)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Add new department */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm text-white/60 font-thai mb-3">เพิ่มแผนกใหม่</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newDeptNameTh}
                onChange={(e) => setNewDeptNameTh(e.target.value)}
                placeholder="ชื่อภาษาไทย"
                className={INPUT_CLASS}
              />
              <input
                type="text"
                value={newDeptNameEn}
                onChange={(e) => setNewDeptNameEn(e.target.value)}
                placeholder="English name"
                className={INPUT_CLASS}
              />
              <div className="flex gap-2">
                <select
                  value={newDeptColor}
                  onChange={(e) => setNewDeptColor(e.target.value)}
                  className={'flex-1 ' + INPUT_CLASS}
                >
                  {AVAILABLE_COLORS.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddDepartment}
                  disabled={!newDeptNameTh.trim() || !newDeptNameEn.trim()}
                  className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Owners Section ===== */}
        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white font-thai">เจ้าของโปรเจกต์</h3>
            <span className="text-white/40 text-sm">({owners.length})</span>
          </div>

          {/* Existing owners */}
          <div className="space-y-2 mb-6">
            {owners.map((owner, index) => (
              <motion.div
                key={owner.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                {editingOwnerKey === owner.key ? (
                  /* --- Edit mode --- */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editOwnerLabel}
                        onChange={(e) => setEditOwnerLabel(e.target.value)}
                        placeholder="ชื่อที่แสดง"
                        className={INPUT_CLASS}
                        autoFocus
                      />
                      <div className="flex items-center gap-2 text-white/40 text-sm font-thai px-3">
                        Key: {owner.key}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={cancelEditOwner}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg transition-colors border border-white/10 text-sm font-thai"
                      >
                        <X className="w-3.5 h-3.5" />
                        ยกเลิก
                      </button>
                      <button
                        onClick={saveEditOwner}
                        disabled={!editOwnerLabel.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/50 text-sm font-thai disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Save className="w-3.5 h-3.5" />
                        บันทึก
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- View mode --- */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="font-thai font-medium text-amber-400">{owner.label}</span>
                      {owner.key !== owner.label && (
                        <span className="text-white/40 text-sm">({owner.key})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditOwner(owner.key)}
                        className="p-2 text-white/40 hover:text-amber-400 transition-colors"
                        title="แก้ไข"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeOwner(owner.key)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Add new owner */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm text-white/60 font-thai mb-3">เพิ่มเจ้าของใหม่</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newOwnerLabel}
                onChange={(e) => setNewOwnerLabel(e.target.value)}
                placeholder="ชื่อที่แสดง (เช่น COO)"
                className={INPUT_CLASS}
              />
              <input
                type="text"
                value={newOwnerKey}
                onChange={(e) => setNewOwnerKey(e.target.value)}
                placeholder="Key (optional)"
                className={INPUT_CLASS}
              />
              <button
                onClick={handleAddOwner}
                disabled={!newOwnerLabel.trim()}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors border border-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="font-thai">เพิ่ม</span>
              </button>
            </div>
          </div>
        </section>

        {/* ===== Debug Panel ===== */}
        <DebugPanel />
      </div>
    </div>
  );
}
