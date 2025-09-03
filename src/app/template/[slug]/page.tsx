import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export const revalidate = 0;

export default async function TemplateDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const { data: tpl } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!tpl) return notFound();

  const { data: editor } = await supabase
    .from("editors")
    .select("id, name, slug")
    .eq("id", tpl.editor_id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-slate-500">
        <Link href="/">Home</Link> <span className="mx-1">/</span>
        {editor ? <Link href={`/${editor.slug}`}>{editor.name}</Link> : <span>Editor</span>}
        <span className="mx-1">/</span>
        <span className="text-slate-700">{tpl.title}</span>
      </nav>

      <div className="mt-6">
        <h1 className="text-2xl font-semibold tracking-tight">{tpl.title}</h1>
        {tpl.description && <p className="mt-2 text-slate-600">{tpl.description}</p>}
        
        <div className="mt-6 flex items-center gap-3">
          {tpl.download_url && (
            <a
              href={tpl.download_url}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors"
            >
              {editor?.name === "CapCut" ? "Open in CapCut" : editor?.name === "After Effects" ? "Open in After Effects" : "Open in App"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
