"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Loader2, Plus } from "lucide-react";
import CategoriesTable, { Category } from "@/components/Admin/Tables/CategoriesTable";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Admin/ui/dialog";
import { Input } from "@/components/Admin/ui/input";
import { Button } from "@/components/Admin/ui/button";
import DataTableToolbar from "@/components/Admin/Tables/DataTableToolbar";


/* ---------------------------------------------
   Schéma zod + type pour le formulaire
---------------------------------------------- */
const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(80, "Le nom est trop long"),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

/* ---------------------------------------------
   Dialog interne réutilisable : Create/Update
---------------------------------------------- */
function CategoryUpsertDialog(props: {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Category | null;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}) {
  const { mode, open, onOpenChange, initial, onSubmit } = props;
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: initial?.name ?? "" },
  });

  // Reset du formulaire quand on ouvre / change d'élément
  useEffect(() => {
    form.reset({ name: initial?.name ?? "" });
  }, [open, initial, form]);

  const submit = async (values: CategoryFormValues) => {
    try {
      setLoading(true);
      await onSubmit(values);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nouvelle catégorie" : "Modifier la catégorie"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-4 pt-2"
          autoComplete="off"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom de la catégorie
            </label>
            <Input
              placeholder="Ex: Amour"
              {...form.register("name")}
              disabled={loading}
              className={
                form.formState.errors.name ? "border-red-500 focus:ring-red-500" : ""
              }
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "create" ? "Création..." : "Sauvegarde..."}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {mode === "create" ? "Ajouter" : "Sauvegarder"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------
   Page principale : connexion API + toolbar + table
---------------------------------------------- */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toolbar : recherche
  const [search, setSearch] = useState("");

  // Dialogs
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  /* -------- Fetch list -------- */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) throw new Error("Erreur API");
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Erreur inconnue");
      }
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* -------- CRUD handlers -------- */
  const handleAddOpen = () => {
    setSelected(null);
    setOpenCreate(true);
  };

  const handleCreate = async (values: CategoryFormValues) => {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Création impossible");
    await fetchCategories();
  };

  const handleEditOpen = (cat: Category) => {
    setSelected(cat);
    setOpenEdit(true);
  };

  const handleEdit = async (values: CategoryFormValues) => {
    if (!selected) return;
    const res = await fetch(`/api/admin/categories/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Mise à jour impossible");
    await fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Suppression impossible");
      return;
    }
    await fetchCategories();
  };

  /* -------- Filtrage côté client (toolbar) -------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      {/* Toolbar générique au-dessus du tableau */}
      <DataTableToolbar
        title="Gestion des catégories"
        onAdd={handleAddOpen}
        addLabel="Ajouter une catégorie"
        searchable
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* États de liste */}
      {loading ? (
        <div className="bg-white shadow-md rounded-xl p-8 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Chargement des catégories...</span>
        </div>
      ) : error ? (
        <div className="bg-white shadow-md rounded-xl p-6 text-red-600">
          Erreur : {error}
          <div className="mt-3">
            <Button variant="outline" onClick={fetchCategories}>
              Réessayer
            </Button>
          </div>
        </div>
      ) : (
        <CategoriesTable
          data={filtered}
          onEdit={handleEditOpen}
          onDelete={handleDelete}
        />
      )}

      {/* Dialog CREATE */}
      <CategoryUpsertDialog
        mode="create"
        open={openCreate}
        onOpenChange={setOpenCreate}
        initial={null}
        onSubmit={handleCreate}
      />

      {/* Dialog EDIT */}
      <CategoryUpsertDialog
        mode="edit"
        open={openEdit}
        onOpenChange={setOpenEdit}
        initial={selected}
        onSubmit={handleEdit}
      />
    </div>
  );
}
