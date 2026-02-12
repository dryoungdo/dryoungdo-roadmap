import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-cyan-500/20 flex items-center justify-center"><Target className="w-10 h-10 text-cyan-400" /></div>
          <h1 className="text-3xl font-bold gradient-text font-display">Dr.Do Roadmap</h1>
          <p className="text-white/60 mt-2 font-thai">Personal Goals & Roadmap</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/80 text-sm font-thai mb-2">อีเมล</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-thai"
                placeholder="your@email.com"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-thai mb-2">รหัสผ่าน</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Password"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-thai text-center"
              >
                อีเมลหรือรหัสผ่านไม่ถูกต้อง
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white rounded-lg font-semibold font-thai transition-colors"
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
