"use client";

import React from "react";
import { VideoTemoignageDTO } from "../../../types/articles-type";


type VideoSEOProps = VideoTemoignageDTO;



export default function VideoSEO({
  title,
  description,
  transcript,
  videotemoi,
  subtitlestemoi,
  webmtemoi,
  thumbnailtemoi,
  updatedAt,
}: VideoSEOProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description,
    thumbnailUrl: thumbnailtemoi?.url,
    uploadDate : updatedAt,
    contentUrl: videotemoi?.url,
    embedUrl: videotemoi?.url,
    transcript,
    publisher: {
      "@type": "Organization",
      name: "Éveil Spirituel : Mystiques et Remèdes pour le Cœur",
    },
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
<video
  controls
  className="w-full rounded-2xl shadow-lg"
  poster={thumbnailtemoi?.url || undefined}
  preload="metadata"
>
  {videotemoi?.url && <source src={videotemoi.url} type="video/mp4" />}
  {webmtemoi?.url && <source src={webmtemoi.url} type="video/webm" />}
  {subtitlestemoi?.url && (
    <track
      src={subtitlestemoi.url}
      kind="subtitles"
      srcLang="fr"
      label="Français"
      default
    />
  )}
  Votre navigateur ne supporte pas la vidéo.
</video>

      <p className="text-gray-600 mt-3">{description}</p>
      <details className="mt-2 text-sm text-gray-500">
        <summary>Lire la transcription</summary>
        <p>{transcript}</p>
      </details>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
