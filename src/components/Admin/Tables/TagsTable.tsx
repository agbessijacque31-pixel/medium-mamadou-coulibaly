"use client";
import { Pencil, Trash2 } from "lucide-react";
import DataTable from "./DataTable";

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

type TagTableProps = {
  data: Tag[];
  onEdit: (cat: Tag) => void;
  onDelete: (id: number) => void;
};

export default function TagTable({
  data,
  onEdit,
  onDelete,
}: TagTableProps) {
  return (
    <DataTable
      data={data}
      pageSize={500} // Augmentation de pageSize pour afficher plus de lignes si besoin
      searchable
      columns={[
        { key: "id", label: "ID", sortable: true },
        { key: "name", label: "Nom", sortable: true },
        { key: "slug", label: "Slug", sortable: true },
        {
          key: "actions",
          label: "Actions",
          render: (cat) => (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onEdit(cat)}
                className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-lg"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(cat.id)}
                className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ),
        },
      ]}
      emptyMessage="Aucune tag pour le moment."
    />
  );
}
