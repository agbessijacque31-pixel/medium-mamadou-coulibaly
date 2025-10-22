"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { TexteTemoignageDTO } from "../../../../../types/articles-type";
import { TemoignageTexteFormValues } from "@/lib/Schemas/articleSchema";
import { useTemoignageTexteForm } from "./useTemoignageTexteForm";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";


type Props = {
  initialData?: TexteTemoignageDTO;
  onSubmit?: (data: TemoignageTexteFormValues) => Promise<void>;
};

export default function TemoignagesTexteForme({ initialData, onSubmit }: Props) {

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    onSubmit: internalSubmit,
    formState,
    setValue
  } = useTemoignageTexteForm(initialData);

  // Initialisation des previews à partir des données existantes
  useEffect(() => {

    if (initialData?.photo?.url) setPhotoPreview(initialData.photo.url);
  }, [initialData]);

  // Nettoyage des URL.createObjectURL
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);


  function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setValue("photo", file);
    }
  }

  const submitHandler = handleSubmit(async (data) => {
    if (onSubmit) await onSubmit(data);
    else await internalSubmit(data);
  });

  return (
    <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 🔹 Colonne principale */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations du témoignage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <input
                {...register("name", { required: true })}
                className="w-full border p-2 rounded"
                placeholder="Nom du témoin"
              />
            </div>


            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                {...register("description", { required: true })}
                className="w-full border p-2 rounded"
                rows={5}
                placeholder="Texte du témoignage..."
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Pays</label>
              <input
                {...register("pays", { required: true })}
                className="w-full border p-2 rounded"
                placeholder="Pays du témoin"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 Sidebar */}
      <div className="space-y-6">


        <Card>
          <CardHeader>
            <CardTitle>Catégorie du temoignage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div>
              <label className="block font-semibold mb-1">Catégorie</label>
              <input
                {...register("category", { required: true })}
                className="w-full border p-2 rounded"
                placeholder="Catégorie (ex : Client, Partenaire, Étudiant...)"
              />
            </div>
          </CardContent>
        </Card>



        <Card>
          <CardHeader>
            <CardTitle>Couverture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block font-semibold mb-1">La photo Témoin</label>
            <input type="file" accept="image/*" onChange={handlePhotoFileChange} className="w-full" />
            {photoPreview && (
              <Image
                src={photoPreview}
                alt="Aperçu de la photo"
                className="mb-2 max-h-48 object-cover"
                width={300}
                height={300}
              />
            )}
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {formState.isSubmitting ? "Enregistrement..." : "💾 Enregistrer"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
