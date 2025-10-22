"use client";

import { useRouter } from "next/navigation";
import { ArticleContent, ArticleDTO, ImageValue, Section } from "../../../../../types/articles-type";
import toast from "react-hot-toast";
import { ArticleFormValues } from "@/lib/Schemas/articleSchema";
import ArticleForme from "../../Formulaires/Articles/ArticleForme";

type Props = {
  categories: { id: number; name: string }[];
  article: ArticleDTO;
};

export default function EditArticlePage({ categories, article }: Props) {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Modifier l’article : {article.title}</h1>
      <ArticleForme
        categories={categories}
        initialData={article}
        onSubmit={async (data: ArticleFormValues) => {
          try {
            const formData = new FormData();
            formData.append("slug", data.slug);
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("metaTitre", data.metaTitre);
            formData.append("metaDescription", data.metaDescription);
            formData.append("conclusion", data.conclusion);
            formData.append("tags", JSON.stringify(data.tags));
            formData.append("categoryId", String(data.categoryId));
            formData.append("published", String(data.published));
            if (data.publishedAt) formData.append("publishedAt", data.publishedAt.toISOString());

            // Cover image
            if (data.coverImage instanceof File) {
              formData.append("coverImage", data.coverImage);
            } else if (data.coverImage && typeof data.coverImage === "object") {
              formData.append("coverImage", JSON.stringify(data.coverImage));
            }

            // Sections
            const content: ArticleContent = { sections: [] };

            for (const section of data.content.sections) {
              const sec: Section = {
                subtitle: section.subtitle,
                text: section.text,
                image: null, // initialisation obligatoire car ImageValue n'est pas optionnel
              };

              if (section.image instanceof File) {
                formData.append("sectionImages", section.image);
                sec.image = { url: null, publicId: section.image.name }; // ou adapter selon ton besoin
              } else if (section.image && typeof section.image === "object") {
                sec.image = section.image as ImageValue;
              }

              content.sections.push(sec);
            }

            formData.append("content", JSON.stringify(content));

            // Envoi à l'API
            const res = await fetch(`/api/admin/articles/${article.id}`, {
              method: "PUT",
              body: formData, // ✅ FormData directement
            });

            if (!res.ok) {
              const err = await res.json().catch(() => null);
              throw new Error(err?.message || "Erreur lors de la mise à jour");
            }

            toast.success("✅ Article mis à jour avec succès !");
            router.push("/admin/rituels");
            router.refresh();
          } catch (err) {
            console.error("❌ Erreur mise à jour article :", err);
            const message = err instanceof Error ? err.message : "Erreur inconnue";
            toast.error(message);
          }
        }}
      />
    </div>
  );
}
