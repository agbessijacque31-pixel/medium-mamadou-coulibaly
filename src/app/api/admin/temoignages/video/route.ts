import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { mapVideoTemoignage } from "../../../../../../types/articles-type";
import { requireAdmin } from "@/lib/adminOnly";

// ---------------------------
// POST /api/admin/temoignages/video
// ---------------------------

export async function POST(req: NextRequest) {
  await requireAdmin();
  try {
    const body = await req.json();

    // validation basique
    if (!body.title || !body.videotemoi || !body.webmtemoi) {
      return NextResponse.json(
        { message: "Champs obligatoires manquants : title, videotemoi, webmtemoi" },
        { status: 400 }
      );
    }

    const temoignage = await prisma.videoTemoignage.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        transcript: body.transcript ?? null,
        videotemoi: body.videotemoi,          // objet JSON {url, publicId}
        webmtemoi: body.webmtemoi,            // objet JSON {url, publicId}
        thumbnailtemoi: body.thumbnailtemoi ?? {}, // objet JSON
        subtitlestemoi: body.subtitlestemoi ?? null,
      },
    });

    return NextResponse.json(temoignage, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur création témoignage :", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}

// ---------------------------
// GET /api/admin/temoignages
// ---------------------------
export async function GET() {
  await requireAdmin();
  try {
    const temoignages = await prisma.videoTemoignage.findMany({
      orderBy: { createdat: "desc" }, // utilise le nom exact du schéma
      select: {
        id: true,
        title: true,
        description: true,
        transcript: true,
        videotemoi: true,
        subtitlestemoi: true,
        thumbnailtemoi: true,
        webmtemoi: true,
        createdat: true,
        updatedat: true,
      },
    });

    // ✅ On convertit les noms avant de passer au mapper
    const dto = temoignages.map((t) =>
      mapVideoTemoignage({
        ...t,
        createdAt: t.createdat ?? new Date(),
        updatedAt: t.updatedat ?? new Date(),
      })
    );

    return NextResponse.json({ success: true, data: dto });
  } catch (error) {
    console.error("Erreur récupération témoignages :", error);
    return NextResponse.json(
      { success: false, error: "Impossible de récupérer les témoignages" },
      { status: 500 }
    );
  }
}