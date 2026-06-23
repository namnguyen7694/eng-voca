"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { TopicInfo } from "@/types/vocab";

interface TopicCardProps {
  topic: TopicInfo;
  learnedCount: number;
  level?: "low" | "high";
}

const levelThemes = {
  low: {
    glow: "bg-teal-100 dark:bg-teal-900/20 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/30",
    iconBg: "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-teal-500/20",
    progressBar: "bg-gradient-to-r from-teal-500 to-emerald-500",
  },
  high: {
    glow: "bg-primary-100 dark:bg-primary-900/20 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30",
    iconBg: "bg-gradient-to-r from-primary-500 to-indigo-500 shadow-primary-500/20",
    progressBar: "bg-gradient-to-r from-primary-500 to-indigo-500",
  },
};

export default function TopicCard({ topic, learnedCount, level = "high" }: TopicCardProps) {
  const theme = levelThemes[level];

  return (
    <div className="group glass rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden bg-white/40 dark:bg-slate-800/40">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-colors ${theme.glow}`} />
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 text-white rounded-2xl shadow-lg ${theme.iconBg}`}>
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1">
            {topic.name}
          </h3>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 h-10 line-clamp-2">
          {topic.previewWords.join(" • ")}...
        </p>

        <ProgressBar progress={learnedCount} total={topic.totalWords} barColor={theme.progressBar} className="mb-6" />

        <Link 
          href={`/topic/${topic.id}`}
          className="flex items-center justify-center w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl transition-colors group/btn"
        >
          <span>Start Learning</span>
          <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
