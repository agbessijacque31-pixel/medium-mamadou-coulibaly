"use client";

import Image from "next/image";
import Link from "next/link";
import { ArticleDTO } from "../../../types/articles-type";

type Props = {
  article: ArticleDTO;
};

export default function ArticleCard({ article }: Props) {
  return (
    <article className="flex flex-col bg-purple-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:shadow-orange-600/40 transform transition duration-300 hover:scale-105 hover:-translate-y-1 hover-scale">
      {/* Image */}
      <div className="flex-shrink-0">
        <Image
          src={article.coverImage?.url || "/default-cover.jpg"}
          alt={article.title}
          width={500}
          height={250}
          className="w-full h-40 object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 text-white">
        <h2 className="text-lg font-bold mb-2 line-clamp-2 bg-gradient-text">
          {article.title}
        </h2>

        <p className="text-sm text-slate-200 flex-1 line-clamp-3">
          {article.description}
        </p>

        <div className="mt-2 text-xs text-yellow-400/80">
          {new Date(article.updatedAt).toLocaleString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* CTA bouton */}
        <div className="mt-auto flex">
          <Link
            href={`/rituels/${article.slug}`}
            className="px-4 py-2 text-sm rounded-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 text-purple-900 hover:opacity-90 transition"
          >
            Lire plus →
          </Link>
        </div>
      </div>
    </article>
  );
}
