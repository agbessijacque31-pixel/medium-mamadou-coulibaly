import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArticleContent, ArticleDTO } from "../../../../../../../types/articles-type";
import EditArticlePage from "@/components/Admin/articles/edit/EditArticlePage";


type Props = {
  params: Promise<{ id: string }>; // params est une Promise
};

export default async function Page({ params }: Props) {
  const { id } = await params; // ✅ on récupère l'id

    const articleId = Number(id);

  const [categories, article] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.article.findUnique({
      where: { id: articleId }, // ✅ recherche par id
      include: {
        category: { select: { id: true, name: true } },
        tagsArticles: {
          select: {
            tag: { select: { id: true, name: true } },
          },
        },
      },
    }),
  ]);

  if (!article) return notFound();

  const dto: ArticleDTO = {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    metaDescription: article.metaDescription,
    metaTitre: article.metaTitre,
    coverImage: article.coverImage as { url: string; publicId: string } | null,
    conclusion: article.conclusion ?? "",
    categoryId: article.categoryId,
    category: article.category?.name ?? "",
    tags: article.tagsArticles?.map((ta) => ta.tag.name) ?? [],
    published: article.published,
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
    content: article.content as ArticleContent,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };

  return <EditArticlePage categories={categories} article={dto} />;
}
