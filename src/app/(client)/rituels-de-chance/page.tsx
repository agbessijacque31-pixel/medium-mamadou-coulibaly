import { getArticlesByCategory } from "@/lib/getArticles";
import { contentChance } from "@/lib/getContentPage";
import { seoChance } from "@/data/seoData";
import { generateStaticMetadata } from "@/lib/seo";
import CategoryPage from "@/components/BlogClient/CategoryPage";

export const revalidate = 60;

export const metadata = generateStaticMetadata(seoChance);

export default async function FertilitePage() {
  const { tagCategory, category, articlesAll } = await getArticlesByCategory("chance");

  return (
    <CategoryPage
      tag={tagCategory}
      category={category}
      articlesAll={articlesAll}
      content={contentChance}
      seoData={seoChance}
    />
  );
}
