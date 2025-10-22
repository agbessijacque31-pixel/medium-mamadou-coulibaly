import { getAllArticles } from "@/lib/getArticles";
import { contentGalerie } from "@/lib/getContentPage";
import Link from "next/link";
import Image from "next/image";
import { generateJSONLD, generateStaticMetadata } from "@/lib/seo";
import { seoGalerie } from "@/data/seoData";
import { redirect } from "next/navigation";
import BlogLayout from "@/components/Admin/BlogLayout";
import { Section } from "../../../../types/articles-type";

export const revalidate = 60;

export const metadata = generateStaticMetadata(seoGalerie);

export default async function GaleriPage() {
  // 🔹 Tous les articles déjà mappés en ArticleDTO
  const articles = await getAllArticles();

  if (!articles || articles.length === 0){
    redirect("/rituels");
  };

  // 🔹 Construire la liste de toutes les images valides
  const allImages = articles.flatMap((article) => {
    const images: { src: string; articleTitle: string; articleSlug: string }[] = [];

    // ✅ CoverImage si valide
    if (article.coverImage?.url?.trim()) {
      images.push({
        src: article.coverImage.url,
        articleTitle: article.title,
        articleSlug: article.slug,
      });
    }

    // ✅ Images des sections si valides
    article.content?.sections?.forEach((section:Section) => {
      if (section.image?.url?.trim()) {
        images.push({
          src: section.image.url,
          articleTitle: article.title,
          articleSlug: article.slug,
        });
      }
    });

    return images;
  });

  return (
    <>
      <BlogLayout content={contentGalerie}>
        <article className="lg:col-span-3 space-y-10">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">
              La galerie des rituels du Puissant Marabout Medium Mamadou Coulibaly
            </h1>

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {allImages.map((img, index) => (
                <Link
                  key={index}
                  href={`/rituels/${img.articleSlug}`}
                  className="block break-inside-avoid overflow-hidden rounded-2xl shadow hover:shadow-lg transition"
                >
                  <Image
                    src={img.src}
                    alt={img.articleTitle}
                    width={600}
                    height={400}
                    className="w-full object-cover rounded-2xl"
                  />
                  <div className="p-2 text-center bg-white">
                    <p className="text-sm text-slate-700 font-medium">{img.articleTitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </BlogLayout>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJSONLD(seoGalerie) }}
      />
    </>
  );
}
