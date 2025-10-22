import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { toJsonValue } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/adminOnly";

// ---------------------------
// GET /api/admin/temoignages/video/[id]
// ---------------------------
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await requireAdmin();
    const { id } = await params;
    const numericId = Number(id);

    try {
        const temoignage = await prisma.videoTemoignage.findUnique({
            where: { id: numericId },
        });

        if (!temoignage) {
            return NextResponse.json({ message: "Témoignage non trouvé" }, { status: 404 });
        }

        return NextResponse.json(temoignage, { status: 200 });
    } catch (error) {
        console.error("❌ Erreur récupération témoignage:", error);
        return NextResponse.json({ message: "Erreur serveur inconnue" }, { status: 500 });
    }
}

// ---------------------------
// PUT /api/admin/temoignages/video/[id]
// ---------------------------
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await requireAdmin();
    const { id } = await params;
    const numericId = Number(id);
    try {


        const existing = await prisma.videoTemoignage.findUnique({
            where: { id: numericId },
        });

        if (!existing) {
            return NextResponse.json({ message: "Témoignage introuvable" }, { status: 404 });
        }

        const body = await req.json();

        // --- On merge les nouvelles valeurs avec les anciennes ---
        const updatedData = {
            title: body.title ?? existing.title,
            description: body.description ?? existing.description,
            transcript: body.transcript ?? existing.transcript,
            videotemoi: body.videotemoi ?? existing.videotemoi,
            webmtemoi: body.webmtemoi ?? existing.webmtemoi,
            thumbnailtemoi: body.thumbnailtemoi ?? existing.thumbnailtemoi,
            subtitlestemoi: body.subtitlestemoi ?? existing.subtitlestemoi,
            updatedat: new Date(),
        };

        // --- Mise à jour dans Prisma ---
        const updated = await prisma.videoTemoignage.update({
            where: { id: numericId },
            data: {
                title: updatedData.title,
                description: updatedData.description,
                transcript: updatedData.transcript,
                videotemoi: toJsonValue(updatedData.videotemoi),
                webmtemoi: toJsonValue(updatedData.webmtemoi),
                thumbnailtemoi: toJsonValue(updatedData.thumbnailtemoi),
                subtitlestemoi: toJsonValue(updatedData.subtitlestemoi),
                updatedat: updatedData.updatedat,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("❌ Erreur mise à jour témoignage:", error);
        const message = error instanceof Error ? error.message : "Erreur serveur inconnue";
        return NextResponse.json({ message }, { status: 500 });
    }
}
// ---------------------------
// DELETE /api/admin/temoignages/video/[id]
// ---------------------------
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await requireAdmin();

    const { id } = await params;
    const numericId = Number(id);

    try {
        await prisma.videoTemoignage.delete({ where: { id: numericId } });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("❌ Erreur suppression témoignage:", error);
        const message = error instanceof Error ? error.message : "Erreur serveur inconnue";
        return NextResponse.json({ message }, { status: 500 });
    }
}
