"use client"; // si c’est côté client

import { useEffect, useState } from "react";
import VideoTemoignagesPage from "@/components/Admin/Temoignages/VideoTemoignagesPage";
import { VideoTemoignageDTO } from "../../../../../../types/articles-type";

export default function VideoTemoignagesAdminPage() {
  const [temoignages, setTemoignages] = useState<VideoTemoignageDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/temoignages/video")
      .then(res => res.json())
      .then(data => {
        if (data.success) setTemoignages(data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;

  return <VideoTemoignagesPage temoignages={temoignages} />;
}
