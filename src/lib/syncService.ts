import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export interface UserProgress {
  learned: number[];
  saved: number[];
  wrongIds: number[];
  selectedLevel: string;
}

// Load progress from Firestore
export async function loadUserProgressFromFirestore(uid: string): Promise<UserProgress | null> {
  try {
    const docRef = doc(db, "users", uid, "progress", "vocab");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProgress;
    }
  } catch (error) {
    console.error("Error loading progress from Firestore:", error);
  }
  return null;
}

// Debounce timer for Firestore writes
let debounceTimeout: NodeJS.Timeout | null = null;

// Save progress to Firestore with debouncing
export function saveUserProgressToFirestore(uid: string, data: UserProgress) {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(async () => {
    // Safety check: ensure user is still logged in and matches the target UID
    if (!auth.currentUser || auth.currentUser.uid !== uid) {
      console.warn("Sync cancelled: User logged out or switched account during debounce delay.");
      return;
    }
    try {
      const docRef = doc(db, "users", uid, "progress", "vocab");
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error("Error saving progress to Firestore:", error);
    }
  }, 2000); // 2-second delay to batch rapid changes
}

// Merge local and remote progress (Set union to prevent duplicates)
export function mergeProgress(local: UserProgress, remote: UserProgress): UserProgress {
  return {
    learned: Array.from(new Set([...(local.learned || []), ...(remote.learned || [])])),
    saved: Array.from(new Set([...(local.saved || []), ...(remote.saved || [])])),
    wrongIds: Array.from(new Set([...(local.wrongIds || []), ...(remote.wrongIds || [])])),
    selectedLevel: remote.selectedLevel || local.selectedLevel || "high",
  };
}
