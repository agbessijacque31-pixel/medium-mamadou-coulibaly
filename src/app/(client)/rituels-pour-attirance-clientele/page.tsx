import { getArticlesByCategory } from "@/lib/getArticles";
import { contentAttiranceClientele } from "@/lib/getContentPage";
import { seoAttiranceClientele } from "@/data/seoData";
import { generateStaticMetadata } from "@/lib/seo";
import CategoryPage from "@/components/BlogClient/CategoryPage";

export const revalidate = 60;

export const metadata = generateStaticMetadata(seoAttiranceClientele);

export default async function FertilitePage() {
  const { tagCategory,category, articlesAll } = await getArticlesByCategory("attirance-clientele");

  return (
    <CategoryPage
      tag={tagCategory}
      category={category}
      articlesAll={articlesAll}
      content={contentAttiranceClientele}
      seoData={seoAttiranceClientele}
    />
  );
}
