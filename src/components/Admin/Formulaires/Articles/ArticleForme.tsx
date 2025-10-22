"use client";

import { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useArticleForm } from "../useArticleForm";
import { ArticleDTO } from "../../../../../types/articles-type";
import { ArticleFormValues } from "@/lib/Schemas/articleSchema";
import Image from "next/image";

type Category = { id: number; name: string };

type Props = {
  initialData?: ArticleDTO;
  categories?: Category[];
  onSubmit?: (data: ArticleFormValues) => Promise<void>;
};

export default function ArticleForm({ initialData, categories = [], onSubmit }: Props) {
  const { register, watch, setValue, sections, onSubmit: internalSubmit, handleSubmit, formState } =
    useArticleForm(initialData);

  const values = watch();

  // -----------------------
  // Cover preview
  // -----------------------
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData?.coverImage?.url) {
      setCoverPreview(initialData.coverImage.url);
    }
  }, [initialData]);

  function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setValue("coverImage", file);
    }
  }

  // -----------------------
  // Section previews
  // -----------------------
  const [sectionPreviews, setSectionPreviews] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (initialData?.content?.sections?.length) {
      const previews = initialData.content.sections.map(
        (s) => s.image?.url || null
      );
      setSectionPreviews(previews);
    }
  }, [initialData]);

  // Synchroniser sectionPreviews avec le nombre de sections
  useEffect(() => {
    const currentLength = sections.fields.length;
    if (sectionPreviews.length < currentLength) {
      setSectionPreviews((prev) => [...prev, ...Array(currentLength - prev.length).fill(null)]);
    } else if (sectionPreviews.length > currentLength) {
      setSectionPreviews((prev) => prev.slice(0, currentLength));
    }
  }, [sections.fields.length, sectionPreviews]);

  function handleSectionFileChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviews = [...sectionPreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setSectionPreviews(newPreviews);
      setValue(`content.sections.${index}.image`, file);
    }
  }

  // -----------------------
  // Tags management
  // -----------------------
  const handleAddTag = (tag: string) => {
    if (!tag) return;

    // Nettoyage du tag : trim + minuscule
    const cleanedTag = tag.trim().toLowerCase();

    // Vérifie si un tag équivalent existe déjà
    const exists = values.tags.some(
      (t) => t.trim().toLowerCase() === cleanedTag
    );

    if (!exists) {
      setValue("tags", [...values.tags, tag.trim()]);
    }
  };


  const handleRemoveTag = (tag: string) => {
    setValue("tags", values.tags.filter((t) => t !== tag));
  };

  // -----------------------
  // Soumission
  // -----------------------
  const submitHandler = handleSubmit(async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      await internalSubmit(data);
    }
  });

  // -----------------------
  // Rendu
  // -----------------------
  return (
    <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne principale */}
      <div className="lg:col-span-2 space-y-6">
        {/* Général */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Titre" {...register("title")} />
            <Input placeholder="Slug" {...register("slug")} />
            <Textarea placeholder="Description" {...register("description")} />
            <Input placeholder="Meta Titre" {...register("metaTitre")} />
            <Textarea placeholder="Meta Description" {...register("metaDescription")} />
          </CardContent>
        </Card>


        {/* Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Contenu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md space-y-3">
                <Input
                  placeholder="Titre de section"
                  {...register(`content.sections.${index}.subtitle` as const)}
                />
                <Textarea
                  placeholder="Texte de la section"
                  {...register(`content.sections.${index}.text` as const)}
                />
                {sectionPreviews[index] && (
                  <Image
                    src={sectionPreviews[index]!}
                    alt="Section preview"
                    className="mb-2 max-h-48 object-cover"
                    width={300}
                    height={300}
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSectionFileChange(e, index)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => sections.remove(index)}
                >
                  Supprimer section
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                sections.append({
                  subtitle: "",
                  text: "",
                  image: { url: null, publicId: null },
                })
              }
            >
              ➕ Ajouter une section
            </Button>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card>
          <CardHeader>
            <CardTitle>Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Conclusion" {...register("conclusion")} />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={String(values.categoryId)}
              onValueChange={(val) => setValue("categoryId", Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>


        {/* Image de couverture */}
        <Card>
          <CardHeader>
            <CardTitle>Image de couverture</CardTitle>
          </CardHeader>
          <CardContent>
            {coverPreview && (
              <Image
                src={coverPreview}
                alt="Cover preview"
                className="mb-2 max-h-48 object-cover"
                width={300}
                height={300}
              />
            )}
            <Input type="file" accept="image/*" onChange={handleCoverFileChange} />
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Mots-clés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Ajouter un ou plusieurs tags (séparés par virgule)"
                onKeyDown={(e) => {
                  const input = e.currentTarget;
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    input.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .forEach(handleAddTag);
                    input.value = "";
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {values.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ✕
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Publication */}
        <Card>
          <CardHeader>
            <CardTitle>Publication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={
                values.published
                  ? "published"
                  : values.publishedAt
                    ? "scheduled"
                    : "draft"
              }
              onValueChange={(val) => {
                if (val === "published") {
                  setValue("published", true);
                  setValue("publishedAt", new Date());
                } else if (val === "scheduled") {
                  setValue("published", false);
                  setValue("publishedAt", values.publishedAt ?? new Date());
                } else {
                  setValue("published", false);
                  setValue("publishedAt", null);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">📝 Brouillon</SelectItem>
                <SelectItem value="published">✅ Publier maintenant</SelectItem>
                <SelectItem value="scheduled">⏰ Planifier une date</SelectItem>
              </SelectContent>
            </Select>

            {!values.published && values.publishedAt && (
              <Input
                type="datetime-local"
                value={values.publishedAt?.toISOString().slice(0, 16)}
                onChange={(e) => setValue("publishedAt", new Date(e.target.value))}
              />
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={formState.isSubmitting} className="w-full">
          {formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>

  );
}
