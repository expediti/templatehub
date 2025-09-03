import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

const PAGE_SIZE = 12;

function getString(sp: Record<string, string | string[] | undefined>, key: string): string {
  const v = sp[key];
  return typeof v === "string" ? v : "";
}

function parseDurationRange(s: string) {
  const m = s.match(/^(\d+)-(\d+)$/);
  if (!m) return null;
  const min = Number(m[1]);
  const max = Number(m[2]);
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return { min, max };
}

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ editor: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Await the promises in Next.js 15
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams.editor;

  const { data: editorRow, error: editorErr } = await supabase
    .from("editors")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (editorErr || !editorRow) return notFound();

  const q = getString(resolvedSearchParams, "q");
  const orientation = getString(resolvedSearchParams, "orientation");
  const is_free = getString(resolvedSearchParams, "is_free");
  const difficulty = getString(resolvedSearchParams, "difficulty");
  const duration = getString(resolvedSearchParams, "duration");
  const sort = getString(resolvedSearchParams, "sort");
  const pageNum = Number(getString(resolvedSearchParams, "page") || "1");
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  let query = supabase
    .from("templates")
    .select(
      "id, title, slug, description, thumb_url, preview_url, editor_id, created_at, is_free, difficulty, duration_sec, orientation",
      { count: "exact" }
    )
    .eq("editor_id", editorRow.id);

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (orientation) query = query.eq("orientation", orientation);
  if (is_free === "true") query = query.eq("is_free", true);
  if (is_free === "false") query = query.eq("is_free", false);
  if (difficulty) query = query.eq("difficulty", difficulty);

  const range = duration ? parseDurationRange(duration) : null;
  if (range) query = query.gte("duration_sec", range.min).lte("duration_sec", range.max);

  query = query.order("created_at", { ascending: false });

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data: templates, count, error } = await query.range(from, to);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-xl font-semibold">Error</h1>
        <p className="text-slate-600 mt-2">{error.message}</p>
      </div>
    );
  }

  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;

  const sp = new URLSearchParams(
    Object.entries(resolvedSearchParams)
      .filter(([, v]) => typeof v === "string" && v.length > 0)
      .map(([k, v]) => [k, String(v)])
  );

  function pageHref(n: number) {
    const p = new URLSearchParams(sp);
    p.set("page", String(n));
    return `?${p.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {editorRow.name} Templates
          </h1>
          <p className="text-slate-600 mt-1">Find the right template with filters below.</p>
        </div>
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search templates…"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        <select
          name="orientation"
          defaultValue={orientation}
          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Any orientation</option>
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
          <option value="square">Square</option>
        </select>
        <select
          name="is_free"
          defaultValue={is_free}
          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Free or Premium</option>
          <option value="true">Free</option>
          <option value="false">Premium</option>
        </select>
        <select
          name="difficulty"
          defaultValue={difficulty}
          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          name="duration"
          defaultValue={duration}
          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Any duration</option>
          <option value="0-10">0–10s</option>
          <option value="10-30">10–30s</option>
          <option value="30-60">30–60s</option>
        </select>
        <select
          name="sort"
          defaultValue={sort || "popular"}
          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="popular">Popular</option>
          <option value="new">New</option>
          <option value="trending">Trending</option>
        </select>
        <button className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
          Apply
        </button>
      </form>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(templates ?? []).map((t) => (
          <a
            key={t.slug}
            href={`/template/${t.slug}`}
            className="block rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-shadow"
          >
            <div className="aspect-video bg-slate-100">
              <Image
                src={t.thumb_url ?? ""}
                alt={t.title}
                width={400}
                height={225}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="line-clamp-1 font-semibold tracking-tight">{t.title}</div>
              <p className="mt-1 text-xs text-slate-600 line-clamp-2">{t.description ?? ""}</p>
            </div>
          </a>
        ))}
      </div>

      {(!templates || templates.length === 0) && (
        <div className="mt-16 text-center text-slate-500">No templates match your filters.</div>
      )}

      <div className="mt-10 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const n = i + 1;
          const active = n === page;
          return (
            <a
              key={n}
              href={pageHref(n)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                active
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              {n}
            </a>
          );
        })}
      </div>
    </div>
  );
}
