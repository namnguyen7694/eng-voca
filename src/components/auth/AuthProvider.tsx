"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return <>{children}</>;
}
