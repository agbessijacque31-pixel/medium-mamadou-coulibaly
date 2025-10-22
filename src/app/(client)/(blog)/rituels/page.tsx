
import prisma from "@/lib/prisma";

import { content } from "@/lib/getContentPage";



import { generateStaticMetadata } from "@/lib/seo";
import { seoRituels } from "@/data/seoData";
import { ArticleDTO, ArticleWithRelations, mapArticle } from "../../../../../types/articles-type";
import BlogLayout from "@/components/Admin/BlogLayout";
import ArticleCard from "@/components/BlogClient/ArticleCard";




export const revalidate = 60;


export const metadata = generateStaticMetadata(seoRituels);


export default async function RituelsPage() {

  // On récupère les articles avec la nouvelle relation TagArticle
  const articlesRaw: ArticleWithRelations[] = await prisma.article.findMany({
    where: {
      publishedAt: {
        lte: new Date(),
      },
    },

    orderBy: { updatedAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      tagsArticles: {
        select: {
          tag: { select: { id: true, name: true, slug: true } },
          assignedAt: true,
        }
      },
    },
  });

  const articles: ArticleDTO[] = articlesRaw.map(mapArticle);


  return (
    <BlogLayout content={content}>
      {articles.map((article) => (
        <div key={article.slug} className="flex-1 min-w-[280px]">
          <ArticleCard article={article} />
        </div>
      ))}
    </BlogLayout>
  );
}
