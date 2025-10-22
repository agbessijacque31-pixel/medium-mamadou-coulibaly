// lib/getArticles.ts
import { ArticleDTO, ArticleWithRelations, CategoryDTO, mapArticle, TagDTO } from "../../types/articles-type";
import prisma from "./prisma";



export async function getArticles(): Promise<ArticleDTO[]> {
    const articlesRaw: ArticleWithRelations[] = await prisma.article.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            tagsArticles: {
                select: {
                    tag: { select: { id: true, name: true, slug: true } },
                    assignedAt: true,
                },
            },
        },
    });

    return articlesRaw.map(mapArticle);
}


export async function getArticlesByCategory(categorySlug: string): Promise<{
    category: { id: string; name: string; slug: string; articles: ArticleDTO[] } | null;
    articlesAll: ArticleDTO[];
    tagCategory: { id: string; name: string; slug: string }[];
}> {
    // Articles de la catégorie
    const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        include: {
            articles: {
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    tagsArticles: {
                        select: { tag: { select: { id: true, name: true, slug: true } }, assignedAt: true },
                    },
                },
                orderBy: { updatedAt: "desc" },
            },
        },
    });

    // Tous les articles pour suggestions
    const articlesRaw: ArticleWithRelations[] = await prisma.article.findMany({
        where: {
            publishedAt: {
                lte: new Date(),
            },
        },
        orderBy: { updatedAt: "desc" },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            tagsArticles: {
                select: { tag: { select: { id: true, name: true, slug: true } }, assignedAt: true },
            },
        },
    });

    const articlesAll: ArticleDTO[] = articlesRaw.map(mapArticle);

    // Tous les tags de la catégorie, sans doublons
    const tagCategory: { id: string; name: string; slug: string }[] = category
        ? Array.from(
            new Map(
                category.articles
                    .flatMap(article => article.tagsArticles.map(t => ({
                        id: t.tag.id.toString(), 
                        name: t.tag.name,
                        slug: t.tag.slug,
                        
                    })))
                    .map(tag => [tag.id, tag])
            ).values()
        )
        : [];


    return {
        tagCategory,
        category: category
            ? {
                id: category.id.toString(),
                name: category.name,
                slug: category.slug,
                articles: category.articles.map(mapArticle),
            }
            : null,
        articlesAll,
    };
}


export async function getArticlesByTag(tagSlug: string): Promise<{
    tag: { id: string; name: string; articles: ArticleDTO[] } | null;
    articlesAll: ArticleDTO[];
}> {
    const tagWithArticles = await prisma.tag.findUnique({
        where: { slug: tagSlug },
        include: {
            tagsArticles: {
                include: {
                    article: {
                        include: {
                            category: { select: { id: true, name: true, slug: true } },
                            tagsArticles: {
                                select: { tag: { select: { id: true, name: true, slug: true } }, assignedAt: true }
                            }
                        }
                    }
                },
                orderBy: { article: { updatedAt: "desc" } }
            }
        }
    });

    // Tous les articles pour suggestions
    const articlesRaw: ArticleWithRelations[] = await prisma.article.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            tagsArticles: { select: { tag: { select: { id: true, name: true, slug: true } }, assignedAt: true } }
        }
    });
    const articlesAll: ArticleDTO[] = articlesRaw.map(mapArticle);

    return {
        tag: tagWithArticles
            ? {
                id: tagWithArticles.id.toString(),
                name: tagWithArticles.name,
                articles: tagWithArticles.tagsArticles.map((ta) => mapArticle(ta.article))
            }
            : null,
        articlesAll
    };
}


export async function getAllArticles(): Promise<ArticleDTO[]> {
    const articlesRaw: ArticleWithRelations[] = await prisma.article.findMany({
        where: {
            publishedAt: {
                lte: new Date(), // seulement les articles déjà publiés
            },
        },

        orderBy: { updatedAt: "desc" },
        include: {
            category: { select: { id: true, name: true, slug: true } },
            tagsArticles: {
                select: { tag: { select: { id: true, name: true, slug: true } }, assignedAt: true },
            },
        },
    });

    return articlesRaw.map(mapArticle);
}



export async function getAllTag(): Promise<TagDTO[]> {
    const tagsRaw = await prisma.tag.findMany({
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
            tagsArticles: { select: { articleId: true } },
        },
    });

    return tagsRaw.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
        articleCount: tag.tagsArticles.length,
    }));
}



export async function getAllCategory(): Promise<CategoryDTO[]> {  // Updated return type to CategoryDTO[]
    const categoriesRaw = await prisma.category.findMany({
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return categoriesRaw.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
    }));
}


export async function getAllCategorySlug(): Promise<{ slug: string }[]> {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { slug: true }, // ⚡ uniquement le slug
    });

    return categories.map((c) => ({ slug: c.slug }));
}


export async function getAllTagSlug(): Promise<{ slug: string }[]> {
    const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" },
        select: { slug: true }, // ⚡ uniquement le slug
    });

    return tags.map((t) => ({ slug: t.slug }));
}





// lib/getArticles.ts
export async function getLastRituels(): Promise<ArticleDTO[]> {
    const articlesRaw: ArticleWithRelations[] = await prisma.article.findMany({
        where: {
            publishedAt: {
                lte: new Date(), // seulement les articles déjà publiés
            },
        },
        orderBy: { updatedAt: "desc" },
        take: 6, // ⚡ seulement les 6 derniers
        include: {
            category: { select: { id: true, name: true, slug: true } },
            tagsArticles: {
                select: { tag: { select: { id: true, name: true, slug: true } }, assignedAt: true },
            },
        },
    });

    return articlesRaw.map(mapArticle);
}
