import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VocabState {
  learned: number[];
  saved: number[];
  toggleLearned: (id: number) => void;
  toggleSaved: (id: number) => void;
  isLearned: (id: number) => boolean;
  isSaved: (id: number) => boolean;
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set, get) => ({
      learned: [],
      saved: [],
      
      toggleLearned: (id) => set((state) => ({
        learned: state.learned.includes(id)
          ? state.learned.filter((itemId) => itemId !== id)
          : [...state.learned, id],
      })),
      
      toggleSaved: (id) => set((state) => ({
        saved: state.saved.includes(id)
          ? state.saved.filter((itemId) => itemId !== id)
          : [...state.saved, id],
      })),

      isLearned: (id) => get().learned.includes(id),
      isSaved: (id) => get().saved.includes(id),
    }),
    {
      name: 'vocab-storage', // name of the item in the storage (must be unique)
    }
  )
);
