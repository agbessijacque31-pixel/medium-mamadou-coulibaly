"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TexteTemoignageDTO } from "../../../../../types/articles-type";
import DataTable, { Column } from "../../Tables/DataTable";
import { Button } from "../../ui/button";

type Props = {
  temoignages: TexteTemoignageDTO[];
};

export default function TexteTemoignagesPage({ temoignages }: Props) {
  const [localTemoignages, setLocalTemoignages] = useState<TexteTemoignageDTO[]>(temoignages);
  const router = useRouter();

  // 🔹 Suppression d’un témoignage texte
  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Voulez-vous vraiment supprimer ce témoignage texte ?")) return;

      try {
        const res = await fetch(`/api/admin/temoignages/texte/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression");

        setLocalTemoignages((prev) => prev.filter((t) => t.id !== id));
        router.refresh();
        alert(`Témoignage texte ${id} supprimé ✅`);
      } catch (error) {
        console.error("❌ Erreur suppression :", error);
        alert("Suppression impossible ❌");
      }
    },
    [router]
  );

  // 🔹 Colonnes du tableau
  const columns: Column<TexteTemoignageDTO>[] = useMemo(
    () => [
      { key: "name", label: "Nom", sortable: true },
      { key: "category", label: "Catégorie", sortable: true },
      {
        key: "description",
        label: "Description",
        render: (row) => (
          <span className="text-gray-700 italic">
            {row.description?.length && row.description.length > 100
              ? row.description.slice(0, 100) + "…"
              : row.description || "—"}
          </span>
        ),
      },
      { key: "pays", label: "Pays", sortable: true },
      {
        key: "updatedAt",
        label: "Date de mise à jour",
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
            <Link href={`/admin/temoignages/texte/${row.id}/edit`}>
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
          📝 Gestion des témoignages texte
        </h1>
        <Link href="/admin/temoignages/texte/create">
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
