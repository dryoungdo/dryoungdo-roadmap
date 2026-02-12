import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Wrench, ChevronDown, RefreshCw, AlertTriangle } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { supabase } from '../../lib/supabase';
import { initializeData } from '../../lib/supabase-sync';

export function DebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [isSeedingDepts, setIsSeedingDepts] = useState(false);
  const [isSeedingOwners, setIsSeedingOwners] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const items = useRoadmapStore((s) => s.items);
  const departments = useRoadmapStore((s) => s.departments);
  const owners = useRoadmapStore((s) => s.owners);
  const feedbackItems = useRoadmapStore((s) => s.feedbackItems);
  const error = useRoadmapStore((s) => s.error);
  const clearError = useRoadmapStore((s) => s.clearError);
  const addDepartment = useRoadmapStore((s) => s.addDepartment);
  const addOwner = useRoadmapStore((s) => s.addOwner);

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    try {
      const { error } = await supabase.from('departments').select('key', { count: 'exact', head: true });
      setConnectionStatus(error ? 'disconnected' : 'connected');
    } catch {
      setConnectionStatus('disconnected');
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const seedDefaultDepartments = async () => {
    setIsSeedingDepts(true);
    try {
      const defaultDepts = [
        { key: 'clinical', nameTh: 'การแพทย์/คลินิก', nameEn: 'Clinical', color: 'cyan', bgClass: 'bg-emerald-500', textClass: 'text-emerald-400', borderClass: 'border-emerald-500' },
        { key: 'marketing', nameTh: 'การตลาด', nameEn: 'Marketing', color: 'violet', bgClass: 'bg-amber-500', textClass: 'text-amber-400', borderClass: 'border-amber-500' },
        { key: 'hr', nameTh: 'บุคคล/HR', nameEn: 'HR', color: 'amber', bgClass: 'bg-amber-500', textClass: 'text-amber-400', borderClass: 'border-amber-500' },
        { key: 'finance', nameTh: 'การเงิน', nameEn: 'Finance', color: 'pink', bgClass: 'bg-pink-500', textClass: 'text-pink-400', borderClass: 'border-pink-500' },
        { key: 'operations', nameTh: 'ปฏิบัติการ', nameEn: 'Operations', color: 'blue', bgClass: 'bg-blue-500', textClass: 'text-blue-400', borderClass: 'border-blue-500' },
        { key: 'expansion', nameTh: 'ขยายสาขา', nameEn: 'Expansion', color: 'emerald', bgClass: 'bg-emerald-500', textClass: 'text-emerald-400', borderClass: 'border-emerald-500' },
      ];

      for (const dept of defaultDepts) {
        await addDepartment(dept);
      }
      console.log('Default departments seeded successfully');
    } catch (err) {
      console.error('Failed to seed departments:', err);
    } finally {
      setIsSeedingDepts(false);
    }
  };

  const seedDefaultOwners = async () => {
    setIsSeedingOwners(true);
    try {
      const defaultOwners = [
        { key: 'CEO', label: 'CEO', color: 'purple' },
        { key: 'GM', label: 'GM', color: 'cyan' },
        { key: 'shared', label: 'Shared', color: 'amber' },
      ];

      for (const owner of defaultOwners) {
        await addOwner(owner);
      }
      console.log('Default owners seeded successfully');
    } catch (err) {
      console.error('Failed to seed owners:', err);
    } finally {
      setIsSeedingOwners(false);
    }
  };

  const reloadAllData = async () => {
    setIsReloading(true);
    try {
      await initializeData();
      console.log('Data reloaded successfully');
    } catch (err) {
      console.error('Failed to reload data:', err);
    } finally {
      setIsReloading(false);
    }
  };

  const hasDeptWarning = departments.length === 0;
  const hasOwnerWarning = owners.length === 0;

  return (
    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <Bug className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white font-thai">Debug Panel</h3>
          <Wrench className="w-4 h-4 text-white/40" />
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-6">
              {/* Connection Status */}
              <div>
                <h4 className="text-sm font-medium text-white/80 font-thai mb-3">Connection Status</h4>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'connected'
                          ? 'bg-emerald-400'
                          : connectionStatus === 'disconnected'
                          ? 'bg-red-400'
                          : 'bg-white/40'
                      }`}
                    />
                    <span className="text-white/80 text-sm font-thai">
                      {connectionStatus === 'connected'
                        ? 'Connected'
                        : connectionStatus === 'disconnected'
                        ? 'Disconnected'
                        : 'Unknown'}
                    </span>
                  </div>
                  <button
                    onClick={checkConnection}
                    disabled={isCheckingConnection}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg transition-colors border border-white/10 text-sm font-thai disabled:opacity-40"
                  >
                    {isCheckingConnection ? 'Checking...' : 'Check'}
                  </button>
                </div>
              </div>

              {/* Table Row Counts */}
              <div>
                <h4 className="text-sm font-medium text-white/80 font-thai mb-3">Table Row Counts</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/60 text-sm font-thai">Roadmap Items</span>
                    <span className="text-white font-medium">{items.length}</span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-3 bg-white/5 rounded-lg border ${
                      hasDeptWarning ? 'border-amber-400/50 border-l-2 border-l-amber-400 pl-3' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {hasDeptWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      <span className="text-white/60 text-sm font-thai">Departments</span>
                    </div>
                    <span className={`font-medium ${hasDeptWarning ? 'text-amber-400' : 'text-white'}`}>
                      {departments.length}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-3 bg-white/5 rounded-lg border ${
                      hasOwnerWarning ? 'border-amber-400/50 border-l-2 border-l-amber-400 pl-3' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {hasOwnerWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      <span className="text-white/60 text-sm font-thai">Owners</span>
                    </div>
                    <span className={`font-medium ${hasOwnerWarning ? 'text-amber-400' : 'text-white'}`}>
                      {owners.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/60 text-sm font-thai">Feedback</span>
                    <span className="text-white font-medium">{feedbackItems.length}</span>
                  </div>
                </div>
              </div>

              {/* Last Error */}
              {error && (
                <div>
                  <h4 className="text-sm font-medium text-white/80 font-thai mb-3">Last Error</h4>
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                    <p className="text-red-400 text-sm font-mono mb-2">{error}</p>
                    <button
                      onClick={clearError}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/50 text-sm font-thai"
                    >
                      Clear Error
                    </button>
                  </div>
                </div>
              )}

              {/* Auto-Fix Actions */}
              <div>
                <h4 className="text-sm font-medium text-white/80 font-thai mb-3">Auto-Fix Actions</h4>
                <div className="space-y-2">
                  {departments.length === 0 && (
                    <button
                      onClick={seedDefaultDepartments}
                      disabled={isSeedingDepts}
                      className="w-full px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/50 text-sm font-thai disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSeedingDepts ? 'Seeding Departments...' : 'Seed Default Departments'}
                    </button>
                  )}
                  {owners.length === 0 && (
                    <button
                      onClick={seedDefaultOwners}
                      disabled={isSeedingOwners}
                      className="w-full px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors border border-amber-500/50 text-sm font-thai disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSeedingOwners ? 'Seeding Owners...' : 'Seed Default Owners'}
                    </button>
                  )}
                  <button
                    onClick={reloadAllData}
                    disabled={isReloading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm font-thai disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
                    {isReloading ? 'Reloading...' : 'Reload All Data'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
