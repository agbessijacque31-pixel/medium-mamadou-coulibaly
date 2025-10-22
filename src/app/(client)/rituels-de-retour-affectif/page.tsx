import { getArticlesByCategory } from "@/lib/getArticles";
import { contentGalerie } from "@/lib/getContentPage";
import { seoRetourAffectif } from "@/data/seoData";
import { generateStaticMetadata } from "@/lib/seo";
import CategoryPage from "@/components/BlogClient/CategoryPage";

export const revalidate = 60;

export const metadata = generateStaticMetadata(seoRetourAffectif);

export default async function RetourAffectifPage() {
  const { tagCategory,category, articlesAll } = await getArticlesByCategory("retour-affectif");

  return (
    <CategoryPage
      tag={tagCategory}
      category={category}
      articlesAll={articlesAll}
      content={contentGalerie}
      seoData={seoRetourAffectif}
    />
  );
}
