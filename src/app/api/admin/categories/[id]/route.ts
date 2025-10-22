import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { requireAdmin } from "@/lib/adminOnly";

// GET: une seule catégorie
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params est une Promise
) {
      await requireAdmin();
  
  const { id } = await params; // ✅ await pour récupérer la valeur

  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT: mise à jour
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params est une Promise
) {
  const { id } = await params;

  try {
    await requireAdmin();
    const { name } = await req.json();

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { 
        name, 
        slug: slugify(name), 
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// DELETE: suppression
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params est une Promise
) {
  const { id } = await params;

  try {
    await requireAdmin();
    await prisma.category.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Catégorie supprimée" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
