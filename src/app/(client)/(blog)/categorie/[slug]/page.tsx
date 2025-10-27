import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { content } from "@/lib/getContentPage";
import { generateMetadataCategory, seoPropsFromCategoryDynamic } from "@/lib/seo";
import BlogLayout from "@/components/Admin/BlogLayout";
import { JsonLD } from "@/components/Referencement/JsonLD";
import Head from "next/head";
import { getAllPublishedArticles, mapArticle } from "@/lib/articles-utils";
import ArticleGrid from "@/components/BlogClient/Articles/ArticleGrid";

export const revalidate = 60;


type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateMetadataCategory({ params: { slug } });
}

export default async function CategoriePage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
          tagsArticles: { select: { tag: { select: { id: true, name: true, slug: true, createdAt: true, updatedAt: true, } }, assignedAt: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!category) redirect("/rituels");

  const categoryArticles = category.articles.map(mapArticle);
  const tagCategoryArticles: { id: string; name: string; slug: string }[] = Array.from(
    new Map(
      category.articles
        .flatMap((article) => article.tagsArticles.map((t) => t.tag))
        .map((tag) => [tag.id, {
          id: tag.id.toString(),
          name: tag.name,
          slug: tag.slug,
        }])
    ).values()
  );

  const articlesAll = await getAllPublishedArticles();
  const seoProps = await seoPropsFromCategoryDynamic(slug);

  return (
    <>
      <Head><JsonLD seo={seoProps} /></Head>
      <BlogLayout content={content} tags={tagCategoryArticles}>
        <article className="lg:col-span-3 space-y-10 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Articles dans la catégorie : {category.name}</h1>
          <ArticleGrid articles={categoryArticles} hrefPrefix="/rituels" />
          <ArticleGrid articles={articlesAll} title="Autres articles" />
        </article>
      </BlogLayout>
    </>
  );
}

