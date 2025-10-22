"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ArticleDTO } from "../../../../types/articles-type";
import { useRouter } from "next/navigation";
import DataTable, { Column } from "../Tables/DataTable";
import { Button } from "../ui/button";

type Props = {
  articles: ArticleDTO[];
};

export default function ArticlesPage({ articles }: Props) {
  const [localArticles, setLocalArticles] = useState<ArticleDTO[]>(articles);
  const router = useRouter();

  // 🔹 Suppression d’un article
  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;

      try {
        const res = await fetch(`/api/admin/articles/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression");

        setLocalArticles((prev) => prev.filter((article) => article.id !== id));
        router.refresh();
        alert(`Article ${id} supprimé ✅`);
      } catch (error) {
        console.error("❌ Erreur suppression :", error);
        alert("Suppression impossible ❌");
      }
    },
    [router]
  );

  // 🔹 Colonnes du tableau
  const columns: Column<ArticleDTO>[] = useMemo(
    () => [
      { key: "title", label: "Titre", sortable: true },
      {
        key: "description",
        label: "Description",
        render: (row) => (
          <span className="text-gray-700 italic">
            {row.description?.length > 80
              ? row.description.slice(0, 80) + "…"
              : row.description}
          </span>
        ),
      },
      {
        key: "published",
        label: "Statut",
        render: (row) =>
          row.published ? (
            <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
              ✅ Publié
            </span>
          ) : (
            <span className="px-2 py-1 rounded-lg bg-red-100 text-red-600 text-sm font-medium">
              ❌ Brouillon
            </span>
          ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex gap-2">
            <Link href={`/admin/rituels/${row.id}/edit`}>
              <Button size="sm" variant="outline">
                ✏️ Modifier
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(row.id)}
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
          📄 Gestion des articles
        </h1>
        <Link href="/admin/rituels/create">
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            ➕ Nouvel Article
          </Button>
        </Link>
      </div>

      {/* 🔹 Tableau */}
      <DataTable data={localArticles} columns={columns} />
    </div>
  );
}
