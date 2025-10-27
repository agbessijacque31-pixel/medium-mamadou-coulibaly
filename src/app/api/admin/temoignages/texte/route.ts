import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/adminOnly";



export async function GET(_req: NextRequest) {
  await requireAdmin();

  try {
    const temoignages = await prisma.temoignagesTexte.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: temoignages,
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}


// ---------------------------
// POST /api/admin/temoignages/texte
// ---------------------------
export async function POST(req: NextRequest) {
    await requireAdmin();
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const pays = formData.get("pays") as string;

        // --- Photo ---
        let photoJson: Prisma.InputJsonValue | typeof Prisma.JsonNull = Prisma.JsonNull;
        const photoFile = formData.get("photo");

        if (photoFile instanceof File) {
            const uploaded = await uploadImage(photoFile, "temoignages/texte");
            photoJson = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id,
            };
        }

        const temoignage = await prisma.temoignagesTexte.create({
            data: {
                name,
                category,
                description,
                pays,
                photo: photoJson,
            },
        });

        return NextResponse.json(temoignage, { status: 201 });
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json(
            { message: err instanceof Error ? err.message : "Erreur serveur" },
            { status: 500 }
        );
    }
}
