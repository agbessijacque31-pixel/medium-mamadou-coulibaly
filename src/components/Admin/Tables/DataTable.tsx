"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";

// export type Column<T> = {
//   key: keyof T | "actions";
//   label: string;
//   render?: (row: T) => ReactNode;
//   sortable?: boolean;
// };


export type Column<T> = {
  /**
   * Nom de la colonne.
   * Peut être une clé réelle du type (keyof T)
   * ou une clé virtuelle personnalisée.
   */
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};


type DataTableProps<T extends { id?: string | number; slug?: string }> = {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  pageSize?: number;
  searchable?: boolean;
};

function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

export default function DataTable<
  T extends { id?: string | number; slug?: string }
>({
  data,
  columns,
  emptyMessage = "Aucune donnée disponible.",
  pageSize = 500,
  searchable = true,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 🔍 Recherche
  const filteredData: T[] = useMemo(() => {
    try {
      if (!search.trim()) return data ?? [];
      return (data ?? []).filter((row) => {
        try {
          return columns.some((col) => {
            if (col.key === "actions") return false;
            const value = row[col.key as keyof T];
            return value
              ?.toString()
              .toLowerCase()
              .includes(search.toLowerCase());
          });
        } catch {
          return false;
        }
      });
    } catch (err) {
      console.error("Erreur useMemo filteredData :", err);
      return [];
    }
  }, [data, search, columns]);

  // ↕️ Tri
  const sortedData: T[] = useMemo(() => {
    try {
      if (!sortKey) return filteredData;
      return [...filteredData].sort((a, b) => {
        try {
          const aVal = a[sortKey];
          const bVal = b[sortKey];

          if (aVal === bVal) return 0;
          if (aVal == null) return sortOrder === "asc" ? -1 : 1;
          if (bVal == null) return sortOrder === "asc" ? 1 : -1;

          if (typeof aVal === "number" && typeof bVal === "number") {
            return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
          }

          return sortOrder === "asc"
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        } catch {
          return 0;
        }
      });
    } catch (err) {
      console.error("Erreur useMemo sortedData :", err);
      return filteredData;
    }
  }, [filteredData, sortKey, sortOrder]);

  // 🔢 Pagination
  let totalPages = 1;
  let currentData: T[] = [];
  try {
    totalPages = Math.max(Math.ceil((sortedData?.length ?? 0) / pageSize), 1);
    const start = (page - 1) * pageSize;
    currentData = (sortedData ?? []).slice(start, start + pageSize);
  } catch (err) {
    console.error("Erreur pagination :", err);
    totalPages = 1;
    currentData = [];
  }

  // 🔀 Gestion clic tri
  const handleSort = (key: keyof T) => {
    try {
      if (sortKey === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    } catch (err) {
      console.error("Erreur handleSort :", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
      {/* 🔍 Recherche */}
      {searchable && (
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => {
              try {
                setPage(1);
                setSearch(e.target.value);
              } catch (err) {
                console.error("Erreur input search :", err);
              }
            }}
            className="w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-indigo-900"
          />
          <span className="text-sm text-gray-500">
            {(filteredData?.length ?? 0)} résultat(s)
          </span>
        </div>
      )}

      {/* Table */}
      <table className="w-full border-collapse">
        <thead className="bg-indigo-900 text-yellow-400">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`p-3 text-left whitespace-nowrap ${
                  col.sortable ? "cursor-pointer select-none" : ""
                }`}
                onClick={() => {
                  try {
                    if (col.sortable) {
                      handleSort(col.key as keyof T);
                    }
                  } catch (err) {
                    console.error("Erreur clic en-tête :", err);
                  }
                }}
              >
                {col.label}
                {col.sortable && (
                  <ArrowUpDown className="inline w-4 h-4 ml-1 text-yellow-400" />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(currentData?.length ?? 0) > 0 ? (
            currentData.map((row, index) => {
              try {
                const rowId = row.id ?? row.slug ?? `row-${index}`;
                return (
                  <tr
                    key={String(rowId)}
                    className="border-b hover:bg-orange-50 transition"
                  >
                    {columns.map((col) => (
                      <td
                        key={`${rowId}-${String(col.key)}`}
                        className="p-3 text-gray-700 align-top max-w-xs"
                        title={String(row[col.key as keyof T] ?? "")}
                      >
                        <span>
                          {col.render
                            ? col.render(row)
                            : truncateText(
                                String(row[col.key as keyof T] ?? ""),
                                60
                              )}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              } catch (err) {
                console.error("Erreur rendu ligne :", err);
                return null;
              }
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {(sortedData?.length ?? 0) > pageSize && (
        <div className="flex justify-between items-center p-4 bg-gray-50 text-sm text-gray-600">
          <span>
            Page {page} sur {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => {
                try {
                  setPage((p) => Math.max(p - 1, 1));
                } catch (err) {
                  console.error("Erreur bouton précédent :", err);
                }
              }}
              className={`px-3 py-1 rounded-lg border ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Précédent
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => {
                try {
                  setPage((p) => Math.min(p + 1, totalPages));
                } catch (err) {
                  console.error("Erreur bouton suivant :", err);
                }
              }}
              className={`px-3 py-1 rounded-lg border ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
