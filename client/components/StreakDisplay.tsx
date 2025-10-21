import { Flame, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  return (
    <div className={`
      grid grid-cols-1 md:grid-cols-2 gap-4
      transform transition-all duration-700
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {/* Current Streak */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-bold tabular-nums">
                {currentStreak}
              </div>
              <div className="text-white/80 text-sm font-medium uppercase tracking-wide">
                Current Streak
              </div>
            </div>
          </div>
          <div className="text-white/70 text-xs">
            Days of consecutive contributions
          </div>
        </div>
      </div>

      {/* Longest Streak */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-bold tabular-nums">
                {longestStreak}
              </div>
              <div className="text-white/80 text-sm font-medium uppercase tracking-wide">
                Longest Streak
              </div>
            </div>
          </div>
          <div className="text-white/70 text-xs">
            Your personal best streak
          </div>
        </div>
      </div>
    </div>
  );
}
