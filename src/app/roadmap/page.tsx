import { CheckCircle, Zap, Target, Trophy } from "lucide-react";

export default function RoadmapPage() {
  const features = [
    {
      title: "Spaced Repetition System (SRS)",
      description: "Smart algorithm to review words just before you forget them, ensuring long-term retention.",
      status: "Upcoming",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Interactive Quizzes",
      description: "Test your knowledge with multiple choice, listening, and fill-in-the-blank mini-games.",
      status: "Planned",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Daily Streaks & Goals",
      description: "Build a learning habit with daily goals, streak tracking, and achievement badges.",
      status: "Planned",
      icon: Trophy,
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Basic Flashcards",
      description: "Learn vocabulary by topics with phonetic, meaning, and example sentences.",
      status: "Completed",
      icon: CheckCircle,
      color: "text-primary-500",
      bg: "bg-primary-100 dark:bg-primary-900/30",
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Learning <span className="text-primary-500">Roadmap</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          See what&apos;s coming next to make your learning experience even better.
        </p>
      </header>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-12 pb-8">
        {features.map((feature, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12">
            <div className={`absolute -left-[21px] top-1 p-2 rounded-full ${feature.bg} ring-8 ring-white dark:ring-slate-950`}>
              <feature.icon size={20} className={feature.color} />
            </div>
            
            <div className="glass rounded-2xl p-6 bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition-all border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  feature.status === "Completed" 
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400"
                    : feature.status === "Upcoming"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {feature.status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
