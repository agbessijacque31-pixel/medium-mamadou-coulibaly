"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { temoignageTexteFormSchema } from "@/lib/Schemas/articleSchema";

import { TexteTemoignageDTO } from "../../../../../types/articles-type";
import { TemoignageTexteFormValues } from "@/lib/Schemas/articleSchema";

/**
 * Valeurs par défaut du formulaire de témoignage texte
 */
function getDefaultValues(initialData?: TexteTemoignageDTO): TemoignageTexteFormValues {
  return {
    id: initialData?.id,
    name: initialData?.name ?? "",
    category: initialData?.category ?? "",
    description: initialData?.description ?? "",
    pays: initialData?.pays ?? "",
    photo: initialData?.photo ?? null,
  };
}

/**
 * Hook principal pour le formulaire de témoignage texte
 */
export function useTemoignageTexteForm(initialData?: TexteTemoignageDTO) {
  // ✅ Resolver basé sur ton schéma Zod
  const resolver = zodResolver(temoignageTexteFormSchema) as Resolver<TemoignageTexteFormValues>;


  const form = useForm<TemoignageTexteFormValues>({
    resolver,
    defaultValues: getDefaultValues(initialData),
  });

  const { reset, formState } = form;

  // 🔄 Reset si initialData change
  useEffect(() => {
    if (initialData) reset(getDefaultValues(initialData));
  }, [initialData, reset]);

  /**
   * Soumission du formulaire : construit un FormData à envoyer à ton endpoint
   */
  const onSubmit: SubmitHandler<TemoignageTexteFormValues> = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("pays", data.pays);

    // ✅ Gestion de l’image (photo)
    if (data.photo instanceof File) {
      formData.append("photo", data.photo);
    } else if (data.photo && typeof data.photo === "object") {
      formData.append("photo", JSON.stringify(data.photo));
    }

    return formData;
  };

  return { ...form, onSubmit, formState };
}
