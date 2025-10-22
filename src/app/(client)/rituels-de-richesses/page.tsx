import { getArticlesByCategory } from "@/lib/getArticles";
import { contentGalerie } from "@/lib/getContentPage";
import { seoRichesse } from "@/data/seoData";
import { generateStaticMetadata } from "@/lib/seo";
import CategoryPage from "@/components/BlogClient/CategoryPage";

export const revalidate = 60;

export const metadata = generateStaticMetadata(seoRichesse);

export default async function RichessePage() {
  const { tagCategory,category, articlesAll } = await getArticlesByCategory("richesses");

  return (
    <CategoryPage
      tag={tagCategory}
      category={category}
      articlesAll={articlesAll}
      content={contentGalerie}
      seoData={seoRichesse}
    />
  );
}
