import { useState, useMemo } from 'react';
import { Sparkles, X, Loader2, AlertCircle, History, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { analyzeWithGemini } from '../../lib/gemini';
import { COMPANY_GOALS } from '../../constants';
import { renderMarkdown } from '../../lib/render-markdown';

export function AIAnalysis() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const items = useRoadmapStore((state) => state.items);
  const departments = useRoadmapStore((state) => state.departments);
  const currentUser = useRoadmapStore((state) => state.currentUser);
  const analysisLogs = useRoadmapStore((state) => state.analysisLogs);
  const fetchAnalysisLogs = useRoadmapStore((state) => state.fetchAnalysisLogs);
  const addAnalysisLog = useRoadmapStore((state) => state.addAnalysisLog);

  const strategicLogs = useMemo(
    () => analysisLogs.filter((l) => l.analysisType === 'strategic'),
    [analysisLogs]
  );

  const selectedLog = useMemo(
    () => strategicLogs.find((l) => l.id === selectedLogId),
    [strategicLogs, selectedLogId]
  );

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setActiveTab('current');
    setSelectedLogId(null);

    const result = await analyzeWithGemini({
      goals: COMPANY_GOALS,
      roadmapItems: items,
      departments,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setAnalysis(result.analysis);
      // Auto-save to analysis log
      if (currentUser) {
        await addAnalysisLog({
          userId: currentUser.id,
          userEmail: currentUser.email,
          analysisType: 'strategic',
          itemId: null,
          promptSummary: 'Strategic analysis of full roadmap',
          resultMarkdown: result.analysis,
          modelUsed: 'gemini-2.0-flash',
        });
      }
    }

    setIsLoading(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    fetchAnalysisLogs();
    if (!analysis && !isLoading) {
      handleAnalyze();
    }
  };

  const handleViewLog = (logId: string) => {
    setSelectedLogId(logId);
    setActiveTab('history');
  };

  const displayContent = activeTab === 'history' && selectedLog
    ? selectedLog.resultMarkdown
    : analysis;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
      >
        <Sparkles className="w-5 h-5 text-purple-400" />
        <span className="text-white font-medium">AI Strategic Analysis</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-surface/95 backdrop-blur-md border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">AI Strategic Analysis</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 px-6 pt-4">
                <button
                  onClick={() => { setActiveTab('current'); setSelectedLogId(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'current'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-1.5" />
                  Current
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <History className="w-4 h-4 inline mr-1.5" />
                  History ({strategicLogs.length})
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'history' && !selectedLogId && (
                  <div className="space-y-2">
                    {strategicLogs.length === 0 ? (
                      <p className="text-white/40 text-center py-8">No past analyses yet</p>
                    ) : (
                      strategicLogs.map((log) => (
                        <button
                          key={log.id}
                          onClick={() => handleViewLog(log.id)}
                          className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white/80 text-sm font-medium">
                              {log.promptSummary}
                            </span>
                            <span className="text-white/40 text-xs">
                              {new Date(log.createdAt).toLocaleString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-white/40 text-xs mt-1">
                            {log.resultMarkdown.slice(0, 100)}...
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {(activeTab === 'current' || (activeTab === 'history' && selectedLogId)) && (
                  <>
                    {isLoading && activeTab === 'current' && (
                      <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                        <p className="text-white/60">Analyzing data...</p>
                      </div>
                    )}

                    {error && !isLoading && activeTab === 'current' && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-400 font-medium mb-1">Error</p>
                          <p className="text-red-300/80 text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'history' && selectedLog && (
                      <div className="mb-4 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLogId(null)}
                          className="text-white/50 hover:text-white/80 text-sm"
                        >
                          &larr; Back to list
                        </button>
                        <span className="text-white/30">|</span>
                        <span className="text-white/40 text-xs">
                          {new Date(selectedLog.createdAt).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}

                    {displayContent && !isLoading && (
                      <div className="prose prose-invert max-w-none">
                        {renderMarkdown(displayContent)}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <p className="text-sm text-white/40">Powered by Google Gemini</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {isLoading ? 'Analyzing...' : 'Re-analyze'}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
