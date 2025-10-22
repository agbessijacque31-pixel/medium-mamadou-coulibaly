"use client";

import { Pencil, Trash2 } from "lucide-react";
import DataTable from "./DataTable";

export type Category = {
  id: number;
  name: string;
  slug: string;
};

type CategoriesTableProps = {
  data: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
};

export default function CategoriesTable({
  data,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <DataTable
      data={data}
      pageSize={5}
      searchable
      columns={[
        { key: "name", label: "Nom", sortable: true },
        { key: "slug", label: "Slug", sortable: true },
        {
          key: "actions",
          label: "Actions",
          render: (cat) => (
            <div className="flex gap-3 justify-center items-center">
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
      emptyMessage="Aucune catégorie pour le moment."
    />
  );
}
