"use client";

import { useEffect, useState } from "react";
import { TopicInfo } from "@/types/vocab";
import TopicCard from "./TopicCard";
import { useVocabStore } from "@/store/useVocabStore";

export default function TopicList({ topics }: { topics: TopicInfo[] }) {
  const [mounted, setMounted] = useState(false);
  const learnedIds = useVocabStore((state) => state.learned);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} learnedCount={0} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => {
        const learnedCount = topic.wordIds.filter(id => learnedIds.includes(id)).length;
        return (
          <TopicCard key={topic.id} topic={topic} learnedCount={learnedCount} />
        );
      })}
    </div>
  );
}
