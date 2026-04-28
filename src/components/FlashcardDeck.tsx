"use client";

import { useState, useEffect } from "react";
import { VocabWord } from "@/types/vocab";
import Flashcard, { FlashcardActions } from "./Flashcard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useVocabStore } from "@/store/useVocabStore";
import { AnimatePresence, motion } from "framer-motion";

export default function FlashcardDeck({ words }: { words: VocabWord[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<VocabWord[]>(words);
  const [mounted, setMounted] = useState(false);
  const learnedIds = useVocabStore((state) => state.learned);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    // Xáo trộn ngẫu nhiên mảng từ vựng (Fisher-Yates hoặc sort)
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffledWords(shuffled);
    setMounted(true);
  }, [words]);

  const nextCard = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) nextCard();
    if (isRightSwipe) prevCard();
  };

  if (words.length === 0) return null;

  const learnedCount = mounted ? shuffledWords.filter((word) => learnedIds.includes(word.id)).length : 0;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <ProgressBar progress={learnedCount} total={shuffledWords.length} className="mb-8" />

      <div className="relative w-full flex items-center justify-center min-h-96">
        {!mounted ? (
          <div className="w-full h-96 glass rounded-3xl flex items-center justify-center text-slate-400 animate-pulse">
            Đang trộn thẻ...
          </div>
        ) : (
          <>
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="absolute left-0 md:-left-16 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg rounded-full text-slate-500 hover:text-primary-500 disabled:opacity-0 md:disabled:opacity-30 disabled:hover:text-slate-500 transition-all z-20"
            >
              <ChevronLeft size={24} />
            </button>

            <div 
              className="w-full flex justify-center overflow-hidden px-4 py-4 pb-8"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={shuffledWords[currentIndex].id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "tween", duration: 0.2, ease: "easeInOut" },
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full flex justify-center"
                >
                  <Flashcard word={shuffledWords[currentIndex]} />
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={nextCard}
              disabled={currentIndex === shuffledWords.length - 1}
              className="absolute right-0 md:-right-16 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg rounded-full text-slate-500 hover:text-primary-500 disabled:opacity-0 md:disabled:opacity-30 disabled:hover:text-slate-500 transition-all z-20"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {mounted && shuffledWords.length > 0 && (
        <div className="w-full px-4 relative z-10">
          <FlashcardActions word={shuffledWords[currentIndex]} />
        </div>
      )}

      <div className="mt-8 text-sm font-medium text-slate-400">Use arrows or swipe to navigate</div>
    </div>
  );
}
