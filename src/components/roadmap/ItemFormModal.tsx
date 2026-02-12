import { useState, useEffect } from 'react';
import { X, Trash2, Link2, Plus, AlertTriangle, CheckCircle2, Circle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { PRIORITIES, STATUSES } from '../../constants';
import type { Department, Priority, ItemStatus, Owner, Milestone } from '../../types';

export function ItemFormModal() {
  const { editingItem, setEditingItem, setShowForm, addItem, updateItem, deleteItem, newItemDefaults, setNewItemDefaults } =
    useRoadmapStore();
  const departments = useRoadmapStore((state) => state.departments);
  const owners = useRoadmapStore((state) => state.owners);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    notes: '',
    department: '' as Department,
    priority: 'P2' as Priority,
    status: 'planned' as ItemStatus,
    owner: '' as Owner,
    startDate: '',
    endDate: '',
    progress: 0,
    links: [] as { id: string; title: string; url: string }[],
    milestones: [] as Milestone[],
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        subtitle: editingItem.subtitle || '',
        notes: editingItem.notes || '',
        department: editingItem.department,
        priority: editingItem.priority,
        status: editingItem.status,
        owner: editingItem.owner,
        startDate: editingItem.startDate,
        endDate: editingItem.endDate,
        progress: editingItem.progress,
        links: editingItem.links || [],
        milestones: editingItem.milestones || [],
      });
    } else {
      // Set defaults only when creating new item
      const defaults = newItemDefaults;
      setFormData((prev) => ({
        ...prev,
        department: (defaults?.department as Department) || (departments[0]?.key as Department) || ('' as Department),
        owner: (owners[0]?.key as Owner) || ('' as Owner),
        startDate: defaults?.startDate || '',
        endDate: defaults?.endDate || '',
        milestones: [],
      }));
    }
  }, [editingItem, departments, owners, newItemDefaults]);

  const handleClose = () => {
    setEditingItem(null);
    setShowForm(false);
    setNewItemDefaults(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const calculatedProgress = formData.milestones.length > 0
      ? Math.round((formData.milestones.filter(m => m.completed).length / formData.milestones.length) * 100)
      : formData.progress;

    if (editingItem) {
      updateItem(editingItem.id, { ...formData, progress: calculatedProgress });
    } else {
      addItem({
        ...formData,
        progress: calculatedProgress,
        dependencies: [],
      });
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingItem && confirm('ยืนยันการลบรายการนี้?')) {
      deleteItem(editingItem.id);
      handleClose();
    }
  };

  const handleDuplicate = () => {
    if (!editingItem) return;
    addItem({
      title: editingItem.title + ' (Copy)',
      subtitle: editingItem.subtitle,
      department: editingItem.department,
      priority: editingItem.priority,
      status: 'planned',
      owner: editingItem.owner,
      startDate: editingItem.startDate,
      endDate: editingItem.endDate,
      progress: 0,
      milestones: editingItem.milestones.map(m => ({
        ...m,
        id: crypto.randomUUID(),
        completed: false,
      })),
      dependencies: [],
      links: editingItem.links ? editingItem.links.map(l => ({
        ...l,
        id: crypto.randomUUID(),
      })) : [],
      notes: editingItem.notes,
    });
    handleClose();
  };

  const hasEmptyConfig = departments.length === 0 || owners.length === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface/95 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white font-thai">
              {editingItem ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
            </h2>
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Warning Banner */}
            {hasEmptyConfig && (
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-200 font-thai text-sm">
                    กรุณาเพิ่มแผนกและเจ้าของในหน้าตั้งค่าก่อน
                  </p>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-white/80 text-sm font-thai mb-2">
                ชื่อรายการ *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-thai"
                placeholder="เช่น เปิดสาขาใหม่ที่เชียงใหม่"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-white/80 text-sm font-thai mb-2">
                รายละเอียดเพิ่มเติม
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-thai"
                placeholder="รายละเอียดสั้นๆ"
              />
            </div>

            {/* Department & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">แผนก *</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value as Department })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-thai"
                  disabled={departments.length === 0}
                >
                  {departments.length === 0 && <option value="">ไม่มีแผนก</option>}
                  {departments.map((dept) => (
                    <option key={dept.key} value={dept.key}>
                      {dept.nameTh}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">
                  ลำดับความสำคัญ *
                </label>
                <div className="flex gap-2">
                  {PRIORITIES.map((priority) => (
                    <button
                      key={priority.key}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, priority: priority.key })
                      }
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold font-thai transition-all ${
                        formData.priority === priority.key
                          ? priority.color === 'red'
                            ? 'bg-red-500 text-white'
                            : priority.color === 'orange'
                            ? 'bg-orange-500 text-white'
                            : priority.color === 'yellow'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-500 text-white'
                          : 'bg-white/5 text-white/60 border border-white/10'
                      }`}
                    >
                      {priority.key}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status & Owner */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">สถานะ *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as ItemStatus })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-thai"
                >
                  {STATUSES.map((status) => (
                    <option key={status.key} value={status.key}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">เจ้าของ *</label>
                {owners.length === 0 ? (
                  <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/40 font-thai text-sm flex items-center justify-center">
                    ไม่มีเจ้าของที่กำหนดไว้
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {owners.map((owner) => (
                      <button
                        key={owner.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, owner: owner.key as Owner })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-thai transition-all ${
                          formData.owner === owner.key
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 text-white/60 border border-white/10'
                        }`}
                      >
                        {owner.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">วันเริ่ม *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      startDate: newStart,
                      endDate: prev.endDate && prev.endDate < newStart ? newStart : prev.endDate,
                    }));
                  }}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">วันสิ้นสุด *</label>
                <input
                  type="date"
                  required
                  min={formData.startDate || undefined}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Progress */}
            {formData.milestones.length > 0 ? (
              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">
                  ความคืบหน้า (คำนวณอัตโนมัติจากเป้าหมายย่อย)
                </label>
                <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 font-thai text-sm">
                  {formData.milestones.filter(m => m.completed).length} / {formData.milestones.length}
                  {' '}({Math.round((formData.milestones.filter(m => m.completed).length / formData.milestones.length) * 100)}%)
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">
                  ความคืบหน้า: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({ ...formData, progress: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            )}

            {/* Milestones */}
            <div>
              <label className="block text-white/80 text-sm font-thai mb-2">
                เป้าหมายย่อย ({formData.milestones.length})
              </label>

              {/* Existing milestones list */}
              {formData.milestones.length > 0 && (
                <div className="space-y-2 mb-3">
                  {formData.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            milestones: formData.milestones.map((m) =>
                              m.id === milestone.id ? { ...m, completed: !m.completed } : m
                            ),
                          });
                        }}
                        className="flex-shrink-0"
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-white/40" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-thai ${milestone.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                          {milestone.title}
                        </div>
                        <div className="text-xs text-white/40">{milestone.date}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            milestones: formData.milestones.filter((m) => m.id !== milestone.id),
                          });
                        }}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="text-xs text-white/60 font-thai pt-1">
                    ความคืบหน้าอัตโนมัติ: {formData.milestones.filter(m => m.completed).length}/{formData.milestones.length}
                    {' '}({Math.round((formData.milestones.filter(m => m.completed).length / formData.milestones.length) * 100)}%)
                  </div>
                </div>
              )}

              {/* Add new milestone form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  id="milestone-title"
                  placeholder="ชื่อเป้าหมายย่อย"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-thai text-sm"
                />
                <input
                  type="date"
                  id="milestone-date"
                  min={formData.startDate || undefined}
                  max={formData.endDate || undefined}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const titleInput = document.getElementById('milestone-title') as HTMLInputElement;
                    const dateInput = document.getElementById('milestone-date') as HTMLInputElement;
                    if (titleInput.value && dateInput.value) {
                      setFormData({
                        ...formData,
                        milestones: [
                          ...formData.milestones,
                          {
                            id: crypto.randomUUID(),
                            title: titleInput.value,
                            date: dateInput.value,
                            completed: false
                          },
                        ],
                      });
                      titleInput.value = '';
                      dateInput.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors border border-cyan-500/50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Links / References */}
            <div>
              <label className="block text-white/80 text-sm font-thai mb-2">
                ลิงก์อ้างอิง
              </label>

              {/* Existing links list */}
              {formData.links.length > 0 && (
                <div className="space-y-2 mb-3">
                  {formData.links.map((link) => (
                    <div key={link.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                      <Link2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{link.title}</div>
                        <div className="text-xs text-white/40 truncate">{link.url}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            links: formData.links.filter((l) => l.id !== link.id),
                          });
                        }}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new link form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  id="link-title"
                  placeholder="ชื่อลิงก์"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-thai text-sm"
                />
                <input
                  type="url"
                  id="link-url"
                  placeholder="URL"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const titleInput = document.getElementById('link-title') as HTMLInputElement;
                    const urlInput = document.getElementById('link-url') as HTMLInputElement;
                    if (titleInput.value && urlInput.value) {
                      setFormData({
                        ...formData,
                        links: [
                          ...formData.links,
                          { id: crypto.randomUUID(), title: titleInput.value, url: urlInput.value },
                        ],
                      });
                      titleInput.value = '';
                      urlInput.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors border border-cyan-500/50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-white/80 text-sm font-thai mb-2">หมายเหตุ</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-thai resize-none"
                placeholder="บันทึกเพิ่มเติม..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={hasEmptyConfig}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold font-thai transition-colors ${
                  hasEmptyConfig
                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                บันทึก
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold font-thai transition-colors"
              >
                ยกเลิก
              </button>
              {editingItem && (
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 rounded-lg font-semibold font-thai transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              )}
              {editingItem && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-semibold font-thai transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  ลบ
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
