import TemoignagesTextesSection from "@/components/Acceuille/TemoignagesTextesSection";
import TemoignagesVideosSection from "@/components/Acceuille/TemoignagesVideosSection";
import BlogLayout from "@/components/Admin/BlogLayout";
import { seoTemoignages } from "@/data/seoData";
import { contentTemoignages } from "@/lib/getContentPage";
import prisma from "@/lib/prisma";
import { generateJSONLD, generateStaticMetadata } from "@/lib/seo";
import { ImageValue, mapVideoTemoignage, TexteTemoignageDTO } from "../../../../types/articles-type";

// ✅ Régénération toutes les 60 secondes, rendu dynamique forcé
export const revalidate = 60;

// ✅ Métadonnées SEO statiques
export const metadata = generateStaticMetadata(seoTemoignages);

export default async function TemoignagesPage() {
    // ✅ Exécution parallèle des deux requêtes Prisma pour plus de vitesse
    const [temoignagesTexteRaw, temoignagesVideoRaw] = await Promise.all([
        prisma.temoignagesTexte.findMany({
            orderBy: { createdAt: "desc" },
        }),
        prisma.videoTemoignage.findMany({
            orderBy: { createdat: "desc" },
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
        }),
    ]);


    const temoignagestext: TexteTemoignageDTO[] = temoignagesTexteRaw.map((t) => {
        let photo: ImageValue = null;

        // 🧩 On vérifie que le JSON correspond bien à la structure attendue
        if (t.photo && typeof t.photo === "object" && "url" in t.photo && "publicId" in t.photo) {
            const safePhoto = t.photo as Record<string, unknown>;

            photo = {
                url: (safePhoto.url as string | null) ?? null,
                publicId: (safePhoto.publicId as string | null) ?? null,
            };
        }


        return {
            ...t,
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
            photo,
        };
    });


    const temoignagesvideo = temoignagesVideoRaw.map((t) =>
        mapVideoTemoignage({
            ...t,
            createdAt: t.createdat ?? new Date(),
            updatedAt: t.updatedat ?? new Date(),
        })
    );

    // ✅ Rendu final
    return (
        <>
            <BlogLayout content={contentTemoignages}>
                <div>
                    <TemoignagesTextesSection temoignagestext={temoignagestext} />
                    <TemoignagesVideosSection temoignagesvideo={temoignagesvideo} />
                </div>
            </BlogLayout>

            {/* ✅ SEO JSON-LD intégré proprement */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: generateJSONLD(seoTemoignages) }}
            />
        </>
    );
}
