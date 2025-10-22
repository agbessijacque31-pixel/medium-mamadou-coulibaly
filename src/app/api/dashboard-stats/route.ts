// app/api/dashboard-stats/route.ts
import { requireAdmin } from "@/lib/adminOnly";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
      await requireAdmin();
  try {
    const [articles, categories, tags, messages] = await Promise.all([
      prisma.article.count({ where: { published: true } }), // seulement les articles publiés
      prisma.category.count(),
      prisma.tag.count(),
      prisma.message.count(),
    ]);

    return NextResponse.json({
      articles,
      categories,
      tags,
      messages,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
