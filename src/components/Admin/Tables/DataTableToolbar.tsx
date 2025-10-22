"use client";

import { Plus, Search } from "lucide-react";
import { ReactNode } from "react";

type DataTableToolbarProps = {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children?: ReactNode; // Pour filtres personnalisés
};

export default function DataTableToolbar({
  title,
  onAdd,
  addLabel = "Ajouter",
  searchable = false,
  searchValue = "",
  onSearchChange,
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Titre */}
      <h2 className="text-xl font-bold">{title}</h2>

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        {/* Barre de recherche */}
        {searchable && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9 pr-3 py-2 border rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
            />
          </div>
        )}

        {/* Filtres personnalisés */}
        {children}

        {/* Bouton Ajouter */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
