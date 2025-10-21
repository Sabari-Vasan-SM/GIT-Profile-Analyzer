import { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface AnimatedStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  delay?: number;
}

export function AnimatedStatCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  delay = 0 
}: AnimatedStatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger visibility animation
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    // Animate the number counting up
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const countTimer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay + 200);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(countTimer);
    };
  }, [value, delay]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-6 
        transform transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
      `}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <Icon className="h-8 w-8 text-white/90" />
          <div className="text-right">
            <div className="text-3xl font-bold text-white tabular-nums">
              {displayValue.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-white/80 text-sm font-medium uppercase tracking-wide">
          {label}
        </div>
      </div>

      {/* Shine effect */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
          transform -skew-x-12 transition-transform duration-1000
          ${isVisible ? 'translate-x-full' : '-translate-x-full'}
        `}
      />
    </div>
  );
}
