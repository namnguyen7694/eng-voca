"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithGoogle, loading, error } = useAuthStore();

  const handleLogin = async () => {
    await loginWithGoogle();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur-xl border border-white/20"
          >
            {/* Decoration */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative p-8 text-center">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                  <LogIn size={32} />
                </div>
              </div>

              <h2 className="mb-2 text-3xl font-extrabold text-gray-900 tracking-tight">
                Chào mừng bạn!
              </h2>
              <p className="mb-8 text-gray-500 font-medium">
                Đăng nhập để lưu tiến độ học tập và đồng bộ hóa từ vựng của bạn.
              </p>

              {error && (
                <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-6 py-4 font-bold text-gray-700 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 border border-gray-100"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? 'Đang xử lý...' : 'Tiếp tục với Google'}
                
                {/* Shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
              </button>

              <div className="mt-8 text-xs text-gray-400 font-medium">
                Bằng cách đăng nhập, bạn đồng ý với Điều khoản & Chính sách của chúng tôi.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
