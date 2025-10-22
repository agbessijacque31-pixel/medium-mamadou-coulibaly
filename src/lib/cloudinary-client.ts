// src/lib/cloudinary-client.ts
import { ImageValue } from "../../types/articles-type";

// Fonction utilitaire client-safe
function buildCloudinaryUrl(publicId: string, format: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_${format}/${publicId}.${format}`;
}

// Upload direct générique
export async function uploadFileDirectToCloudinary(
  file: File,
  resourceType: "video" | "image" | "raw"
): Promise<ImageValue> {
  const res = await fetch("/api/admin/temoignages/cloudinary-signature");
  const { signature, timestamp, folder, cloudName } = await res.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("resource_type", resourceType);

  const cloudRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  const data = await cloudRes.json();
  if (!cloudRes.ok) throw new Error(data.error?.message || "Erreur Cloudinary");
  return { url: data.secure_url, publicId: data.public_id };
}

// Upload vidéo avec WebM automatique (client-side safe)
export async function uploadVideoAndGenerateWebM(
  file: File
): Promise<{ videotemoi: ImageValue; webmtemoi: ImageValue }> {
  const video = await uploadFileDirectToCloudinary(file, "video");

  if (!video?.publicId) {
    throw new Error("Impossible de récupérer le publicId de la vidéo Cloudinary");
  }

  const mp4Url = buildCloudinaryUrl(video.publicId, "mp4");
  const webmUrl = buildCloudinaryUrl(video.publicId, "webm");

  return {
    videotemoi: { url: mp4Url, publicId: video.publicId },
    webmtemoi: { url: webmUrl, publicId: video.publicId },
  };
}
