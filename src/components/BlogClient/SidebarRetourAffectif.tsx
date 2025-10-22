import Link from "next/link";
import Image from "next/image";
import { ArticleSidebarDTO } from "../../../types/articles-type";

type CategoryDTO = {
  id: number;
  slug: string;
  name: string;
  createdAt: Date;
};



type PropSide = {
  articles: ArticleSidebarDTO[];
  categories: CategoryDTO[];
  tags: { id: string; name: string; slug: string }[];
};

export default async function SidebarRituel({
  articles,
  categories,
  tags,
}: PropSide) {
  return (
    <aside className="space-y-8">
      {/* À propos */}
      <div className="bg-indigo-950/95 text-gray-100 rounded-2xl shadow-lg p-6 border border-orange-500/30">
        <h3 className="text-lg font-bold text-yellow-400 mb-3">Medium MAMADOU COULIBALY</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          <strong>MAMADOU COULIBALY </strong> est un marabout renommé avec plus de 20 ans d&apos;expérience.
          Spécialiste en amour, protection, réussite et rituels puissants, il guide ceux
          qui cherchent des solutions rapides et efficaces à leurs problèmes spirituels et personnels.
        </p>
        <Image src="/image/coulibaly-mamadou-attestation.jpg" alt="Medium MAMADOU COULIBALY" width={600} height={600}/>
        <Image src="/image/attestation-mamadou-coulibaly.jpg" alt="Medium MAMADOU COULIBALY" width={600} height={600}/>

      </div>

      {/* Articles récents */}
      <div className="bg-indigo-950/90 text-gray-100 rounded-2xl shadow-lg p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">Rituels et conseils récents</h3>
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.slug} className="flex items-center gap-3">
              <Image
                src={a.coverImage?.url ?? "/image/envoute.jpeg"}
                alt={a.title}
                width={50}
                height={50}
                className="w-12 h-12 object-cover rounded-md border border-slate-700"
              />
              <Link
                href={`/rituels/${a.slug}`}
                className="text-gray-300 hover:text-orange-400 transition text-sm font-medium"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Catégories */}
      <div className="bg-indigo-950/90 text-gray-100 rounded-2xl shadow-lg p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">Catégories de rituels</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/categorie/${cat.slug}`}
                className="text-gray-300 hover:text-orange-400 transition"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="bg-indigo-950/90 text-gray-100 rounded-2xl shadow-lg p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">Mots-clés populaires</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="bg-slate-800 text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-orange-500 hover:text-white transition"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-2xl shadow-lg p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Besoin d’aide urgente ?</h3>
        <p className="text-sm mb-4">
          Contactez Medium MAMADOU COULIBALY dès maintenant pour une consultation confidentielle,
          un rituel sur-mesure ou un conseil spirituel puissant.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-white text-orange-600 font-bold px-4 py-2 rounded-full hover:bg-slate-100 transition"
        >
          Je contacte Maître Medium MAMADOU COULIBALY
        </Link>
      </div>

    </aside>
  );
}
