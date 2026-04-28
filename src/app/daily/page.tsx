import DailyStudyContent from "@/components/DailyStudyContent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DailyStudyPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex items-center space-x-4">
        <Link 
          href="/" 
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Daily Random Study
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Learn new words across all topics
          </p>
        </div>
      </header>

      <div className="flex-grow">
        <DailyStudyContent />
      </div>
    </div>
  );
}
