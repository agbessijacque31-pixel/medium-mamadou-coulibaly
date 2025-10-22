import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { requireAdmin } from "@/lib/adminOnly";

// GET: un seul tag
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params en Promise
) {
  const { id } = await params; // ✅ await pour récupérer la valeur

  try {
        await requireAdmin();
    
    const tag = await prisma.tag.findUnique({
      where: { id: Number(id) },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag non trouvée" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT: mise à jour
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params en Promise
) {
  const { id } = await params;

  try {
    await requireAdmin();
    const { name } = await req.json();

    const tag = await prisma.tag.update({
      where: { id: Number(id) },
      data: {
        name,
        slug: slugify(name),
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// DELETE: suppression
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params en Promise
) {
  const { id } = await params;

  try {
    await requireAdmin();
    await prisma.tagArticle.deleteMany({
      where: { tagId: Number(id) },
    });

    await prisma.tag.delete({ where: { id: Number(id) } });


    return NextResponse.json({ message: "Tag supprimée" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
