"use client";

import { useEffect, useState } from "react";
import { VocabWord } from "@/types/vocab";
import { useVocabStore } from "@/store/useVocabStore";
import FlashcardDeck from "./FlashcardDeck";
import { XCircle } from "lucide-react";

export default function MistakesContent({ allWords }: { allWords: VocabWord[] }) {
  const [mounted, setMounted] = useState(false);

  const wrongIds = useVocabStore((state) => state.wrongIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  const reviewWords = allWords.filter((word) => wrongIds.includes(word.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center p-4 glass rounded-2xl max-w-sm mx-auto border border-white/20">
        <XCircle className="text-danger-500 mr-2" size={24} />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Mistakes ({wrongIds.length})</h2>
      </div>

      {reviewWords.length > 0 ? (
        <div className="space-y-4">
          <p className="text-center text-sm text-slate-500 max-w-md mx-auto">
            These are the words you got wrong in the Quick Quiz. Mark them as &quot;Learned&quot; when you have mastered
            them, and they will be removed from this list.
          </p>
          <FlashcardDeck words={reviewWords} />
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl border border-white/20">
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Great job!</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            You don&apos;t have any mistake words to review right now.
          </p>
        </div>
      )}
    </div>
  );
}
