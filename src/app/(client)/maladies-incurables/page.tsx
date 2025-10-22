import { getArticlesByCategory } from "@/lib/getArticles";
import { contentMaladiesIncurables } from "@/lib/getContentPage";
import { seoMaladiesIncurables } from "@/data/seoData";
import { generateStaticMetadata } from "@/lib/seo";
import CategoryPage from "@/components/BlogClient/CategoryPage";

export const revalidate = 60;


export const metadata = generateStaticMetadata(seoMaladiesIncurables);

export default async function FertilitePage() {
  const {category, articlesAll, tagCategory } = await getArticlesByCategory("maladies-incurables");

  return (
    <CategoryPage
      tag={tagCategory}
      category={category}
      articlesAll={articlesAll}
      content={contentMaladiesIncurables}
      seoData={seoMaladiesIncurables}
    />
  );
}
