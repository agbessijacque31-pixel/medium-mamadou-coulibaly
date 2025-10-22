"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { VideoTemoignageDTO } from "../../../../types/articles-type";
import { useTemoignageVideoForm } from "./useTemoignageVideoForm";
import { VideoTemoignageFormValues } from "@/lib/Schemas/articleSchema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

type Props = {
  initialData?: VideoTemoignageDTO;
  onSubmit?: (data: VideoTemoignageFormValues) => Promise<void>;
};

export default function TemoignagesVideoForme({ initialData, onSubmit }: Props) {
  const { register, watch, setValue, onSubmit: internalSubmit, handleSubmit, formState } =
    useTemoignageVideoForm(initialData);

  const values = watch();

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [subtitlePreview, setSubtitlePreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Initialisation des previews à partir des données existantes
  useEffect(() => {
    if (initialData?.videotemoi?.url) setVideoPreview(initialData.videotemoi.url);
    if (initialData?.subtitlestemoi?.url) setSubtitlePreview(initialData.subtitlestemoi.url);
    if (initialData?.thumbnailtemoi?.url) setThumbnailPreview(initialData.thumbnailtemoi.url);
  }, [initialData]);

  // Nettoyage des URL.createObjectURL
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (subtitlePreview) URL.revokeObjectURL(subtitlePreview);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [videoPreview, subtitlePreview, thumbnailPreview]);

  function handleVideoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setValue("videotemoi", file);
    }
  }

  function handleSubtitleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSubtitlePreview(URL.createObjectURL(file));
      setValue("subtitlestemoi", file);
    }
  }

  function handleThumbnailFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnailtemoi", file);
    }
  }

  const submitHandler = handleSubmit(async (data) => {
    if (onSubmit) await onSubmit(data);
    else await internalSubmit(data);
  });

  return (
    <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne principale */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la vidéo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Titre</label>
              <input
                {...register("title")}
                className="w-full border p-2 rounded"
                placeholder="Titre de la vidéo"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                {...register("description")}
                className="w-full border p-2 rounded"
                placeholder="Description"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Transcription (optionnel)</label>
              <textarea
                {...register("transcript")}
                className="w-full border p-2 rounded"
                placeholder="Transcription"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fichier vidéo MP4</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block font-semibold mb-1">Vidéo</label>
            <input type="file" accept="video/mp4" onChange={handleVideoFileChange} className="w-full" />
            {videoPreview && (
              <video controls className="w-64 mt-2 rounded" src={videoPreview} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Fichier sous-titres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block font-semibold mb-1">Sous-titres (optionnel)</label>
            <input type="file" accept=".vtt,.srt,.txt" onChange={handleSubtitleFileChange} className="w-full" />
            {subtitlePreview && (
              <p className="mt-1 text-sm text-gray-600">
                {values.subtitlestemoi instanceof File
                  ? `${values.subtitlestemoi.name} (${(values.subtitlestemoi.size / 1024).toFixed(1)} KB)`
                  : `Sous-titres existants : ${values.subtitlestemoi?.url ?? ""}`}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Couverture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block font-semibold mb-1">Photo de couverture</label>
            <input type="file" accept="image/*" onChange={handleThumbnailFileChange} className="w-full" />
            {thumbnailPreview && (
              <Image
                src={thumbnailPreview}
                alt="Couverture vidéo"
                className="mb-2 max-h-48 object-cover"
                width={300}
                height={300}
              />
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={formState.isSubmitting} className="w-full">
          {formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
