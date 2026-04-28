import { getTopics } from "@/lib/vocabData";
import TopicList from "@/components/TopicList";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function Home() {
  const topics = getTopics();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Let&apos;s learn some <span className="text-primary-500">English!</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Select a topic below to start flipping cards and expanding your vocabulary.
        </p>
      </header>

      <Link 
        href="/daily" 
        className="block w-full p-6 bg-gradient-to-br from-primary-500 to-teal-500 rounded-3xl text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Zap size={28} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Daily Study</h2>
              <p className="text-primary-100 font-medium">Learn random unlearned words</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">All Topics</h3>
        <TopicList topics={topics} />
      </div>
    </div>
  );
}
