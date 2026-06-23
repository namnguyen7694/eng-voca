"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useVocabStore } from '@/store/useVocabStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((state) => state.initAuth);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  useEffect(() => {
    if (user) {
      useVocabStore.getState().syncWithFirebase(user.uid);
    }
  }, [user]);

  return <>{children}</>;
}
