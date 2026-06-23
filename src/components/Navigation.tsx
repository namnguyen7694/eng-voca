"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Bookmark, BookOpen, LogOut, User, AlertTriangle } from "lucide-react";
import LevelSelector from "./LevelSelector";
import LoginModal from "./auth/LoginModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useVocabStore } from "@/store/useVocabStore";
import WarningModal from "./WarningModal";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { activeSession, setActiveSession } = useVocabStore();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Review", href: "/review", icon: Bookmark },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === pathname) return;
    
    if (activeSession) {
      e.preventDefault();
      setPendingHref(href);
      setShowWarning(true);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 pb-safe md:top-0 md:bottom-auto md:border-b md:border-t-0">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              onClick={(e) => handleNavClick(e, "/")}
              className="hidden md:flex items-center space-x-2 mr-4"
            >
              <div className="bg-primary-500 text-white p-1.5 rounded-lg">
                <BookOpen size={24} />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">LingoCards</span>
            </Link>
            
            <div className="flex items-center justify-around md:justify-start md:space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith("/topic") && item.href === "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`flex flex-col md:flex-row items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? "text-primary-600 dark:text-primary-400" 
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <div className={`mb-1 md:mb-0 md:mr-2 transition-transform ${isActive ? "scale-110" : ""}`}>
                      <item.icon size={20} className={isActive ? "fill-primary-100 dark:fill-primary-900/50" : ""} />
                    </div>
                    <span className={`text-[10px] md:text-sm font-semibold ${isActive ? "opacity-100" : "opacity-80 md:opacity-100"}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-3 md:ml-auto">
            <div className="hidden sm:block">
              <LevelSelector />
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                    {user.displayName}
                  </p>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </button>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-primary-500 shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <User size={18} />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                <User size={18} />
                <span className="hidden xs:inline">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <WarningModal
        isOpen={showWarning}
        title="Rời khỏi trang?"
        description="Tiến trình học hoặc làm quiz hiện tại sẽ bị mất. Bạn có chắc chắn muốn chuyển trang không?"
        onConfirm={() => {
          if (pendingHref) {
            setActiveSession(null);
            router.push(pendingHref);
          }
          setShowWarning(false);
          setPendingHref(null);
        }}
        onCancel={() => {
          setShowWarning(false);
          setPendingHref(null);
        }}
      />
    </>
  );
}
