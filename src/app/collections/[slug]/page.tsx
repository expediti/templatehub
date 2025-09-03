import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Await the promises in Next.js 15
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch collection by slug
  const { data: collection } = await supabase
    .from("collections")
    .select("id, title, description, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (!collection) return notFound();

  // Fetch templates in this collection (if you have a junction table)
  const { data: templates } = await supabase
    .from("templates")
    .select("id, title, slug, description, thumb_url, preview_url")
    .eq("collection_id", collection.id) // Adjust based on your schema
    .limit(20);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{collection.title}</h1>
        {collection.description && (
          <p className="mt-2 text-slate-600">{collection.description}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              {t.description && (
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{t.description}</p>
              )}
            </div>
          </a>
        ))}
      </div>

      {(!templates || templates.length === 0) && (
        <div className="mt-16 text-center text-slate-500">
          No templates found in this collection.
        </div>
      )}
    </div>
  );
}
