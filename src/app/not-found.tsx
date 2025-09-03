import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">404 - Template Not Found</h1>
      <p className="mt-4 text-slate-600">
        The template you're looking for doesn't exist or has been removed.
      </p>
      <Link 
        href="/" 
        className="mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
      >
        Return Home
      </Link>
    </div>
  )
}
