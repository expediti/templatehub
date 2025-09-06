import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Page Not Found</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        The template you're looking for doesn't exist or has been removed.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        Return Home
      </Link>
    </div>
  );
}
