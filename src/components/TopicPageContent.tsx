"use client";

import { useEffect, useState } from "react";
import { getVocabData, getTopicNameById } from "@/lib/vocabData";
import { useVocabStore } from "@/store/useVocabStore";
import FlashcardDeck from "@/components/FlashcardDeck";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TopicPageContent({ id }: { id: string }) {
  const { selectedLevel } = useVocabStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  const words = getVocabData(id, selectedLevel);
  const topicName = getTopicNameById(id);

  if (words.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Topic not found for {selectedLevel} level</h2>
        <Link href="/" className="text-primary-500 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{topicName}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {words.length} words to master ({selectedLevel === "high" ? "Advanced" : "Basic"})
          </p>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center py-8">
        <FlashcardDeck words={words} />
      </div>
    </div>
  );
}
