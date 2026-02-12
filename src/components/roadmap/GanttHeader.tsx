import { MONTHS_TH } from '../../constants';

export function GanttHeader() {
  const currentMonth = new Date().getMonth();
  const quarters = [
    { label: 'Q1', months: [0, 1, 2] },
    { label: 'Q2', months: [3, 4, 5] },
    { label: 'Q3', months: [6, 7, 8] },
    { label: 'Q4', months: [9, 10, 11] },
  ];

  return (
    <>
      {/* Quarter Row */}
      <div className="col-span-1 border-b border-white/10 bg-surface/50 backdrop-blur-sm p-2">
        <span className="text-white/60 text-xs font-thai">ไตรมาส</span>
      </div>
      {quarters.map((quarter) => (
        <div
          key={quarter.label}
          className="col-span-3 border-b border-l border-white/10 bg-surface/50 backdrop-blur-sm p-2 text-center"
        >
          <span className="text-white/80 text-sm font-semibold font-thai">{quarter.label}</span>
        </div>
      ))}

      {/* Month Row */}
      <div className="col-span-1 border-b border-white/10 bg-white/5 p-2">
        <span className="text-white/60 text-xs font-thai">เดือน</span>
      </div>
      {MONTHS_TH.map((month, index) => {
        const isCurrentMonth = index === currentMonth;
        return (
          <div
            key={month}
            className={`border-b border-l border-white/10 p-2 text-center ${
              isCurrentMonth
                ? 'bg-emerald-500/10 border-b-emerald-500'
                : index % 2 === 0
                ? 'bg-white/5'
                : 'bg-white/[0.02]'
            }`}
          >
            <span
              className={`text-sm font-thai ${
                isCurrentMonth ? 'text-emerald-400 font-semibold' : 'text-white/70'
              }`}
            >
              {month}
            </span>
          </div>
        );
      })}
    </>
  );
}
