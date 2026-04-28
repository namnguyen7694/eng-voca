"use client";

import { useRef, useEffect } from "react";
import { Check, Bookmark } from "lucide-react";
import { VocabWord } from "@/types/vocab";
import { useVocabStore } from "@/store/useVocabStore";

export default function FlashcardActions({ 
  word, 
  onNextCard 
}: { 
  word: VocabWord;
  onNextCard?: () => void;
}) {
  const { isLearned, isSaved, toggleLearned, toggleSaved } = useVocabStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const learned = isLearned(word.id);
  const saved = isSaved(word.id);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleToggleLearned = () => {
    const wasLearned = learned;
    toggleLearned(word.id);
    
    if (!wasLearned && onNextCard) {
      timeoutRef.current = setTimeout(() => {
        onNextCard();
        timeoutRef.current = null;
      }, 1000);
    } else if (wasLearned) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  return (
    <div className="flex justify-center space-x-6 glass p-3 rounded-3xl border border-white/20 bg-white/40 dark:bg-slate-800/40 w-full max-w-md mx-auto mt-6 shadow-sm">
      <ActionButton
        icon={<Bookmark size={24} className={saved ? "fill-current" : ""} />}
        label="Save"
        active={saved}
        onClick={() => toggleSaved(word.id)}
        activeClass="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
      />
      <ActionButton
        icon={<Check size={24} />}
        label="Learned"
        active={learned}
        onClick={handleToggleLearned}
        activeClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
      />
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  activeClass: string;
}

function ActionButton({ icon, label, active, onClick, activeClass }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 w-28 ${
        active 
          ? activeClass 
          : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      }`}
    >
      <div className={`mb-1 transition-transform ${active ? "scale-110" : ""}`}>{icon}</div>
      <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
