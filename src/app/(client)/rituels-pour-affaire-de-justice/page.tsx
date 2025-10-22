import { getArticlesByCategory } from "@/lib/getArticles";
import { contentJustice } from "@/lib/getContentPage";
import { seoJustice } from "@/data/seoData";
import { generateStaticMetadata } from "@/lib/seo";
import CategoryPage from "@/components/BlogClient/CategoryPage";

export const revalidate = 60;

export const metadata = generateStaticMetadata(seoJustice);

export default async function JusticePage() {
  const { tagCategory, category, articlesAll } = await getArticlesByCategory("affaire-de-justice");

  return (
    <CategoryPage
      tag={tagCategory}
      category={category}
      articlesAll={articlesAll}
      content={contentJustice}
      seoData={seoJustice}
    />
  );
}
