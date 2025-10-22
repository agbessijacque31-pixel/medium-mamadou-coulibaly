// src/app/(admin)/admin/rituels/page.tsx
import prisma from "@/lib/prisma";
import { ArticleDTO } from "../../../../../types/articles-type";
import ArticlesPage from "@/components/Admin/articles/ArticlesPage";

export default async function RituelsPage() {
  //console.log("📥 [RituelsPage] Chargement des articles depuis Prisma...");

  // Récupération en BDD
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      published: true,
    },
  });

  //console.log("✅ [RituelsPage] Articles récupérés :", articles);

  if (!articles || articles.length === 0) {
    console.warn("⚠️ [RituelsPage] Aucun article trouvé !");
  }

  return <ArticlesPage articles={articles as ArticleDTO[]} />;
}
