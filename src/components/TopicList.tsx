"use client";

import { useEffect, useState } from "react";
import { getTopics } from "@/lib/vocabData";
import TopicCard from "./TopicCard";
import { useVocabStore } from "@/store/useVocabStore";

export default function TopicList() {
  const [mounted, setMounted] = useState(false);

  const { selectedLevel, learned: learnedIds } = useVocabStore();

  const topics = getTopics(selectedLevel);
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} learnedCount={0} level={selectedLevel} />
        ))}
      </div>
    );
  }

  return (
    <>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
        All Topics ({selectedLevel === "high" ? "Advanced" : "Basic"})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const learnedCount = topic.wordIds.filter((id) => learnedIds.includes(id)).length;
          return <TopicCard key={topic.id} topic={topic} learnedCount={learnedCount} level={selectedLevel} />;
        })}
      </div>
    </>
  );
}
