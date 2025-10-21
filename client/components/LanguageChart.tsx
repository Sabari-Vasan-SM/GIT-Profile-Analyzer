import { LanguageStats } from "@shared/api";
import { useState, useEffect } from "react";

interface LanguageChartProps {
  languages: LanguageStats;
}

export function LanguageChart({ languages }: LanguageChartProps) {
  const [animatedLanguages, setAnimatedLanguages] = useState<[string, number][]>([]);
  
  // Sort languages by usage and take top 8
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const totalBytes = sortedLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);

  useEffect(() => {
    // Stagger the animation of each language
    sortedLanguages.forEach((lang, index) => {
      setTimeout(() => {
        setAnimatedLanguages(prev => [...prev, lang]);
      }, index * 100);
    });
  }, []);

  // Color palette for languages
  const colorMap: { [key: string]: string } = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Dart: "#00B4AB",
  };

  const getColor = (lang: string) => colorMap[lang] || "#8b949e";

  if (sortedLanguages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No language data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedLanguages.map(([language, bytes], index) => {
        const percentage = ((bytes / totalBytes) * 100).toFixed(1);
        const isAnimated = animatedLanguages.some(([lang]) => lang === language);
        
        return (
          <div
            key={language}
            className={`space-y-2 transform transition-all duration-500 ${
              isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: getColor(language) }}
                />
                <span className="font-semibold text-gray-700">{language}</span>
              </div>
              <span className="text-gray-600 font-bold">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{
                  width: isAnimated ? `${percentage}%` : '0%',
                  backgroundColor: getColor(language),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
