import { temoignageTexteFormSchema, videoTemoignageFormSchema } from "@/lib/Schemas/articleSchema";
import type { Prisma } from "@prisma/client";
import z from "zod";


export type ImageValue = { url: string | null; publicId: string | null } | null;



export type Section = {
  subtitle: string;
  image: ImageValue;
  text: string;
};
/**
 * Contenu JSON strict de l'article (stocké dans Article.content)
 */
export type ArticleContent = {
  sections: Section[];
};


/**
 * Forme du résultat retourné par Prisma pour un Article avec relations
 */
export type ArticleWithRelations = {
  id: number;
  slug: string;
  title: string;
  description: string;
  coverImage: Prisma.JsonValue | null;   // ✅ devient JSON
  content: Prisma.JsonValue;        // contenu JSON
  conclusion: string;
  metaTitre: string;               // SEO
  metaDescription: string;         // SEO
  published: boolean;
  publishedAt: Date | null;        // nullable
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;              // FK vers Category
  category: {
    id: number;
    name: string;
    slug: string;
  };
  tagsArticles: Array<{
    tag: {
      id: number;
      name: string;
      slug: string;
    };
    assignedAt: Date;
  }>;
};




/**
 * --------------------
 * Category
 * --------------------
 */
export type CategoryWithArticles = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  articles: Array<{
    id: number;
    title: string;
    slug: string;
  }>;
};



/**
 * DTO pour le frontend, avec dates sérialisées en string
 */
export type ArticleDTO = {
  id: number;
  slug: string;
  title: string;
  description: string;
  coverImage?: ImageValue;
  content: ArticleContent;
  conclusion: string;
  metaTitre: string;
  metaDescription: string;
  published: boolean;
  publishedAt: string | null;     // nullable et sérialisée
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  category: string;                // juste le nom de la catégorie
  tags: string[];                  // noms des tags
};

/**
 * Mapper : ArticleWithRelations -> ArticleDTO
 */
export function mapArticle(article: ArticleWithRelations): ArticleDTO {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    coverImage: article.coverImage as { url: string; publicId: string } | null,
    content: article.content as ArticleContent,
    conclusion: article.conclusion,
    metaTitre: article.metaTitre,
    metaDescription: article.metaDescription,
    published: article.published,
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    categoryId: article.categoryId,
    category: article.category.name,
    tags: article.tagsArticles.map((ta) => ta.tag.name),
  };
}

/**
 * Formulaire pour créer ou mettre à jour un Article
 */
export type ArticleFormValues = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  coverImage?: {
    url: string;
    publicId: string;
  } | null;
  categoryId: number | "";
  tags: string[];
  published: boolean;
  conclusion: string;
  metaTitre: string;
  metaDescription: string;
  content: ArticleContent;
};

/**
 * Résumé d'article pour liste ou card
 */
export type ArticleSummaryDTO = Pick<
  ArticleDTO,
  "title" | "slug" | "description" | "coverImage" | "updatedAt"
>;

/**
 * Type Category
 */
export type CategoryDTO = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Type Tag
 */
export type TagDTO = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};


/**
 * --------------------
 * Tag
 * --------------------
 */
export type TagWithArticles = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  tagsArticles: Array<{
    article: {
      id: number;
      title: string;
      slug: string;
    };
    assignedAt: Date;
  }>;
};






export type TagArticleDTO = {
  articleId: number;
  articleTitle: string;
  tagId: number;
  tagName: string;
  assignedAt: string;           // ISO string
};



export type ArticleSidebarDTO = {
  title: string;
  slug: string;
  coverImage?: {
    url: string;
    publicId: string;
  } | null;
};




// --- DTO retourné par Prisma pour VideoTemoignage ---
export type VideoTemoignageWithRelations = {
  id: number;
  title: string;
  description: string | null;
  transcript: string | null;
  videotemoi: Prisma.JsonValue;
  subtitlestemoi: Prisma.JsonValue | null;
  thumbnailtemoi: Prisma.JsonValue;
  webmtemoi: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};




// --- DTO pour le frontend, avec dates sérialisées ---
export type VideoTemoignageDTO = {
  id?: number;
  title: string;
  description?: string;
  transcript?: string;
  videotemoi: ImageValue;
  subtitlestemoi?: ImageValue | null;
  thumbnailtemoi: ImageValue | null;
  webmtemoi: ImageValue | null;
  createdAt?: string;
  updatedAt?: string;
};

// --- Mapper : Prisma -> DTO frontend ---
export function mapVideoTemoignage(video: VideoTemoignageWithRelations): VideoTemoignageDTO {
  return {
    id: video.id,
    title: video.title,
    description: video.description ?? undefined,
    transcript: video.transcript ?? undefined,
    videotemoi: video.videotemoi as ImageValue,
    subtitlestemoi: video.subtitlestemoi as ImageValue,
    thumbnailtemoi: video.thumbnailtemoi as ImageValue,
    webmtemoi: video.webmtemoi as ImageValue,
    createdAt: video.createdAt.toISOString(),
    updatedAt: video.updatedAt.toISOString(),

  };
}


// --- Formulaire pour créer ou mettre à jour un témoignage ---
export type VideoTemoignageFormValues = {
  id?: number;
  title: string;
  description?: string;
  transcript?: string;
  videotemoi: ImageValue;
  subtitlestemoi?: ImageValue;
  thumbnailtemoi: ImageValue;
  webmtemoi: ImageValue;
};


/**
 * Formulaire pour créer ou mettre à jour un témoignage vidéo
 * Les fichiers sont en File pour l'upload
 */
export type VideoTemoignageFormData = z.infer<typeof videoTemoignageFormSchema>;













// --- DTO retourné par Prisma pour TemoignagesTexte ---
export type TemoignageTexteWithRelations = {
  id: number;
  name: string;
  photo: Prisma.JsonValue | null;
  category: string;
  description: string;
  pays: string;
  createdAt: Date;
  updatedAt: Date;
};

// --- DTO pour le frontend, avec dates sérialisées ---
export type TexteTemoignageDTO = {
  id?: number;
  name: string;
  category: string;
  description: string;
  pays: string;
  photo?: ImageValue | null;
  createdAt?: string;
  updatedAt?: string;
};

// --- Mapper : Prisma -> DTO frontend ---
export function mapTemoignageTexte(texte: TemoignageTexteWithRelations): TexteTemoignageDTO {
  return {
    id: texte.id,
    name: texte.name,
    category: texte.category,
    description: texte.description,
    pays: texte.pays,
    photo: texte.photo as ImageValue | null,
    createdAt: texte.createdAt ? texte.createdAt.toISOString() : undefined,
    updatedAt: texte.updatedAt ? texte.updatedAt.toISOString() : undefined,
  };
}

// --- Formulaire pour créer ou mettre à jour un témoignage texte ---
export type TemoignageTexteFormValues = {
  id?: number;
  name: string;
  category: string;
  description: string;
  pays: string;
  photo?: ImageValue | null;
};

// --- Formulaire Zod (type inféré) ---
export type TemoignageTexteFormData = z.infer<typeof temoignageTexteFormSchema>;