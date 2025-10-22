import { getArticlesByCategory } from "@/lib/getArticles";
import { contentEnvoutement } from "@/lib/getContentPage";
import { seoEnvoutement } from "@/data/seoData";
import { generateStaticMetadata } from "@/lib/seo";
import CategoryPage from "@/components/BlogClient/CategoryPage";

export const revalidate = 60;

export const metadata = generateStaticMetadata(seoEnvoutement);

export default async function EnvoutementPage() {
  const { tagCategory,category, articlesAll } = await getArticlesByCategory("envoutements");

  return (
    <CategoryPage
      tag={tagCategory}
      category={category}
      articlesAll={articlesAll}
      content={contentEnvoutement}
      seoData={seoEnvoutement}
    />
  );
}
