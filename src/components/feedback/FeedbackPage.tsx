import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Send, Clock, CheckCircle2, AlertCircle, HelpCircle, Lightbulb, Bug, Sparkles } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import type { FeedbackCategory } from '../../types';

const CATEGORIES: { key: FeedbackCategory; label: string; icon: typeof Bug }[] = [
  { key: 'feature_request', label: 'ขอฟีเจอร์ใหม่', icon: Lightbulb },
  { key: 'bug', label: 'แจ้งปัญหา/บัก', icon: Bug },
  { key: 'improvement', label: 'ปรับปรุง', icon: Sparkles },
  { key: 'question', label: 'คำถาม', icon: HelpCircle },
  { key: 'other', label: 'อื่นๆ', icon: MessageSquarePlus },
];

const PRIORITY_OPTIONS = [
  { key: 'low' as const, label: 'ต่ำ', color: 'text-gray-400 bg-gray-500/20' },
  { key: 'medium' as const, label: 'กลาง', color: 'text-yellow-400 bg-yellow-500/20' },
  { key: 'high' as const, label: 'สูง', color: 'text-red-400 bg-red-500/20' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: 'ใหม่', color: 'text-blue-400 bg-blue-500/20', icon: Clock },
  acknowledged: { label: 'รับทราบ', color: 'text-emerald-400 bg-emerald-500/20', icon: CheckCircle2 },
  in_progress: { label: 'กำลังดำเนินการ', color: 'text-yellow-400 bg-yellow-500/20', icon: AlertCircle },
  resolved: { label: 'แก้ไขแล้ว', color: 'text-green-400 bg-green-500/20', icon: CheckCircle2 },
  wont_fix: { label: 'ไม่ดำเนินการ', color: 'text-gray-400 bg-gray-500/20', icon: AlertCircle },
};

export function FeedbackPage() {
  const feedbackItems = useRoadmapStore((s) => s.feedbackItems);
  const currentUser = useRoadmapStore((s) => s.currentUser);
  const addFeedback = useRoadmapStore((s) => s.addFeedback);
  const updateFeedbackStatus = useRoadmapStore((s) => s.updateFeedbackStatus);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('feature_request');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isCEO = currentUser?.email?.includes('ceo');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title.trim() || !description.trim()) return;
    setIsSubmitting(true);

    await addFeedback({
      user_id: currentUser.id,
      user_email: currentUser.email,
      category,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'new',
    });

    setTitle('');
    setDescription('');
    setCategory('feature_request');
    setPriority('medium');
    setIsSubmitting(false);
    setShowForm(false);
  };

  const sortedFeedback = useMemo(() => {
    return [...feedbackItems].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [feedbackItems]);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">ข้อเสนอแนะ</h2>
          <p className="text-white/60 text-sm font-thai mt-1">
            แจ้งฟีเจอร์ที่ต้องการ ปัญหาที่พบ หรือข้อเสนอแนะต่างๆ
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/50"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span className="hidden sm:inline font-thai">เพิ่มข้อเสนอแนะ</span>
        </button>
      </div>

      {/* Submit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">หัวข้อ</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-thai"
                  placeholder="สรุปสั้นๆ ว่าต้องการอะไร"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">ประเภท</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setCategory(cat.key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-thai transition-colors border ${
                          category === cat.key
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">ความสำคัญ</label>
                <div className="flex gap-2">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setPriority(opt.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-thai transition-colors border ${
                        priority === opt.key
                          ? `${opt.color} border-current`
                          : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-thai mb-2">รายละเอียด</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-thai resize-none"
                  placeholder="อธิบายรายละเอียดเพิ่มเติม..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-white/60 hover:text-white font-thai transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg font-semibold font-thai transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อเสนอแนะ'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback List */}
      <div className="space-y-3">
        {sortedFeedback.length === 0 ? (
          <div className="text-center py-12 text-white/40 font-thai">
            <MessageSquarePlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>ยังไม่มีข้อเสนอแนะ</p>
            <p className="text-sm mt-1">กดปุ่มด้านบนเพื่อเพิ่มข้อเสนอแนะแรก</p>
          </div>
        ) : (
          sortedFeedback.map((item) => {
            const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
            const StatusIcon = statusCfg.icon;
            const catCfg = CATEGORIES.find((c) => c.key === item.category);
            const CatIcon = catCfg?.icon || MessageSquarePlus;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-thai ${statusCfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-white/60 bg-white/5">
                        <CatIcon className="w-3 h-3" />
                        {catCfg?.label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.priority === 'high' ? 'text-red-400 bg-red-500/20' :
                        item.priority === 'medium' ? 'text-yellow-400 bg-yellow-500/20' :
                        'text-gray-400 bg-gray-500/20'
                      }`}>
                        {item.priority === 'high' ? 'สูง' : item.priority === 'medium' ? 'กลาง' : 'ต่ำ'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white font-thai">{item.title}</h3>
                    <p className="text-white/60 text-sm font-thai mt-1 whitespace-pre-wrap">{item.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-white/40">
                      <span>{item.user_email.split('@')[0]}</span>
                      <span>{new Date(item.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* CEO can update feedback status */}
                  {isCEO && item.status !== 'resolved' && (
                    <div className="flex flex-col gap-1">
                      {item.status === 'new' && (
                        <button
                          onClick={() => updateFeedbackStatus(item.id, 'acknowledged')}
                          className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 font-thai transition-colors"
                        >
                          รับทราบ
                        </button>
                      )}
                      <button
                        onClick={() => updateFeedbackStatus(item.id, 'resolved')}
                        className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 font-thai transition-colors"
                      >
                        แก้ไขแล้ว
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
