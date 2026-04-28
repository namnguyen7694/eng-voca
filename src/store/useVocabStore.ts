import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VocabWord } from "@/types/vocab";
import { getVocabData } from "@/lib/vocabData";

interface VocabState {
  learned: number[];
  saved: number[];
  wrongIds: number[];
  toggleLearned: (id: number) => void;
  toggleSaved: (id: number) => void;
  isLearned: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  addWrongId: (id: number) => void;
  getWordsByType: (type: "saved" | "wrong" | "learned" | "unLearned") => VocabWord[];
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set, get) => ({
      learned: [],
      saved: [],
      wrongIds: [],

      toggleLearned: (id) =>
        set((state) => {
          const isCurrentlyLearned = state.learned.includes(id);
          return {
            learned: isCurrentlyLearned ? state.learned.filter((itemId) => itemId !== id) : [...state.learned, id],
            // Xoá khỏi danh sách sai nếu đã đánh dấu là thuộc
            wrongIds: !isCurrentlyLearned ? state.wrongIds.filter((itemId) => itemId !== id) : state.wrongIds,
          };
        }),

      toggleSaved: (id) =>
        set((state) => ({
          saved: state.saved.includes(id) ? state.saved.filter((itemId) => itemId !== id) : [...state.saved, id],
        })),

      addWrongId: (id) =>
        set((state) => ({
          wrongIds: state.wrongIds.includes(id) ? state.wrongIds : [...state.wrongIds, id],
        })),

      isLearned: (id) => get().learned.includes(id),
      isSaved: (id) => get().saved.includes(id),

      getWordsByType: (type) => {
        const allWords = getVocabData();
        const state = get();
        switch (type) {
          case "saved":
            return allWords.filter((w) => state.saved.includes(w.id));
          case "wrong":
            return allWords.filter((w) => state.wrongIds.includes(w.id));
          case "learned":
            return allWords.filter((w) => state.learned.includes(w.id));
          case "unLearned":
            return allWords.filter((w) => !state.learned.includes(w.id));
          default:
            return [];
        }
      },
    }),
    {
      name: "vocab-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        learned: state.learned,
        saved: state.saved,
        wrongIds: state.wrongIds,
      }), // only save these fields, exclude functions
    },
  ),
);
