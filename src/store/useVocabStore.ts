import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VocabWord } from "@/types/vocab";
import { getVocabData, VocabLevel } from "@/lib/vocabData";
import { auth } from "@/lib/firebase";
import { loadUserProgressFromFirestore, saveUserProgressToFirestore, mergeProgress } from "@/lib/syncService";

interface VocabState {
  learned: number[];
  saved: number[];
  wrongIds: number[];
  selectedLevel: VocabLevel;
  activeSession: "daily" | "quiz" | null;
  setActiveSession: (session: "daily" | "quiz" | null) => void;
  toggleLearned: (id: number) => void;
  toggleSaved: (id: number) => void;
  isLearned: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  addWrongId: (id: number) => void;
  setLevel: (level: VocabLevel) => void;
  getWordsByType: (type: "saved" | "wrong" | "learned" | "unLearned") => VocabWord[];
  syncWithFirebase: (uid: string) => Promise<void>;
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set, get) => ({
      learned: [],
      saved: [],
      wrongIds: [],
      selectedLevel: "high",
      activeSession: null,

      setActiveSession: (session) => set({ activeSession: session }),

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

      setLevel: (level) => set({ selectedLevel: level }),

      isLearned: (id) => get().learned.includes(id),
      isSaved: (id) => get().saved.includes(id),

      getWordsByType: (type) => {
        const level = get().selectedLevel;
        const allWords = getVocabData(undefined, level);
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

      syncWithFirebase: async (uid) => {
        const localData = {
          learned: get().learned,
          saved: get().saved,
          wrongIds: get().wrongIds,
          selectedLevel: get().selectedLevel,
        };

        const remoteData = await loadUserProgressFromFirestore(uid);

        if (remoteData) {
          const merged = mergeProgress(localData, remoteData);
          set({
            learned: merged.learned,
            saved: merged.saved,
            wrongIds: merged.wrongIds,
            selectedLevel: merged.selectedLevel as VocabLevel,
          });
          saveUserProgressToFirestore(uid, merged);
        } else {
          // If no remote data exists yet, save current local progress to remote
          saveUserProgressToFirestore(uid, localData);
        }
      },
    }),
    {
      name: "vocab-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        learned: state.learned,
        saved: state.saved,
        wrongIds: state.wrongIds,
        selectedLevel: state.selectedLevel,
      }), // only save these fields, exclude functions
    },
  ),
);

// Subscribe to store changes to auto-sync to Firebase
if (typeof window !== "undefined") {
  useVocabStore.subscribe((state, prevState) => {
    // Only sync if the core fields have actually changed
    const coreFieldsChanged =
      JSON.stringify(state.learned) !== JSON.stringify(prevState.learned) ||
      JSON.stringify(state.saved) !== JSON.stringify(prevState.saved) ||
      JSON.stringify(state.wrongIds) !== JSON.stringify(prevState.wrongIds) ||
      state.selectedLevel !== prevState.selectedLevel;

    if (!coreFieldsChanged) return;

    const currentUser = auth.currentUser;
    if (currentUser) {
      saveUserProgressToFirestore(currentUser.uid, {
        learned: state.learned,
        saved: state.saved,
        wrongIds: state.wrongIds,
        selectedLevel: state.selectedLevel,
      });
    }
  });
}
