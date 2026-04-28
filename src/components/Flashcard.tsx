"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { VocabWord } from "@/types/vocab";

interface FlashcardProps {
  word: VocabWord;
}

export default function Flashcard({ word }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col space-y-6">
      <div className="perspective-1000 h-96 group">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer transition-all duration-500"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden glass rounded-3xl shadow-xl border border-white/20 flex flex-col justify-between p-8 bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-900/40">
            <div className="flex justify-between items-start w-full">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
                {word.pos}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                {word.level}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 flex-grow">
              <h2 className="text-5xl font-bold text-slate-800 dark:text-white tracking-tight text-center">
                {word.word}
              </h2>
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                <span className="text-lg font-medium">{word.phonetic}</span>
                <button
                  onClick={playAudio}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-primary-500"
                  aria-label="Play pronunciation"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </div>

            <div className="text-center text-sm text-slate-400 dark:text-slate-500 font-medium">Tap to flip</div>
            <div className="absolute bottom-4 right-6 text-xs text-slate-300 dark:text-slate-600 font-bold opacity-50">#{word.id}</div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden glass rotate-y-180 rounded-3xl shadow-xl border border-white/20 flex flex-col justify-between p-8 bg-gradient-to-br from-primary-50/90 to-white/90 dark:from-slate-800/90 dark:to-slate-900/90">
            <div className="flex-grow flex flex-col justify-center space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">{word.meaning_vi}</h3>
              </div>

              <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-slate-700 dark:text-slate-300 font-medium italic mb-2">&quot;{word.example_en}&quot;</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{word.example_vi}</p>
              </div>
            </div>
            <div className="text-center text-sm text-slate-400 dark:text-slate-500 font-medium mt-4">Tap to flip back</div>
            <div className="absolute bottom-4 right-6 text-xs text-primary-200 dark:text-slate-700 font-bold opacity-50">#{word.id}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
