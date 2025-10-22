// lib/articles-utils.ts
import prisma from "@/lib/prisma";
import { ArticleContent, ArticleDTO, ArticleWithRelations, ImageValue } from "../../types/articles-type";

// ✅ Fonction générique de transformation
export function mapArticle(article: ArticleWithRelations): ArticleDTO {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    coverImage: (article.coverImage as { url: string; publicId: string } | null) ?? null,
    content: article.content as ArticleContent,
    conclusion: article.conclusion,
    metaTitre: article.metaTitre,
    metaDescription: article.metaDescription,
    published: article.published,
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    categoryId: article.categoryId,
    category: article.category.name,
    tags: article.tagsArticles.map((t) => t.tag.name),
  };
}

// ✅ Image de couverture par défaut
export function getCoverUrl(coverImage?: ImageValue | null) {
  return coverImage?.url ?? "/default-cover.jpg";
}

// ✅ Tous les articles publiés
export async function getAllPublishedArticles() {
  const articles = await prisma.article.findMany({
    where: {
      publishedAt: { lte: new Date() },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      tagsArticles: {
        select: {
          tag: { select: { id: true, name: true, slug: true } },
          assignedAt: true,
        },
      },
    },
  });

  return articles.map(mapArticle);
}
