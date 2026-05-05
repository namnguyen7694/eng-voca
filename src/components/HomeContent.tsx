"use client";

import { useEffect, useState } from "react";
import TopicList from "@/components/TopicList";
import Link from "next/link";
import { Zap, Timer } from "lucide-react";

export default function HomeContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen" />; // Simple placeholder to prevent layout shift
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Let&apos;s learn some <span className="text-primary-500">English!</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/daily"
          className="block w-full p-5 bg-gradient-to-br from-primary-500 to-teal-500 rounded-3xl text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Daily Study</h2>
              <p className="text-primary-100 text-sm font-medium">Learn random unlearned words</p>
            </div>
          </div>
        </Link>

        <Link
          href="/quiz"
          className="block w-full p-5 bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Timer size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Quick Quiz</h2>
              <p className="text-orange-100 text-sm font-medium">15s multiple choice challenge</p>
            </div>
          </div>
        </Link>
      </div>

      <div>
        <TopicList />
      </div>
    </div>
  );
}
