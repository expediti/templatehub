"use client";
import { motion } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import VideoPreview from "./VideoPreview";

type Props = {
  slug: string;
  title: string;
  description?: string | null;
  thumb_url?: string | null;
  preview_url?: string | null;
  tags?: string[];
  editorName?: string;
};

export default function TemplateCard({
  slug,
  title,
  description,
  thumb_url,
  preview_url,
  tags = [],
  editorName,
}: Props) {
  return (
    <Link href={`/template/${slug}`} className="block">
      <motion.div
        whileHover={{ scale: 1.015 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-shadow dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <VideoPreview previewUrl={preview_url} posterUrl={thumb_url} />
          </AspectRatio>
          <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/30 to-transparent" />
          {editorName ? (
            <div className="absolute top-2 left-2 rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[10px] font-semibold border border-white/50 dark:bg-slate-700/85 dark:text-white dark:border-slate-500">
              {editorName}
            </div>
          ) : null}
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate mb-1">
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {description}
            </p>
          ) : null}
          {tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full text-xs dark:bg-slate-600 dark:text-slate-200">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    </Link>
  );
}
