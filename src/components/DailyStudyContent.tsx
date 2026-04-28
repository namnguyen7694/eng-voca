"use client";

import { useState, useEffect } from "react";
import { VocabWord } from "@/types/vocab";
import { useVocabStore } from "@/store/useVocabStore";
import FlashcardDeck from "./FlashcardDeck";
import { Shuffle } from "lucide-react";

export default function DailyStudyContent() {
  const [mounted, setMounted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [studyWords, setStudyWords] = useState<VocabWord[]>([]);

  const getWordsByType = useVocabStore((state) => state.getWordsByType);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  const handleStart = (amount: number) => {
    const unlearnedWords = getWordsByType("unLearned");

    if (unlearnedWords.length === 0) {
      setStudyWords([]);
      setSelectedAmount(amount);
      return;
    }

    // Shuffle and pick N words
    const shuffled = [...unlearnedWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, amount);

    setStudyWords(selected);
    setSelectedAmount(amount);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      handleStart(amount);
    }
  };

  if (selectedAmount !== null) {
    if (studyWords.length === 0) {
      return (
        <div className="text-center py-20 glass rounded-3xl border border-white/20 max-w-lg mx-auto">
          <p className="text-2xl text-emerald-500 font-bold mb-4">Amazing!</p>
          <p className="text-slate-600 dark:text-slate-300">You have learned all available words in the database.</p>
          <button
            onClick={() => setSelectedAmount(null)}
            className="mt-8 px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-full font-medium"
          >
            Go Back
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6 max-w-lg mx-auto">
          <span className="text-sm font-medium text-slate-500">Learning {studyWords.length} random words</span>
          <button
            onClick={() => setSelectedAmount(null)}
            className="text-xs px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors"
          >
            Change Amount
          </button>
        </div>
        <FlashcardDeck words={studyWords} />
      </div>
    );
  }

  const presetAmounts = [10, 15, 20, 30];
  const unlearnedCount = getWordsByType("unLearned").length;

  return (
    <div className="max-w-md mx-auto space-y-8 mt-10">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center rounded-2xl mb-6 shadow-sm">
          <Shuffle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">How many words?</h2>
        <p className="text-slate-500 dark:text-slate-400">
          You have <span className="font-bold text-primary-500">{unlearnedCount}</span> new words left to learn across
          all topics.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleStart(amount)}
            disabled={unlearnedCount === 0}
            className="p-4 glass rounded-2xl border border-white/20 shadow-sm hover:shadow-md hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all font-bold text-lg text-slate-700 dark:text-slate-200 disabled:opacity-50"
          >
            {amount} Words
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-50 dark:bg-slate-950 px-2 text-slate-400">Or custom amount</span>
        </div>
      </div>

      <form onSubmit={handleCustomSubmit} className="flex space-x-2">
        <input
          type="number"
          min="1"
          max={unlearnedCount}
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="e.g. 50"
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={unlearnedCount === 0}
        />
        <button
          type="submit"
          disabled={!customAmount || parseInt(customAmount, 10) <= 0 || unlearnedCount === 0}
          className="px-6 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          Start
        </button>
      </form>
    </div>
  );
}
