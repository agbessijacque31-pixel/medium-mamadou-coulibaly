import { getArticlesByCategory } from "@/lib/getArticles";
import { contentFertilite } from "@/lib/getContentPage";
import { seoFertilite } from "@/data/seoData";
import { generateStaticMetadata } from "@/lib/seo";
import CategoryPage from "@/components/BlogClient/CategoryPage";

export const revalidate = 60;


export const metadata = generateStaticMetadata(seoFertilite);

export default async function FertilitePage() {
  const { tagCategory,category, articlesAll } = await getArticlesByCategory("fertilite");

  return (
    <CategoryPage
      tag={tagCategory}
      category={category}
      articlesAll={articlesAll}
      content={contentFertilite}
      seoData={seoFertilite}
    />
  );
}
