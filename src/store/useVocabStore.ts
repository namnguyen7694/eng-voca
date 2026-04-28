import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VocabState {
  learned: number[];
  saved: number[];
  wrongIds: number[];
  toggleLearned: (id: number) => void;
  toggleSaved: (id: number) => void;
  isLearned: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  addWrongId: (id: number) => void;
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set, get) => ({
      learned: [],
      saved: [],
      wrongIds: [],
      
      toggleLearned: (id) => set((state) => {
        const isCurrentlyLearned = state.learned.includes(id);
        return {
          learned: isCurrentlyLearned
            ? state.learned.filter((itemId) => itemId !== id)
            : [...state.learned, id],
          // Xoá khỏi danh sách sai nếu đã đánh dấu là thuộc
          wrongIds: !isCurrentlyLearned 
            ? state.wrongIds.filter((itemId) => itemId !== id) 
            : state.wrongIds
        };
      }),
      
      toggleSaved: (id) => set((state) => ({
        saved: state.saved.includes(id)
          ? state.saved.filter((itemId) => itemId !== id)
          : [...state.saved, id],
      })),

      addWrongId: (id) => set((state) => ({
        wrongIds: state.wrongIds.includes(id) ? state.wrongIds : [...state.wrongIds, id],
      })),

      isLearned: (id) => get().learned.includes(id),
      isSaved: (id) => get().saved.includes(id),
    }),
    {
      name: 'vocab-storage', // name of the item in the storage (must be unique)
    }
  )
);
