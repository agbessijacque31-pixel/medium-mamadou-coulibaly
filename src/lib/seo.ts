import { Article as PrismaArticle } from "@prisma/client";
import type { Metadata } from "next";
import prisma from "./prisma";
import type { WithContext, WebSite, Article as SchemaArticle } from "schema-dts";


export const revalidate = 60;
export const dynamic = "force-dynamic";


// ----------------------------
// Typage SEO
// ----------------------------
export type SEOProps = {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  other?: Record<string, string>;
  tags?: string[];
  section?: string;
  authorName?: string;
  datePublished?: string;
  dateModified?: string;
  type?: "WebSite" | "Article";
};


// ----------------------------
// Config site
// ----------------------------
const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Marabout Mamadou Coulibaly",
  url: process.env.NEXT_PUBLIC_URL_SITE_BASE || "https://mara-Mamadou Coulibaly.vercel.app/",
  other: {
    "google-site-verification": "",
  },
  twitter: process.env.NEXT_PUBLIC_TWITER_NAME || "@Mamadou Coulibaly",
  defaultImage: `${process.env.NEXT_PUBLIC_URL_SITE_BASE || "https://mara-Mamadou Coulibaly.vercel.app"}/images/marabout-Mamadou Coulibaly.jpg`,
};

// ----------------------------
// Keywords automatiques
// ----------------------------
function enrichKeywords(base: string[]) {
  const extra = [
    "Marabout Mamadou Coulibaly",
    "marabout puissant",
    "rituels africains",
    "retour affectif",
    "désenvoûtement",
  ];
  return Array.from(new Set([...base, ...extra]));
}

// ----------------------------
// Génération Metadata pour Next.js
// ----------------------------
export function generateStaticMetadata({
  title,
  description,
  keywords = [],
  path = "/",
  image,
  other,
  tags = [],
  section,
  type = "WebSite",
}: SEOProps): Metadata {
  const fullUrl = `${siteConfig.url}${path}`;
  const imageUrl = image || siteConfig.defaultImage;

  const ogKeywords = [...keywords, ...tags];
  if (section) ogKeywords.push(section);

  const enrichedKeywords = enrichKeywords(ogKeywords);

  // ✅ conversion WebSite → website, Article → article
  const ogType = type === "Article" ? "article" : "website";

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${title} | ${siteConfig.name}`,
    description,
    keywords: enrichedKeywords,
    other: other || siteConfig.other,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: "fr_FR",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitter,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
// ----------------------------
// JSON-LD pour Google
// ----------------------------



export function generateJSONLD({
  title,
  description,
  path = "/",
  image,
  authorName,
  datePublished,
  dateModified,
  keywords = [],
  type = "WebSite",
}: SEOProps) {
  const fullUrl = `${siteConfig.url}${path}`;

  let jsonLd: WithContext<WebSite | SchemaArticle>;

  if (type === "WebSite") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: title,
      url: fullUrl,
      description,
      ...(image && { image }),
      ...(keywords.length && { keywords: keywords.join(", ") }),
    };
  } else {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      url: fullUrl,
      ...(image && { image }),
      ...(keywords.length && { keywords: keywords.join(", ") }),
      author: {
        "@type": "Person",
        name: authorName || "Marabout Mamadou Coulibaly",
      },
      ...(datePublished && { datePublished }),
      ...(dateModified && { dateModified }),
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/favicon.ico`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": fullUrl,
      },
    };
  }

  return JSON.stringify(jsonLd);
}


// ----------------------------
// Typage exact pour article avec relations
// ----------------------------
export type ArticleWithRelations = PrismaArticle & {
  category: { id: number; name: string; slug: string } | null;
  tagsArticles: {
    assignedAt: Date;
    tag: { id: number; name: string; slug: string };
  }[];
};


