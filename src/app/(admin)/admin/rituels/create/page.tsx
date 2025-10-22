import CreateArticlePage from "@/components/Admin/articles/create/CreateArticlePage";
import prisma from "@/lib/prisma";

export default async function Page() {
  //console.log("➡️ [CREATE PAGE] Chargement des catégories...");

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  //console.log("✅ [CREATE PAGE] Catégories récupérées :", categories);

  return <CreateArticlePage categories={categories} />;
}
