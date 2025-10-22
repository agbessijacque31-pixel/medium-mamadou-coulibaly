"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Loader2, Plus } from "lucide-react";
import TagTable, { Tag } from "@/components/Admin/Tables/TagsTable";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Admin/ui/dialog";
import { Input } from "@/components/Admin/ui/input";
import { Button } from "@/components/Admin/ui/button";
import DataTableToolbar from "@/components/Admin/Tables/DataTableToolbar";



/* ---------------------------------------------
   Schéma zod + type pour le formulaire
---------------------------------------------- */
const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(80, "Le nom est trop long"),
});
type TagFormValues = z.infer<typeof tagSchema>;

/* ---------------------------------------------
   Dialog interne réutilisable : Create/Update
---------------------------------------------- */
function TagUpsertDialog(props: {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Tag | null;
  onSubmit: (values: TagFormValues) => Promise<void>;
}) {
  const { mode, open, onOpenChange, initial, onSubmit } = props;
  const [loading, setLoading] = useState(false);

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: initial?.name ?? "" },
  });

  useEffect(() => {
    form.reset({ name: initial?.name ?? "" });
  }, [open, initial, form]);

  const submit = async (values: TagFormValues) => {
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
            {mode === "create" ? "Nouvelle tag" : "Modifier le tag"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-4 pt-2" autoComplete="off">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du Tag</label>
            <Input
              placeholder="Ex: Amour"
              {...form.register("name")}
              disabled={loading}
              className={form.formState.errors.name ? "border-red-500 focus:ring-red-500" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={loading}>
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
   Page principale
---------------------------------------------- */
export default function TagPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<Tag | null>(null);

  /* -------- Fetch list -------- */
  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tag", { cache: "no-store" });
      if (!res.ok) throw new Error("Erreur API");
      const data: Tag[] = await res.json();
      setTags(data);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  /* -------- CRUD handlers -------- */
  const handleAddOpen = () => {
    setSelected(null);
    setOpenCreate(true);
  };

  const handleCreate = async (values: TagFormValues) => {
    const res = await fetch("/api/admin/tag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Création impossible");
    await fetchTags();
  };

  const handleEditOpen = (tag: Tag) => {
    setSelected(tag);
    setOpenEdit(true);
  };

  const handleEdit = async (values: TagFormValues) => {
    if (!selected) return;
    const res = await fetch(`/api/admin/tag/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Mise à jour impossible");
    await fetchTags();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce tag ?")) return;
    const res = await fetch(`/api/admin/tag/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Suppression impossible");
      return;
    }
    await fetchTags();
  };

  /* -------- Filtrage côté client -------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, search]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <DataTableToolbar
        title="Gestion des tags"
        onAdd={handleAddOpen}
        addLabel="Ajouter un tag"
        searchable
        searchValue={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="bg-white shadow-md rounded-xl p-8 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Chargement des tags...</span>
        </div>
      ) : error ? (
        <div className="bg-white shadow-md rounded-xl p-6 text-red-600">
          Erreur : {error}
          <div className="mt-3">
            <Button variant="outline" onClick={fetchTags}>
              Réessayer
            </Button>
          </div>
        </div>
      ) : (
        <TagTable data={filtered} onEdit={handleEditOpen} onDelete={handleDelete} />
      )}

      <TagUpsertDialog mode="create" open={openCreate} onOpenChange={setOpenCreate} initial={null} onSubmit={handleCreate} />
      <TagUpsertDialog mode="edit" open={openEdit} onOpenChange={setOpenEdit} initial={selected} onSubmit={handleEdit} />
    </div>
  );
}
