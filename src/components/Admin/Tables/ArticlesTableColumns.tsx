import { Pencil, Trash2, Eye } from "lucide-react";
import { ArticleDTO } from "../../../../types/articles-type";
import { Column } from "./DataTable";
import Image from "next/image";

type Props = {
  onEdit: (article: ArticleDTO) => void;
  onView: (article: ArticleDTO) => void;
  onDelete: (slug: string) => void;
};

export const articleColumns = (
  { onEdit, onView, onDelete }: Props
): Column<ArticleDTO>[] => [
  {
    key: "coverImage",
    label: "Photo",
    sortable: false,
    render: (row) =>
      row.coverImage ? (
        <Image
          src={row.coverImage.url ?? "/default-cover.jpg"}
          alt={row.title}
          className="w-12 h-12 object-cover rounded-md shadow-sm"
          width={48}
          height={48}
        />
      ) : (
        <span className="text-gray-400 italic">Aucune</span>
      ),
  },
  { key: "title", label: "Titre", sortable: true },
  {
    key: "description",
    label: "Articles",
    sortable: true,
    render: (row) => (
      <span className="block max-w-xs truncate">
        {row.description.length > 80
          ? row.description.substring(0, 80) + "..."
          : row.description}
      </span>
    ),
  },
  {
    key: "category",
    label: "Catégorie",
    sortable: false,
    render: (row) => (
      <span className="text-gray-600 whitespace-nowrap">
        {row.category || "–"}
      </span>
    ),
  },
  {
    key: "published",
    label: "Publié",
    sortable: true,
    render: (row) =>
      row.published ? (
        <span className="text-green-600 font-medium">Oui</span>
      ) : (
        <span className="text-red-600 font-medium">Non</span>
      ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => onEdit(row)}
          title="Modifier l'article"
          aria-label="Modifier"
          className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-lg"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => onView(row)}
          title="Voir l'article"
          aria-label="Voir"
          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg"
        >
          <Eye className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(row.slug)}
          title="Supprimer l'article"
          aria-label="Supprimer"
          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    ),
  },
];