// ----------------------------
// SEO Props depuis un article
// ----------------------------
export function seoPropsFromArticle(article: ArticleWithRelations): SEOProps {
  const tagKeywords = article.tagsArticles.map(t => t.tag.name);
  const categoryKeyword = article.category?.name ? [article.category.name] : [];

  return {
    title: article.metaTitre,
    description: article.metaDescription,
    keywords: [...tagKeywords, ...categoryKeyword],
    path: `/rituels/${article.slug}`,
    image: (article.coverImage as { url: string; publicId: string } | null)?.url,
    section: article.category?.name,
    authorName: "Marabout Mamadou Coulibaly",
    datePublished: article.createdAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    type: "Article",
    other: { "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_CONSOLE || "" },
  };
}

type SEOSource = { id: number; name: string; slug: string };
type SEOType = "categorie" | "tag";

async function seoPropsFromSource(
  sourceSlug: string,
  type: SEOType
): Promise<SEOProps> {
  // Récupération de la source (catégorie ou tag)
  const source: SEOSource | null =
    type === "categorie"
      ? await prisma.category.findUnique({ where: { slug: sourceSlug } })
      : await prisma.tag.findUnique({ where: { slug: sourceSlug } });

  if (!source) {
    const label = type === "categorie" ? "Catégorie" : "Tag";
    return {
      title: `${label} "${sourceSlug}" | Découvrez nos rituels populaires`,
      description: `${label} "${sourceSlug}" du marabout Mamadou Coulibaly. Explorez nos rituels les plus populaires pour trouver des solutions immédiatement.`,
      path: `/${type}/${sourceSlug}`,
    };
  }

  // Récupération des articles associés
  const articles = await prisma.article.findMany({
    where:
      type === "categorie"
        ? { categoryId: source.id }
        : { tagsArticles: { some: { tagId: source.id } } },
    include: { tagsArticles: { select: { tag: { select: { name: true } } } } },
  });

  const allTags = Array.from(
    new Set(articles.flatMap((a) => a.tagsArticles.map((t) => t.tag.name)))
  );
  const topTags = allTags.slice(0, 5).join(", ");

  const contentType = articles.length > 5 ? "Rituels mystérieux" : "Rituels exclusifs";
  const currentYear = new Date().getFullYear();

  const title = `${contentType} sur "${source.name}" (${currentYear}) | ${topTags}`;
  const description = `Découvrez ${articles.length} ${articles.length > 1 ? "rituels" : "rituel"
    } ${type === "categorie" ? "dans la catégorie" : "liés au tag"} "${source.name
    }", incluant ${topTags}. Restez informé et enrichissez vos connaissances en ${source.name} cette année !`;

  return {
    title,
    description,
    path: `/${type}/${source.slug}`,
    tags: allTags,
    section: source.name,
    type: "Article",
    other: { "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_CONSOLE || "" },
  };
}

// --- Fonctions spécifiques (simple wrapper) ---
export const seoPropsFromCategoryDynamic = (slug: string) => seoPropsFromSource(slug, "categorie");

export const seoPropsFromTagDynamic = (slug: string) => seoPropsFromSource(slug, "tag");



// ----------------------------
// Génération dynamique Next.js
// ----------------------------
export async function generateMetadataTag({ params }: { params: { slug: string } }): Promise<Metadata> {
  const seoProps = await seoPropsFromTagDynamic(params.slug);
  return generateStaticMetadata(seoProps);
}

export async function generateMetadataCategory({ params }: { params: { slug: string } }): Promise<Metadata> {
  const seoProps = await seoPropsFromCategoryDynamic(params.slug);
  return generateStaticMetadata(seoProps);
}

export async function generateMetadataArticle({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      tagsArticles: { select: { tag: { select: { id: true, name: true, slug: true } }, assignedAt: true } },
    },
  });

  if (!article) {
    return generateStaticMetadata({
      title: "Article non trouvé",
      description: "Cet article n’existe pas.",
      type: "WebSite",
    });
  }

  return generateStaticMetadata(seoPropsFromArticle(article));
}
