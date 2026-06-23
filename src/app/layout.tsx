import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AuthProvider from "@/components/auth/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LingoCards - Vocabulary Learning",
  description: "Learn English vocabulary effectively with flashcards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative pb-20 md:pb-0 md:pt-16">
        <AuthProvider>
          {/* Decorative Background */}
          <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-slate-950 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/50 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-200/50 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4" />
          </div>

          <Navigation />
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
