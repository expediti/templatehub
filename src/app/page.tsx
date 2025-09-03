import Link from "next/link";
import TemplateCard from "@/components/TemplateCard";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;

export default async function Home() {
  const { data: tags } = await supabase.from("tags").select("name, slug").limit(10);

  const { data: templates } = await supabase
    .from("templates")
    .select("title, slug, description, thumb_url, preview_url, editor_id, created_at")
    .order("created_at", { ascending: false })
    .limit(12);

  const { data: editors } = await supabase.from("editors").select("id, name");

  const editorName = (id?: string | null) =>
    editors?.find((e) => e.id === id)?.name ?? undefined;

  return (
    <div>
      <section className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Discover the world&apos;s top <span className="text-slate-900">video templates</span>
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl">
              Explore high‑quality CapCut and After Effects templates from creators worldwide. Hover to preview. Click to use.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button className="rounded-full border border-slate-300 px-3 py-1.5 text-sm bg-slate-900 text-white">Templates</button>
              <button className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Creators</button>
              <button className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Collections</button>
            </div>

            <form action="/capcut" className="mt-5">
              <div className="relative">
                <input
                  name="q"
                  placeholder="What type of template are you interested in?"
                  className="w-full rounded-full border border-slate-300 bg-white pl-5 pr-28 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 text-sm">
                  Search
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {(tags && tags.length > 0
                ? tags.map((t) => t.name)
                : ["Transitions", "Titles", "Reels Hooks", "Intros", "Lower Thirds", "LUTs"]
              ).map((label) => (
                <Link
                  key={label}
                  href={`/capcut?q=${encodeURIComponent(label)}`}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 text-slate-700"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Discover</h2>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/capcut?sort=popular" className="text-slate-700 hover:text-slate-900">Popular</Link>
            <Link href="/capcut?sort=new" className="text-slate-700 hover:text-slate-900">New</Link>
            <Link href="/capcut?sort=trending" className="text-slate-700 hover:text-slate-900">Trending</Link>
          </div>
          <Link href="/capcut" className="text-sm text-indigo-600 hover:underline">Explore all →</Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(templates ?? []).map((t) => (
            <TemplateCard
              key={t.slug}
              slug={t.slug}
              title={t.title}
              description={t.description}
              thumb_url={t.thumb_url}
              preview_url={t.preview_url}
              editorName={editorName(t.editor_id)}
              tags={["Trending"]}
            />
          ))}
        </div>

        {(!templates || templates.length === 0) && (
          <div className="mt-16 text-center text-slate-500">
            No templates found yet. Add some in your database.
          </div>
        )}
      </section>
    </div>
  );
}
