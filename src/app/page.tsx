import Link from "next/link";
import TemplateCard from "@/components/TemplateCard";
import { supabase } from "@/lib/supabaseClient";

interface Template {
  title: string;
  slug: string;
  description: string;
  thumb_url: string;
  preview_url: string;
  editor_id: string | null;
  created_at: string;
}

interface Tag {
  name: string;
  slug: string;
}

interface Editor {
  id: string;
  name: string;
}

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
    editors?.find((e: Editor) => e.id === id)?.name ?? undefined;

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="relative bg-slate-900 dark:bg-slate-900 rounded-3xl overflow-hidden mx-4 my-6">
        <img
          src="https://files.catbox.moe/fvxb3b.png"
          alt="Discover the world's top video templates"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-3xl leading-tight">
            Discover the World&apos;s Top Video Templates
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-xl">
            Browse hundreds of professionally designed templates for CapCut and After Effects from creators worldwide.
          </p>
          <Link
            href="/capcut"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold rounded-full transition-colors"
          >
            Start Creating
          </Link>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="border-y bg-white dark:bg-slate-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-slate-100">
              Discover the world&apos;s top <span className="text-slate-900 dark:text-slate-100">video templates</span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl">
              Explore high‑quality CapCut and After Effects templates from creators worldwide. Hover to preview. Click to use.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                Templates
              </button>
              <button className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                Creators
              </button>
              <button className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                Collections
              </button>
            </div>
            <form action="/capcut" method="get" target="_blank" className="mt-5">
              <div className="relative">
                <input
                  name="q"
                  placeholder="What type of template are you interested in?"
                  className="w-full rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 pl-5 pr-28 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 text-sm">
                  Search
                </button>
              </div>
            </form>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {(tags && tags.length > 0
                ? tags.map((t: Tag) => t.name)
                : ["Transitions", "Titles", "Reels Hooks", "Intros", "Lower Thirds", "LUTs"]
              ).map((label: string) => (
                <Link
                  key={label}
                  href={`/capcut?q=${encodeURIComponent(label)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video">
            {/* You can add a placeholder or video preview here if needed */}
          </div>
        </div>
      </section>

      {/* Templates Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Discover</h3>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/capcut?sort=popular"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              Popular
            </Link>
            <Link
              href="/capcut?sort=new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              New
            </Link>
            <Link
              href="/capcut?sort=trending"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              Trending
            </Link>
            <Link
              href="/capcut"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Explore all →
            </Link>
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(templates ?? []).map((t: Template) => (
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
          <div className="mt-16 text-center text-slate-500 dark:text-slate-400">
            No templates found yet. Add some in your database.
          </div>
        )}
      </section>
    </div>
  );
}
