import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientThemeProvider from "@/components/ClientThemeProvider";
import SiteNav from "@/components/SiteNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vecto",
  description: "Create faster. Share smarter. Templates for CapCut & After Effects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased text-slate-800 bg-white dark:bg-slate-900 dark:text-slate-200 transition-colors duration-300`}>
        <ClientThemeProvider>
          <div className="min-h-dvh flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-600 dark:text-slate-400">
                © {new Date().getFullYear()} Vecto. All rights reserved.
              </div>
            </footer>
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
