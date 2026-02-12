import { useEffect } from 'react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { FilterBar } from './FilterBar';
import { GanttView } from './GanttView';
import { ListView } from './ListView';
import { ItemFormModal } from './ItemFormModal';

export function RoadmapPage() {
  const { showForm, setViewMode } = useRoadmapStore();
  const viewMode = useRoadmapStore((state) => state.viewMode);

  // Set default view mode based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewMode('gantt');
      } else {
        setViewMode('list');
      }
    };

    // Set on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setViewMode]);

  return (
    <div className="h-full flex flex-col">
      {/* Filter Bar */}
      <FilterBar />

      {/* View Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'gantt' ? <GanttView /> : <ListView />}
      </div>

      {/* Form Modal */}
      {showForm && <ItemFormModal />}
    </div>
  );
}
