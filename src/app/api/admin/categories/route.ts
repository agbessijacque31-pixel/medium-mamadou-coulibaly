import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { requireAdmin } from "@/lib/adminOnly";

// GET: liste toutes les catégories
export async function GET() {
  try {
    await requireAdmin();
    const categories = await prisma.category.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 });
  }
}

// POST: créer une nouvelle catégorie
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const category = await prisma.category.create(
      { 
      data: {
        name,
        slug: slugify(name), 
      },
      });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  }
}
