"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TemoignagesVideoForme from "./TemoignagesVideoForme";
import { VideoTemoignageFormValues } from "@/lib/Schemas/articleSchema";
import { uploadFileDirectToCloudinary, uploadVideoAndGenerateWebM } from "@/lib/cloudinary-client";
export default function CreateTemoignagesVideoPage() {
    const router = useRouter();

    async function handleSubmit(data: VideoTemoignageFormValues) {
        try {
            // Upload vidéo + génération WebM
            const videoData = data.videotemoi instanceof File ? await uploadVideoAndGenerateWebM(data.videotemoi) : {
                videotemoi: data.videotemoi,
                webmtemoi: data.webmtemoi
            };

            // Upload miniature et sous-titres
            const thumbnailtemoi = data.thumbnailtemoi instanceof File ? await uploadFileDirectToCloudinary(data.thumbnailtemoi, "image") : data.thumbnailtemoi;
            const subtitlestemoi = data.subtitlestemoi instanceof File ? await uploadFileDirectToCloudinary(data.subtitlestemoi, "raw") : data.subtitlestemoi;

            // Envoi au serveur
            const res = await fetch("/api/admin/temoignages/video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    transcript: data.transcript,
                    videotemoi: videoData.videotemoi,   // objet JSON
                    webmtemoi: videoData.webmtemoi,     // objet JSON
                    thumbnailtemoi,                      // objet JSON
                    subtitlestemoi,                      // objet JSON ou null
                }),
            });


            const debug = await res.text(); // <== Ajoute ceci
            console.log("Réponse API création témoignage:", res.status, debug); // <== Et ceci

            if (!res.ok) throw new Error("Erreur création témoignage");


            toast.success("✅ Témoignage vidéo créé avec MP4 + WebM !");
            router.push("/admin/temoignages/videos");
            router.refresh();
        } catch (err) {
            console.error("❌ Erreur création vidéo :", err);
            toast.error(err instanceof Error ? err.message : "Erreur inconnue");
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Créer un nouveau témoignage vidéo</h1>
            <TemoignagesVideoForme onSubmit={handleSubmit} />
        </div>
    );
}
