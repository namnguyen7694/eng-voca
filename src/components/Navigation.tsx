"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, BookOpen, Map } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Review", href: "/review", icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 pb-safe md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-around md:justify-start md:space-x-8">
        <Link href="/" className="hidden md:flex items-center space-x-2 mr-8">
          <div className="bg-primary-500 text-white p-1.5 rounded-lg">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white">LingoCards</span>
        </Link>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith("/topic") && item.href === "/");
          return (
            <Link
              key={item.name}
              href={item.href}
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
    </nav>
  );
}
