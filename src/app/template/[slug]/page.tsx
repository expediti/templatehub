import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

interface Editor {
  name: string;
  slug: string;
}

interface Template {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  preview_url: string | null;
  thumb_url: string | null;
  download_url: string | null;
  editor_id: string | null;
  orientation: string | null;
  created_at: string;
  is_free: boolean;
  difficulty: string | null;
  duration_sec: number | null;
  editors: Editor | null;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TemplateDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Get template details
  const { data: template } = await supabase
    .from("templates")
    .select(`
      id, title, slug, description, preview_url, thumb_url, download_url,
      editor_id, orientation, created_at, is_free, difficulty, duration_sec,
      editors (name, slug)
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (!template) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-200">
          Home
        </Link>
        <span className="mx-2">/</span>
        {template.editors?.slug && (
          <>
            <Link
              href={`/${template.editors.slug}`}
              className="hover:text-slate-700 dark:hover:text-slate-200"
            >
              {template.editors.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-slate-700 dark:text-slate-200">{template.title}</span>
      </nav>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Video Preview and Template Info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-sm">
            <div className="relative aspect-video bg-black">
              {template.preview_url ? (
                <video
                  src={template.preview_url}
                  poster={template.thumb_url || undefined}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : template.thumb_url ? (
                <Image
                  src={template.thumb_url}
                  alt={template.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  No preview available
                </div>
              )}
            </div>
          </div>

          {/* Template Info */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {template.title}
            </h1>
            {template.description && (
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
                {template.description}
              </p>
            )}
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {template.editors?.name && (
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 text-sm font-medium">
                  {template.editors.name}
                </span>
              )}
              {template.orientation && (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 text-sm capitalize">
                  {template.orientation}
                </span>
              )}
              {template.difficulty && (
                <span className="rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 text-sm capitalize">
                  {template.difficulty}
                </span>
              )}
              {template.is_free && (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 text-sm font-medium">
                  Free
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Get This Template
            </h2>

            {/* Download Button */}
            {template.download_url ? (
              <a
                href={template.download_url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-6 py-3 text-sm font-semibold hover:bg-indigo-500 transition-colors mb-4"
              >
                {template.editors?.name === "CapCut"
                  ? "Open in CapCut"
                  : template.editors?.name === "After Effects"
                  ? "Open in After Effects"
                  : "Download Template"}
              </a>
            ) : (
              <div className="w-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-6 py-3 rounded-xl text-center text-sm mb-4">
                Download link not available
              </div>
            )}

            {/* Template Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Editor:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {template.editors?.name || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Orientation:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                  {template.orientation || "Any"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Difficulty:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                  {template.difficulty || "Beginner"}
                </span>
              </div>
              {template.duration_sec && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {template.duration_sec}s
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Added:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {template.created_at ? new Date(template.created_at).toLocaleDateString() : "Recently"}
                </span>
              </div>
            </div>

            {/* Related Templates Link */}
            {template.editors?.slug && (
              <Link
                href={`/${template.editors.slug}`}
                className="mt-6 w-full inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                More {template.editors.name} Templates
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
