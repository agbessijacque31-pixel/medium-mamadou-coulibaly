import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { requireAdmin } from "@/lib/adminOnly";

// GET: liste toutes les catégories
export async function GET() {
  try {
    await requireAdmin();
    const tags = await prisma.tag.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(tags);
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

    const tag = await prisma.tag.create({ 
            data: {
              name,
              slug: slugify(name), 
            },
     });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  }
}
