
import Link from "next/link";
import Image from "next/image";
import { ArticleDTO } from "../../../types/articles-type";

interface Props {
  rituels: ArticleDTO[];
}

export default function DerniersRituelsSection({ rituels }: Props) {
return (
  <section className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 bg-gradient-text">
        ✨ Derniers Rituels avec un résultat en 24H
      </h2>

      {/* Grille des derniers rituels */}
      <div className="grid gap-8 md:grid-cols-3">
        {rituels.map((rituel) => (
          <Link
            key={rituel.id}
            href={`/rituels/${rituel.slug}`}
            className="group relative block rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-600/40 transition duration-300 hover-scale"
          >
            {rituel.coverImage?.url ? (
              <Image
                src={rituel.coverImage.url}
                alt={rituel.title}
                className="w-full h-64 sm:h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                width={600}
                height={300}
              />
            ) : (
              <div className="w-full h-64 sm:h-72 bg-indigo-900 flex items-center justify-center text-slate-300 text-sm">
                Image manquante
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                {rituel.title}
              </h3>
              <p className="text-sm text-slate-200 mb-2 line-clamp-2">
                {rituel.description}
              </p>
              <span className="text-yellow-400 font-semibold hover:underline">
                Lire plus →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/rituels"
          className="inline-block px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 text-purple-900 shadow-lg hover:shadow-2xl hover-scale transition-all duration-300"
        >
          🔮 Découvrir tous les rituels
        </Link>
      </div>
    </div>
  </section>
);

}

