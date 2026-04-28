"use client";

import { useEffect, useState, useMemo } from "react";
import { VocabWord } from "@/types/vocab";
import { useVocabStore } from "@/store/useVocabStore";
import FlashcardDeck from "./FlashcardDeck";
import { Bookmark, XCircle } from "lucide-react";

export default function ReviewContent({ allWords }: { allWords: VocabWord[] }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"saved" | "mistakes">("saved");

  const savedIds = useVocabStore((state: { saved: number[] }) => state.saved);
  const wrongIds = useVocabStore((state: { wrongIds: number[] }) => state.wrongIds);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    if (typeof window !== "undefined" && window.location.search.includes("tab=mistakes")) {
      setActiveTab("mistakes");
    }
  }, []);

  const reviewWords = useMemo(() => {
    return allWords.filter((word) => (activeTab === "saved" ? savedIds.includes(word.id) : wrongIds.includes(word.id)));
  }, [allWords, activeTab, savedIds, wrongIds]);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-sm mx-auto">
        <button
          onClick={() => {
            setActiveTab("saved");
            window.history.replaceState(null, "", "/review");
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "saved"
              ? "bg-white dark:bg-slate-700 shadow text-amber-500"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Bookmark size={16} />
          <span>Saved ({savedIds.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("mistakes");
            window.history.replaceState(null, "", "/review?tab=mistakes");
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "mistakes"
              ? "bg-white dark:bg-slate-700 shadow text-danger-500"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <XCircle size={16} />
          <span>Mistakes ({wrongIds.length})</span>
        </button>
      </div>

      {reviewWords.length > 0 ? (
        <div className="space-y-4">
          {activeTab === "mistakes" && (
            <p className="text-center text-sm text-slate-500 max-w-md mx-auto">
              These are the words you got wrong in the Quick Quiz. Mark them as &quot;Learned&quot; when you have
              mastered them to remove them from this list.
            </p>
          )}
          <FlashcardDeck words={reviewWords} showProgressBar={false} />
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl border border-white/20">
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
            {activeTab === "saved" ? "No saved words yet!" : "Great job!"}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            {activeTab === "saved"
              ? 'While learning, mark words as "Save" to see them here.'
              : "You don't have any mistake words to review right now."}
          </p>
        </div>
      )}
    </div>
  );
}
