/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { VocabWord } from "@/types/vocab";
import { useVocabStore } from "@/store/useVocabStore";
import { Timer, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

type QuizState = "setup" | "playing" | "result";

interface Question {
  word: VocabWord;
  options: string[];
  correctAnswer: string;
}

export default function QuizContent({ allWords }: { allWords: VocabWord[] }) {
  const [mounted, setMounted] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Result tracking
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongWords, setWrongWords] = useState<VocabWord[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);

  const addWrongId = useVocabStore((state) => state.addWrongId);

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setTimeLeft(15);
      setIsTimerRunning(true);
    } else {
      setQuizState("result");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTimeout = useCallback(() => {
    setIsTimerRunning(false);
    setSelectedOption("timeout");
    setIsCorrect(false);

    const currentWord = questions[currentIndex].word;
    setWrongWords((prev) => [...prev, currentWord]);
    addWrongId(currentWord.id);

    setTimeout(() => {
      goToNextQuestion();
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions, addWrongId]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        setTimeTaken((prev) => prev + 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      // Timeout
      handleTimeout();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isTimerRunning]);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  const generateQuestions = (amount: number) => {
    // 1. Pick random words for questions
    const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, amount);

    // 2. Generate options for each question
    const generatedQuestions: Question[] = selectedWords.map((word) => {
      // Get 3 random distractor meanings from OTHER words
      const distractors = allWords
        .filter((w) => w.id !== word.id && w.meaning_vi !== word.meaning_vi)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.meaning_vi);

      // Combine correct and distractors, then shuffle
      const options = [word.meaning_vi, ...distractors].sort(() => Math.random() - 0.5);

      return {
        word,
        options,
        correctAnswer: word.meaning_vi,
      };
    });

    setQuestions(generatedQuestions);
    setQuizState("playing");
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongWords([]);
    setTimeTaken(0);
    setTimeLeft(15);
    setIsTimerRunning(true);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setIsTimerRunning(false);
    setSelectedOption(option);

    const currentQuestion = questions[currentIndex];
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongWords((prev) => [...prev, currentQuestion.word]);
      addWrongId(currentQuestion.word.id);
    }

    setTimeout(() => {
      goToNextQuestion();
    }, 1500);
  };

  if (quizState === "setup") {
    const presetAmounts = [10, 15, 20, 30];

    return (
      <div className="max-w-md mx-auto space-y-8 mt-10">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center rounded-2xl mb-6 shadow-sm">
            <Timer size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">How many questions?</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Each question has a 15-second time limit. Words are chosen completely at random.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => generateQuestions(amount)}
              className="p-4 glass rounded-2xl border border-white/20 shadow-sm hover:shadow-md hover:bg-orange-500 hover:text-white hover:border-orange-500 dark:hover:bg-orange-600 transition-all font-bold text-lg text-slate-700 dark:text-slate-200"
            >
              {amount}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (quizState === "playing") {
    const currentQ = questions[currentIndex];

    return (
      <div className="max-w-lg mx-auto w-full flex flex-col space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center glass p-4 rounded-2xl">
          <div className="font-bold text-slate-500 dark:text-slate-400">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className="flex items-center space-x-2 font-bold text-orange-500">
            <Timer size={20} />
            <span className={`text-xl ${timeLeft <= 5 ? "text-danger-500 animate-pulse" : ""}`}>{timeLeft}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? "bg-danger-500" : "bg-orange-500"}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>

        {/* Question Box */}
        <div className="glass p-8 rounded-3xl border border-white/20 shadow-lg text-center flex flex-col justify-center min-h-64 bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-900/40">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-4">
            {currentQ.word.word}
          </h2>
          <span className="text-lg text-slate-500 dark:text-slate-400 font-medium">{currentQ.word.phonetic}</span>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, idx) => {
            let btnClass =
              "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700";

            if (selectedOption !== null) {
              if (option === currentQ.correctAnswer) {
                btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20";
              } else if (option === selectedOption && !isCorrect) {
                btnClass = "bg-danger-500 border-danger-500 text-white shadow-danger-500/20";
              } else {
                btnClass =
                  "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-transparent opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(option)}
                className={`p-4 rounded-2xl border-2 text-left font-medium transition-all shadow-sm ${btnClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Result state
  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="glass p-8 rounded-3xl border border-white/20 text-center space-y-6 bg-gradient-to-b from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
          {scorePercentage >= 80 ? (
            <CheckCircle2 size={48} className="text-emerald-500" />
          ) : (
            <XCircle size={48} className="text-warning-500" />
          )}
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Quiz Complete!</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            You scored {correctCount} out of {questions.length}
          </p>
        </div>

        <div className="flex justify-center items-center space-x-8 py-4 border-y border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Accuracy</p>
            <p className={`text-2xl font-bold ${scorePercentage >= 80 ? "text-emerald-500" : "text-warning-500"}`}>
              {scorePercentage}%
            </p>
          </div>
          <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Time</p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <button
          onClick={() => setQuizState("setup")}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white rounded-2xl font-bold transition-all shadow-xl"
        >
          <RotateCcw size={20} />
          <span>Play Again</span>
        </button>
      </div>

      {wrongWords.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white px-2">Words to review</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
            <p className="text-sm text-slate-500">
              These words were answered incorrectly or timed out.
            </p>
            <Link 
              href="/review?tab=mistakes" 
              className="px-4 py-2 bg-danger-100 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/30 dark:text-danger-400 dark:hover:bg-danger-900/50 rounded-xl font-bold text-sm transition-colors text-center"
            >
              Review Mistakes
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {wrongWords.map((word, idx) => (
              <div
                key={idx}
                className="glass p-4 rounded-2xl border border-danger-100 dark:border-danger-900/30 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{word.word}</p>
                  <p className="text-sm text-slate-500">{word.meaning_vi}</p>
                </div>
                <div className="text-xs font-bold text-danger-500 bg-danger-50 dark:bg-danger-900/20 px-2 py-1 rounded-md">
                  #{word.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
