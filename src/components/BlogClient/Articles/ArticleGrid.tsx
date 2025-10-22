// components/Articles/ArticleGrid.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArticleDTO } from "../../../../types/articles-type";
import { getCoverUrl } from "@/lib/articles-utils";

type Props = {
  articles: ArticleDTO[];
  hrefPrefix?: string; // ex: "/rituels" ou "/articles"
  title?: string;
  accentColor?: string; // pour personnaliser les titres
};

export default function ArticleGrid({ articles, hrefPrefix = "/rituels", title, accentColor = "text-yellow-400" }: Props) {
  return (
    <div className="mt-16">
      {title && <h3 className={`text-2xl font-bold mb-6 ${accentColor}`}>{title}</h3>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`${hrefPrefix}/${a.slug}`}
            className="block bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <Image
              src={getCoverUrl(a.coverImage)}
              alt={a.title}
              width={400}
              height={250}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-2">{a.title}</h4>
              <p className="text-sm text-slate-600">{a.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
