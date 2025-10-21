import { ContributionDay } from "@shared/api";

interface ContributionHeatmapProps {
  contributions: ContributionDay[];
}

export function ContributionHeatmap({ contributions }: ContributionHeatmapProps) {
  // Group contributions by week
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  contributions.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0 || index === contributions.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "#ebedf0";
      case 1: return "#9be9a8";
      case 2: return "#40c463";
      case 3: return "#30a14e";
      case 4: return "#216e39";
      default: return "#ebedf0";
    }
  };

  const getMonthLabel = (weekIndex: number) => {
    if (weekIndex % 4 === 0 && weekIndex < weeks.length) {
      const date = new Date(weeks[weekIndex][0].date);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
    return null;
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="flex gap-[2px] mb-2 ml-8">
          {weeks.map((_, weekIndex) => {
            const label = getMonthLabel(weekIndex);
            return (
              <div key={weekIndex} className="w-3 text-xs text-gray-600">
                {label}
              </div>
            );
          })}
        </div>

        {/* Day labels */}
        <div className="flex gap-[2px]">
          <div className="flex flex-col justify-around text-xs text-gray-600 pr-2">
            <div>Mon</div>
            <div>Wed</div>
            <div>Fri</div>
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all"
                    style={{ backgroundColor: getLevelColor(day.level) }}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 justify-end">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getLevelColor(level) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
