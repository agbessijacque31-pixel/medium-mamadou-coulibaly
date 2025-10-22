"use client";

import { useState } from "react";
import VideoSEO from "./VideoSEO";
import { VideoTemoignageDTO } from "../../../types/articles-type";

interface Props {
  temoignagesvideo: VideoTemoignageDTO[];
}

export default function TemoignagesVideosSection({ temoignagesvideo }: Props) {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-text">
            Témoignages en vidéo
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto">
            Découvrez en images les expériences réelles de ceux qui ont
            bénéficié des rituels du{" "}
            <span className="font-semibold">Marabout Mamadou Coulibaly</span>.
          </p>
        </div>

        {/* Grid of video cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {temoignagesvideo.map((video, index) => (
            <VideoSEO
              key={index}
              title={video.title || "Titre indisponible"}
              description={video.description || "Pas de description disponible."}
              transcript={video.transcript || ""}
              videotemoi={video.videotemoi || { url: "", publicId: "" }}
              webmtemoi={video.webmtemoi || { url: "", publicId: "" }}
              thumbnailtemoi={video.thumbnailtemoi || { url: "", publicId: "" }}
              subtitlestemoi={video.subtitlestemoi || null}
              createdAt={video.createdAt || new Date().toISOString()}
              updatedAt={video.updatedAt || new Date().toISOString()}
            />
          ))}
        </div>

        {/* Modal video player */}
        {selectedVideo !== null && temoignagesvideo[selectedVideo] && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
              >
                ✕
              </button>

              <video
                controls
                autoPlay
                className="w-full rounded-t-lg"
                poster={temoignagesvideo[selectedVideo].thumbnailtemoi?.url || ""}
              >
                <source
                  src={temoignagesvideo[selectedVideo].videotemoi?.url || ""}
                  type="video/mp4"
                />
                {temoignagesvideo[selectedVideo].webmtemoi && (
                  <source
                    src={temoignagesvideo[selectedVideo].webmtemoi.url || ""}
                    type="video/webm"
                  />
                )}
                {temoignagesvideo[selectedVideo].subtitlestemoi && (
                  <track
                    src={temoignagesvideo[selectedVideo].subtitlestemoi.url || ""}
                    kind="subtitles"
                    srcLang="fr"
                    label="Français"
                    default
                  />
                )}
                Votre navigateur ne supporte pas la lecture de vidéo.
              </video>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {temoignagesvideo[selectedVideo].title || "Titre indisponible"}
                </h3>
                <p className="text-gray-600">
                  {temoignagesvideo[selectedVideo].description ||
                    "Pas de description disponible."}
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  {temoignagesvideo[selectedVideo].transcript || ""}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
