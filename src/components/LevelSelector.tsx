"use client";

import { useVocabStore } from "@/store/useVocabStore";
import { VocabLevel } from "@/lib/vocabData";
import { Sparkles, GraduationCap, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import WarningModal from "./WarningModal";

export default function LevelSelector() {
  const { selectedLevel, setLevel, activeSession } = useVocabStore();
  const [mounted, setMounted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<VocabLevel | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const levels: { id: VocabLevel; label: string; icon: LucideIcon; color: string }[] = [
    { 
      id: "low", 
      label: "Basic", 
      icon: Sparkles, 
      color: "from-teal-500 to-emerald-500" 
    },
    { 
      id: "high", 
      label: "Advanced", 
      icon: GraduationCap, 
      color: "from-primary-500 to-indigo-500" 
    },
  ];

  const handleLevelClick = (levelId: VocabLevel) => {
    if (levelId === selectedLevel) return;
    
    if (activeSession) {
      setPendingLevel(levelId);
      setShowWarning(true);
    } else {
      setLevel(levelId);
    }
  };

  return (
    <>
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm backdrop-blur-md">
        {levels.map((level) => {
          const isActive = selectedLevel === level.id;
          const Icon = level.icon;
          
          return (
            <button
              key={level.id}
              onClick={() => handleLevelClick(level.id)}
              className={`
                relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                ${isActive 
                  ? "text-white shadow-lg shadow-primary-500/20" 
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }
              `}
            >
              {isActive && (
                <div 
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${level.color} animate-in fade-in zoom-in-95 duration-300`} 
                />
              )}
              <Icon size={16} className="relative z-10" />
              <span className="relative z-10 text-sm font-bold tracking-wide">
                {level.label}
              </span>
            </button>
          );
        })}
      </div>

      <WarningModal
        isOpen={showWarning}
        title="Thay đổi cấp độ?"
        description="Tiến trình học hoặc làm quiz hiện tại sẽ bị mất. Bạn có chắc chắn muốn chuyển cấp độ không?"
        onConfirm={() => {
          if (pendingLevel) {
            setLevel(pendingLevel);
          }
          setShowWarning(false);
          setPendingLevel(null);
        }}
        onCancel={() => {
          setShowWarning(false);
          setPendingLevel(null);
        }}
      />
    </>
  );
}
