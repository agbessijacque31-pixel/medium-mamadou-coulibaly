import { getAllArticles, getAllCategory, getAllTag } from "@/lib/getArticles";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SITE_BASE || "https://www.medium-mamadou-coulibaly.com";

  const articles = await getAllArticles();
  const categories = await getAllCategory();
  const tags = await getAllTag();

  const urlArticles: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/rituels/${encodeURIComponent(a.slug)}`,
    lastModified: new Date(a.updatedAt || a.publishedAt || new Date()).toISOString(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const urlCategories: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categorie/${encodeURIComponent(c.slug)}`,
    lastModified: new Date(c.updatedAt || new Date()).toISOString(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const urlTags: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${baseUrl}/tag/${encodeURIComponent(t.slug)}`,
    lastModified: new Date(t.updatedAt || new Date()).toISOString(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const urlStatic: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/rituels`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rituels-pour-affaire-de-justice`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rituels-de-retour-affectif`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rituels-de-envoutements`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeries`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rituels-de-richesses`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/maladies-incurables`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rituels-de-chance`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rituels-de-fertilite`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rituels-pour-attirance-clientele`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/temoignages`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  return [...urlStatic, ...urlArticles, ...urlCategories, ...urlTags].filter((u) => !!u.url);
}

