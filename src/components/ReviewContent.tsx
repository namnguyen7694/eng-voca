"use client";

import { useEffect, useState } from "react";
import { VocabWord } from "@/types/vocab";
import { useVocabStore } from "@/store/useVocabStore";
import FlashcardDeck from "./FlashcardDeck";
import { Bookmark } from "lucide-react";

export default function ReviewContent({ allWords }: { allWords: VocabWord[] }) {
  const [mounted, setMounted] = useState(false);
  
  const savedIds = useVocabStore(state => state.saved);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  const reviewWords = allWords.filter(word => savedIds.includes(word.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center p-4 glass rounded-2xl max-w-sm mx-auto border border-white/20">
        <Bookmark className="text-amber-500 mr-2" size={24} />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          Saved Words ({savedIds.length})
        </h2>
      </div>

      {reviewWords.length > 0 ? (
        <FlashcardDeck words={reviewWords} />
      ) : (
        <div className="text-center py-20 glass rounded-3xl border border-white/20">
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
            No words here yet!
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            While learning, mark words as &quot;Save&quot; to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
