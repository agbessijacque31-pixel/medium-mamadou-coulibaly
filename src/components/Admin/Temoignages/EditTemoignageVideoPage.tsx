"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TemoignagesVideoForme from "./TemoignagesVideoForme";
import { VideoTemoignageFormValues } from "@/lib/Schemas/articleSchema";
import { VideoTemoignageDTO } from "../../../../types/articles-type";
import { uploadFileDirectToCloudinary, uploadVideoAndGenerateWebM } from "@/lib/cloudinary-client";

type Props = {
  temoignage: VideoTemoignageDTO;
};

export default function EditTemoignageVideoPage({ temoignage }: Props) {
  const router = useRouter();

  async function handleSubmit(data: VideoTemoignageFormValues) {
    try {
      // --- Vidéo principale ---
      const videoData =
        data.videotemoi instanceof File
          ? await uploadVideoAndGenerateWebM(data.videotemoi)
          : {
              videotemoi: data.videotemoi ?? temoignage.videotemoi,
              webmtemoi: data.webmtemoi ?? temoignage.webmtemoi,
            };

      // --- Miniature ---
      const thumbnailtemoi =
        data.thumbnailtemoi instanceof File
          ? await uploadFileDirectToCloudinary(data.thumbnailtemoi, "image")
          : data.thumbnailtemoi ?? temoignage.thumbnailtemoi;

      // --- Sous-titres ---
      const subtitlestemoi =
        data.subtitlestemoi instanceof File
          ? await uploadFileDirectToCloudinary(data.subtitlestemoi, "raw")
          : data.subtitlestemoi ?? temoignage.subtitlestemoi;

      // --- Envoi au serveur ---
      const res = await fetch(`/api/admin/temoignages/video/${temoignage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          transcript: data.transcript,
          videotemoi: videoData.videotemoi,
          webmtemoi: videoData.webmtemoi,
          thumbnailtemoi,
          subtitlestemoi,
        }),
      });

      const debug = await res.text();
      console.log("Réponse API mise à jour témoignage:", res.status, debug);

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du témoignage");

      toast.success("✅ Témoignage mis à jour avec succès !");
      router.push("/admin/temoignages/videos");
      router.refresh();
    } catch (err) {
      console.error("❌ Erreur mise à jour vidéo :", err);
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Modifier le témoignage : {temoignage.title}
      </h1>
      <TemoignagesVideoForme initialData={temoignage} onSubmit={handleSubmit} />
    </div>
  );
}
