"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { TopicInfo } from "@/types/vocab";

interface TopicCardProps {
  topic: TopicInfo;
  learnedCount: number;
}

export default function TopicCard({ topic, learnedCount }: TopicCardProps) {
  return (
    <div className="group glass rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden bg-white/40 dark:bg-slate-800/40">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-2xl group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary-500 text-white rounded-2xl shadow-lg shadow-primary-500/30">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1">
            {topic.name}
          </h3>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 h-10 line-clamp-2">
          {topic.previewWords.join(" • ")}...
        </p>

        <ProgressBar progress={learnedCount} total={topic.totalWords} className="mb-6" />

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
