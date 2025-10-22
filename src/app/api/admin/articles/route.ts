import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/slugify";
import { ArticleContent, ImageValue } from "../../../../../types/articles-type";
import { Prisma } from "@prisma/client";
import { uploadImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/adminOnly";





// ---------------------------
// GET /api/admin/articles
// ---------------------------
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const where: Prisma.ArticleWhereInput = {};

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tagsArticles = {
        some: { tag: { slug: tag } },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { metaDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          tagsArticles: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      data: articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

// ---------------------------
// POST /api/admin/articles
// ---------------------------
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();

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
    let coverImage: ImageValue = null;
    const coverFile = formData.get("coverImage");
    if (coverFile instanceof File) {
      const uploaded = await uploadImage(coverFile, "articles/covers");
      coverImage = { url: uploaded.secure_url, publicId: uploaded.public_id };
    }

    // Sections
    const contentRaw = formData.get("content") as string;
    const content: ArticleContent = JSON.parse(contentRaw);
    const sectionFiles = formData.getAll("sectionImages") as File[];

    let imgIndex = 0;
    for (let i = 0; i < content.sections.length; i++) {
      if (sectionFiles[imgIndex]) {
        const uploaded = await uploadImage(sectionFiles[imgIndex], "articles/sections");
        content.sections[i].image = { url: uploaded.secure_url, publicId: uploaded.public_id };
        imgIndex++;
      } else {
        content.sections[i].image = null;
      }
    }

    // Tags
    const tagsRaw = formData.get("tags") as string | null;
    const tags: string[] = tagsRaw ? JSON.parse(tagsRaw) : [];

    const article = await prisma.article.create({
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

    return NextResponse.json(article, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
