"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface WarningModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function WarningModal({
  isOpen,
  title = "Thay đổi cấp độ?",
  description = "Tiến trình học hoặc làm quiz hiện tại sẽ bị mất. Bạn có chắc chắn muốn tiếp tục không?",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  onConfirm,
  onCancel,
}: WarningModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Warning Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-white/20 p-6 text-center space-y-5 z-10 backdrop-blur-xl"
          >
            {/* Alert Triangle Icon Header */}
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 shadow-inner">
                <AlertTriangle size={28} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                {description}
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm transition-all"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-500/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
