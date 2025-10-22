"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import DataTable, { Column } from "../Tables/DataTable";
import { VideoTemoignageDTO } from "../../../../types/articles-type";

type Props = {
  temoignages: VideoTemoignageDTO[];
};

export default function VideoTemoignagesPage({ temoignages }: Props) {
  const [localTemoignages, setLocalTemoignages] = useState<VideoTemoignageDTO[]>(temoignages);
  const router = useRouter();

  // 🔹 Suppression d’un témoignage vidéo
  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Voulez-vous vraiment supprimer ce témoignage vidéo ?")) return;

      try {
        const res = await fetch(`/api/admin/temoignages/video/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression");

        setLocalTemoignages((prev) => prev.filter((t) => t.id !== id));
        router.refresh();
        alert(`Témoignage vidéo ${id} supprimé ✅`);
      } catch (error) {
        console.error("❌ Erreur suppression :", error);
        alert("Suppression impossible ❌");
      }
    },
    [router]
  );

  // 🔹 Colonnes du tableau
  const columns: Column<VideoTemoignageDTO>[] = useMemo(
    () => [
      {
        key: "thumbnail",
        label: "Aperçu",
        render: (row) => (
          <video
            src={row.videotemoi?.url || undefined}
            poster={row.thumbnailtemoi?.url || undefined}
            className="w-24 h-16 rounded-lg object-cover"
          />
        ),
      },
      { key: "title", label: "Titre", sortable: true },
      {
        key: "description",
        label: "Description",
        render: (row) => (
          <span className="text-gray-700 italic">
            {row.description?.length && row.description.length > 80
              ? row.description.slice(0, 80) + "…"
              : row.description || "—"}
          </span>
        ),
      },
      {
        key: "uploadDate",
        label: "Date d’ajout",
        render: (row) =>
          row.updatedAt
            ? new Date(row.updatedAt).toLocaleDateString()
            : "—",
        sortable: true,
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex gap-2">
            <Link href={`/admin/temoignages/videos/${row.id}/edit`}>
              <Button size="sm" variant="outline">
                ✏️ Modifier
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
onClick={() => row.id && handleDelete(row.id)}
            >
              🗑 Supprimer
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <div className="p-6">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🎬 Gestion des témoignages vidéo
        </h1>
        <Link href="/admin/temoignages/videos/create">
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            ➕ Nouveau témoignage
          </Button>
        </Link>
      </div>

      {/* 🔹 Tableau */}
      <DataTable data={localTemoignages} columns={columns} />
    </div>
  );
}
