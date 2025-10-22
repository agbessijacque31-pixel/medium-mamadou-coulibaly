"use client";

import { useRouter } from "next/navigation";
import ArticleForme from "../../Formulaires/Articles/ArticleForme";
import toast from "react-hot-toast";
import { ArticleFormValues } from "@/lib/Schemas/articleSchema";
import { Section } from "../../../../../types/articles-type";

type Props = {
  categories: { id: number; name: string }[];
};

export default function CreateArticlePage({ categories }: Props) {
  const router = useRouter();
  console.debug("🔹 Render CreateArticlePage with categories:", categories);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Créer un nouvel article</h1>
      <ArticleForme
        categories={categories}
        onSubmit={async (data: ArticleFormValues) => {
          try {
            // Transforme ArticleFormValues en FormData
            const formData = new FormData();

            formData.append("slug", data.slug);

            formData.append("title", data.title);

            formData.append("description", data.description);

            formData.append("tags", JSON.stringify(data.tags));

            formData.append("metaTitre", data.metaTitre);

            formData.append("metaDescription", data.metaDescription);

            formData.append("conclusion", data.conclusion);

            formData.append("categoryId", String(data.categoryId));

            formData.append("published", String(data.published));

            if (data.publishedAt) {
              formData.append("publishedAt", data.publishedAt.toISOString());
            }

            // Cover image
            if (data.coverImage instanceof File) {
              formData.append("coverImage", data.coverImage);
            } else {
              console.debug("ℹ No coverImage to append");
            }

            // Sections
            const content = { sections: [] as Section[] };

            for (const [index, section] of data.content.sections.entries()) {
              const sec: Section = {
                subtitle: section.subtitle,
                text: section.text,
                image: null, // obligatoire selon ImageValue
              };

              if (section.image instanceof File) {
                formData.append("sectionImages", section.image);
                sec.image = { url: null, publicId: null }; // placeholder avant upload
              } else if (section.image && typeof section.image === "object") {
                sec.image = section.image;
              } else {
                console.debug(`ℹ No image for section #${index}`);
              }

              content.sections.push(sec);
            }

            formData.append("content", JSON.stringify(content));

            // Envoi à l'API
            const res = await fetch("/api/admin/articles", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              let err: unknown = null;

              try {
                const contentType = res.headers.get("content-type");
                if (contentType?.includes("application/json")) {
                  err = await res.json();
                } else {
                  err = await res.text();
                }
              } catch {
                err = null;
              }

              console.error("❌ API response not ok:", err);

              // Vérification stricte du type avant de créer l'Error
              if (typeof err === "string") {
                throw new Error(err);
              } else if (isErrorLike(err)) {
                throw new Error(err.message);
              } else {
                throw new Error("Erreur API");
              }

              // Type guard
              function isErrorLike(obj: unknown): obj is { message: string } {
                return (
                  typeof obj === "object" &&
                  obj !== null &&
                  "message" in obj &&
                  typeof (obj as { message: unknown }).message === "string"
                );
              }

            }



            toast.success("✅ Article créé avec succès !");
            router.push("/admin/rituels");
            router.refresh();
          } catch (err) {
            console.error("❌ Erreur création article :", err);
            const message = err instanceof Error ? err.message : "Erreur inconnue";
            toast.error(message);
          }
        }}
      />
    </div>
  );
}
