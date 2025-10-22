import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { content } from "@/lib/getContentPage";
import { generateStaticMetadata, seoPropsFromArticle } from "@/lib/seo";
import BlogLayout from "@/components/Admin/BlogLayout";
import { JsonLD } from "@/components/Referencement/JsonLD";
import Head from "next/head";
import ContactArticle from "@/components/Contact/ContactArticle";
import Image from "next/image";
import { getAllPublishedArticles, mapArticle } from "@/lib/articles-utils";
import ArticleGrid from "@/components/BlogClient/Articles/ArticleGrid";
export const revalidate = 60;



type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      tagsArticles: { select: { tag: { select: { id: true, name: true, slug: true } }, assignedAt: true } },
    },
  });

  if (!article)
    return generateStaticMetadata({
      title: "Découvrez: Rituels populaires & Marabout Mamadou Coulibaly",
      description: "Explorez nos autres rituels et conseils du marabout Mamadou Coulibaly.",
    });

  return generateStaticMetadata(seoPropsFromArticle(article));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const articleRaw = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      tagsArticles: { select: { tag: { select: { id: true, name: true, slug: true, createdAt: true, updatedAt: true } }, assignedAt: true } },
    },
  });

  if (!articleRaw) redirect("/rituels");

  const tags: { id: string; name: string; slug: string }[] = articleRaw.tagsArticles.map((t) => ({
    id: t.tag.id.toString(),
    name: t.tag.name,
    slug: t.tag.slug,
  }));


  const article = mapArticle(articleRaw);
  const articlesAll = await getAllPublishedArticles();
  const seoProps = seoPropsFromArticle(articleRaw);

  return (
    <>
      <Head><JsonLD seo={seoProps} /></Head>
      <BlogLayout content={content} tags={tags}>
        <article className="lg:col-span-3 space-y-10">
          <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-text mb-4">{article.title}</h1>
            <p className="text-sm text-yellow-400">
              {new Date(article.updatedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <Image src={article.coverImage?.url ?? "/default-cover.jpg"} alt={article.title} width={1200} height={600} className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-lg" />
            <p className="text-lg">{article.description}</p>
          </header>

          <div className="space-y-16">
            {article.content.sections.map((section, index) => (
              <div
                key={index}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                  <Image
                    src={section.image?.url ?? "/default-cover.jpg"}
                    alt={section.subtitle}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg hover-scale"
                  />
                </div>


                {/* Texte */}
                <div className={`${index % 2 === 1 ? "md:order-1" : "md:order-2"}`}>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">
                    {section.subtitle}
                  </h2>
                  <p className="text-slate-200 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900/80 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">En Conclusion</h2>
            <p className="text-slate-200 leading-relaxed">{article.conclusion}</p>
            <ContactArticle />
          </div>

          <ArticleGrid articles={articlesAll} title="Autres articles" accentColor="text-yellow-400" />
        </article>
      </BlogLayout>
    </>
  );
}
