"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/70 dark:border-slate-700">
      <nav className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-6">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
          Vecto
        </Link>
        <div className="hidden md:flex items-center gap-5">
          <Link href="/capcut" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Explore</Link>
          <Link href="/capcut" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">CapCut</Link>
          <Link href="/after-effects" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">After Effects</Link>
          <Link href="/collections/featured" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Collections</Link>
          <Link href="/submit" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Submit</Link>
        </div>
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Log in</Link>
          <Link href="/signup" className="text-sm rounded-full bg-slate-900 text-white px-3 py-1.5 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">Sign up</Link>
        </div>
        <button aria-label="Open menu" className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
          ☰
        </button>
      </nav>
    </header>
  );
}
