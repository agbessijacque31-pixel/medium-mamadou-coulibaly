import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/slugify";
import { ArticleContent, ImageValue } from "../../../../../../types/articles-type";
import { Prisma } from "@prisma/client";
import cloudinary, { uploadImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/adminOnly";



// ---------------------------
// GET /api/admin/articles/:id
// ---------------------------
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const articleId = Number(id);

        const article = await prisma.article.findUnique({
            where: { id: articleId },
            include: { category: true, tagsArticles: { include: { tag: true } } },
        });

        if (!article) return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        return NextResponse.json(article, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ message: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
    }
}



// ---------------------------
// PUT /api/admin/articles/:id
// ---------------------------
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await params;
        const articleId = Number(id);
        const formData = await req.formData();

        const existingArticle = await prisma.article.findUnique({ where: { id: articleId } });
        if (!existingArticle) return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });

        const slug = formData.get("slug") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const metaTitre = formData.get("metaTitre") as string;
        const metaDescription = formData.get("metaDescription") as string;
        const conclusion = formData.get("conclusion") as string;
        const categoryId = Number(formData.get("categoryId"));
        const published = formData.get("published") === "true";
        const publishedAtRaw = formData.get("publishedAt") as string | null;
        const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null;

        // Couverture
        let coverImage: ImageValue = existingArticle.coverImage as ImageValue ?? null;
        const coverFile = formData.get("coverImage");
        if (coverFile instanceof File) {
            if (coverImage?.publicId) await cloudinary.uploader.destroy(coverImage.publicId);
            const uploaded = await uploadImage(coverFile, "articles/covers");
            coverImage = { url: uploaded.secure_url, publicId: uploaded.public_id };
        }

        // Sections
        const existingContent = existingArticle.content as ArticleContent | null;
        const contentRaw = formData.get("content") as string;
        const content: ArticleContent = JSON.parse(contentRaw);
        const sectionFiles = formData.getAll("sectionImages") as File[];

        let imgIndex = 0;
        for (let i = 0; i < content.sections.length; i++) {
            const oldSection = existingContent?.sections[i];
            if (sectionFiles[imgIndex]) {
                if (oldSection?.image?.publicId) await cloudinary.uploader.destroy(oldSection.image.publicId);
                const uploaded = await uploadImage(sectionFiles[imgIndex], "articles/sections");
                content.sections[i].image = { url: uploaded.secure_url, publicId: uploaded.public_id };
                imgIndex++;
            } else if (content.sections[i].image && typeof content.sections[i].image === "object") {
                content.sections[i].image = content.sections[i].image;
            } else {
                content.sections[i].image = null;
            }
        }

        // Tags
        const tagsRaw = formData.get("tags") as string | null;
        const tags: string[] = tagsRaw ? JSON.parse(tagsRaw) : [];

        const article = await prisma.article.update({
            where: { id: articleId },
            data: {
                slug,
                title,
                description,
                metaTitre,
                metaDescription,
                conclusion,
                coverImage: coverImage as Prisma.InputJsonValue,
                content: content as Prisma.InputJsonValue,
                categoryId,
                published,
                publishedAt,
                tagsArticles: {
                    deleteMany: {},
                    create: tags.map((tagName) => ({
                        tag: {
                            connectOrCreate: {
                                where: { slug: slugify(tagName) },
                                create: {
                                    name: tagName,
                                    slug: slugify(tagName),
                                },
                            },
                        },
                    })),
                },
            },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                tagsArticles: { select: { assignedAt: true, tag: true } },
            },
        });

        return NextResponse.json(article, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ message: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
    }
}

// ---------------------------
// DELETE /api/admin/articles/:id
// ---------------------------
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await params;
        const articleId = Number(id);

        const article = await prisma.article.findUnique({ where: { id: articleId } });
        if (!article) return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });

        // Supprimer couverture
        const cover = article.coverImage as ImageValue;
        if (cover?.publicId) await cloudinary.uploader.destroy(cover.publicId);

        // Supprimer images sections
        const content = article.content as ArticleContent | null;
        for (const section of content?.sections ?? []) {
            if (section.image?.publicId) await cloudinary.uploader.destroy(section.image.publicId);
        }

        await prisma.tagArticle.deleteMany({ where: { articleId } });
        await prisma.article.delete({ where: { id: articleId } });

        return NextResponse.json({ message: "Article supprimé avec succès" }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ message: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
    }
}
