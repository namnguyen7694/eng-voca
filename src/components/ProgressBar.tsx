"use client";

interface ProgressBarProps {
  progress: number;
  total: number;
  className?: string;
  barColor?: string;
}

export default function ProgressBar({ progress, total, className = "", barColor = "bg-primary-500" }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((progress / total) * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
        <span>Progress</span>
        <span>{percentage}% ({progress}/{total})</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
