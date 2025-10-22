import { v2 as cloudinary } from "cloudinary";
import { Prisma } from "@prisma/client";
import { ImageValue } from "../../types/articles-type";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload helper




// ✅ Type pour les retours Cloudinary
// --- Type minimaliste pour Cloudinary ---
export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  resource_type?: "image" | "video" | "raw";
  format?: string;
  bytes?: number;
  duration?: number; // utile pour les vidéos
  [key: string]: unknown; // pour tout autre champ retourné par Cloudinary
};


// ✅ Helper pour upload un fichier vers Cloudinary

// --- Upload générique ---
export async function uploadFileToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" | "raw"
): Promise<CloudinaryUploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result as CloudinaryUploadResult);
      }
    );
    uploadStream.end(buffer);
  });
}


/**
 * Helpers spécialisés (plus lisibles)
 */
export const uploadImage = (file: File, folder: string) =>
  uploadFileToCloudinary(file, folder, "image");

export const uploadVideo = (file: File, folder: string) =>
  uploadFileToCloudinary(file, folder, "video");

export const uploadRaw = (file: File, folder: string) =>
  uploadFileToCloudinary(file, folder, "raw");



function toJsonValue<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}


export { toJsonValue };

export default cloudinary;





// ✅ Helper pour générer les URLs vidéo (mp4 + webm) à partir d'un publicId Cloudinary

export function getVideoUrls(publicId: string): { videoData: ImageValue; webmData: ImageValue } {
  const mp4Url = cloudinary.url(publicId, {
    resource_type: "video",
    format: "mp4",
    transformation: [{ quality: "auto" }],
    secure: true,
  });

  const webmUrl = cloudinary.url(publicId, {
    resource_type: "video",
    format: "webm",
    transformation: [{ quality: "auto" }],
    secure: true,
  });

  return {
    videoData: { url: mp4Url, publicId },
    webmData: { url: webmUrl, publicId },
  };
}




