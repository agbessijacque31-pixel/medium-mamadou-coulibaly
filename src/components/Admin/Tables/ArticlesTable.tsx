"use client";

import DataTable from "./DataTable";
import { ArticleDTO } from "../../../../types/articles-type";
import { articleColumns } from "./ArticlesTableColumns";



type ArticleTableProps = {
  data: ArticleDTO[];
  onEdit: (article: ArticleDTO) => void;
  onDelete: (slug: string) => void;
  onView: (article: ArticleDTO) => void;
};



export default function ArticlesTable({
  data,
  onEdit,
  onView,
  onDelete,
}: ArticleTableProps) {
  return (
    <DataTable
      data={data}
      pageSize={5}
      searchable
      columns={articleColumns({ onEdit, onView, onDelete })}
      emptyMessage="Aucune aticle pour le moment."
    />
  );
}
