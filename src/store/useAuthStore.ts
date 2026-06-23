import { create } from 'zustand';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User,
  setPersistence,
  browserLocalPersistence,
  Unsubscribe
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  initAuth: () => Unsubscribe;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),

  initAuth: () => {
    set({ loading: true });
    // Ensure persistence
    setPersistence(auth, browserLocalPersistence);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        loading: false 
      });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ user: null, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        loading: false 
      });
    }
  },
}));
