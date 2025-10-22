"use client";

import { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArticleContent, ArticleDTO, Section } from "../../../../types/articles-type";
import { articleFormSchema, ArticleFormValues } from "@/lib/Schemas/articleSchema";
import { slugify } from "@/lib/slugify";


// Types auxiliaires
export type Sec = {
  subtitle: string;
  text: string;
  image?: { url: string; filepath: string } | File | null;
};

// Valeurs par défaut
function getDefaultValues(initialData?: ArticleDTO): ArticleFormValues {
  return {
    id: initialData?.id,
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    metaTitre: initialData?.metaTitre ?? "",
    metaDescription: initialData?.metaDescription ?? "",
    conclusion: initialData?.conclusion ?? "",
    coverImage: initialData?.coverImage ?? null,
    content: {
      sections:
        initialData?.content?.sections?.map((s) => ({
          subtitle: s.subtitle ?? "",
          text: s.text ?? "",
          image: s.image ?? null,
        })) ?? [],
    },
    categoryId: initialData?.categoryId ?? "",
    tags: initialData?.tags ?? [],
    published: initialData?.published ?? false,
    publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt) : null,
  };
}


// Hook principal
export function useArticleForm(initialData?: ArticleDTO) {
  // ✅ Cast unique pour corriger l'erreur de compatibilité
  const resolver = zodResolver(
    articleFormSchema
  ) as unknown as Resolver<ArticleFormValues>;

  const form = useForm<ArticleFormValues>({
    resolver,
    defaultValues: getDefaultValues(initialData),
  });

  const { watch, setValue, reset, control, formState } = form;

  // Auto-slug
  const title = watch("title");
  const slug = watch("slug");

  useEffect(() => {
    if (title && (!slug || slug === slugify(title))) {
      setValue("slug", slugify(title), { shouldValidate: true });
    }
  }, [title, slug, setValue]);

  // Reset si initialData change
  useEffect(() => {
    if (initialData) reset(getDefaultValues(initialData));
  }, [initialData, reset]);

  // Sections dynamiques
  const sections = useFieldArray({ control, name: "content.sections" });

  // Soumission
  const onSubmit: SubmitHandler<ArticleFormValues> = async (data) => {
    const formData = new FormData();

    formData.append("slug", data.slug);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("metaTitre", data.metaTitre);
    formData.append("metaDescription", data.metaDescription);
    formData.append("conclusion", data.conclusion);
    formData.append("categoryId", String(data.categoryId));
    formData.append("published", String(data.published));
    if (data.publishedAt) formData.append("publishedAt", data.publishedAt.toISOString());

    // Image de couverture
    if (data.coverImage instanceof File) {
      formData.append("coverImage", data.coverImage);
    } else if (data.coverImage && typeof data.coverImage === "object") {
      formData.append("coverImage", JSON.stringify(data.coverImage));
    }


    const content: ArticleContent = { sections: [] };
    for (const section of data.content.sections) {
      const sec: Section = { subtitle: section.subtitle, text: section.text, image: null };

      if (section.image instanceof File) {
        formData.append("sectionImages", section.image);
        sec.image = { url: null, publicId: section.image.name };
      } else if (section.image && typeof section.image === "object") {
        sec.image = section.image;
      }

      content.sections.push(sec);
    }

    formData.append("content", JSON.stringify(content));

    return formData;
  };


  return { ...form, sections, onSubmit, formState };
}