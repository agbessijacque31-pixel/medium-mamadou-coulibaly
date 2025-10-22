import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import cloudinary, { uploadImage } from "@/lib/cloudinary";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/adminOnly";

// ---------------------------
// GET /api/admin/temoignages/texte/[id]
// ---------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();


  const { id } = await params;
  const numericId = Number(id);

  try {
    const temoignage = await prisma.temoignagesTexte.findUnique({
      where: { id: numericId },
    });

    if (!temoignage) {
      return NextResponse.json(
        { success: false, message: "Témoignage non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: temoignage }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur récupération témoignage texte:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur inconnue" },
      { status: 500 }
    );
  }
}

// ---------------------------
// PUT /api/admin/temoignages/texte/[id]
// ---------------------------


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;
  const numericId = Number(id);

  try {
    // --- Vérifier si l'enregistrement existe ---
    const existing = await prisma.temoignagesTexte.findUnique({
      where: { id: numericId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Témoignage texte introuvable" },
        { status: 404 }
      );
    }

    // --- Récupérer les données du formulaire ---
    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const category = formData.get("category") as string | null;
    const description = formData.get("description") as string | null;
    const pays = formData.get("pays") as string | null;
    const photoInput = formData.get("photo");

    // --- Gestion de la photo ---
    let photo = existing.photo as { url: string; publicId: string } | null;

    if (photoInput instanceof File) {
      // Supprimer l'ancienne image si elle existe
      if (photo?.publicId) await cloudinary.uploader.destroy(photo.publicId);

      // Upload nouvelle image
      const uploaded = await uploadImage(photoInput, "temoignages/texte");
      photo = { url: uploaded.secure_url, publicId: uploaded.public_id };
    }

    // --- Mise à jour Prisma ---
    const updated = await prisma.temoignagesTexte.update({
      where: { id: numericId },
      data: {
        name: name ?? existing.name,
        category: category ?? existing.category,
        description: description ?? existing.description,
        pays: pays ?? existing.pays,
        photo: photo ? (photo as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur mise à jour témoignage texte:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Erreur serveur inconnue",
      },
      { status: 500 }
    );
  }
}


// ---------------------------
// DELETE /api/admin/temoignages/texte/[id]
// ---------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;
  const numericId = Number(id);

  try {
    const existing = await prisma.temoignagesTexte.findUnique({ where: { id: numericId } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Témoignage texte introuvable" },
        { status: 404 }
      );
    }

    // Supprime l'image Cloudinary si elle existe
    const photo = existing.photo as { url: string; publicId: string } | null;
    if (photo?.publicId) {
      await cloudinary.uploader.destroy(photo.publicId);
    }

    await prisma.temoignagesTexte.delete({ where: { id: numericId } });

    return NextResponse.json({ success: true, message: "Témoignage supprimé" }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur suppression témoignage texte:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Erreur serveur inconnue",
      },
      { status: 500 }
    );
  }
}
