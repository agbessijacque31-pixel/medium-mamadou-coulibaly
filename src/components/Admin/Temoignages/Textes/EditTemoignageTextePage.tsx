"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TemoignagesTexteForme from "./TemoignagesTexteForme";
import { TexteTemoignageDTO } from "../../../../../types/articles-type";
import { TemoignageTexteFormValues } from "@/lib/Schemas/articleSchema";
type Props = {
  temoignage: TexteTemoignageDTO;
};

export default function EditTemoignageTextePage({ temoignage }: Props) {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Modifier le témoignage : {temoignage.name}
      </h1>

      <TemoignagesTexteForme
        initialData={temoignage}
        onSubmit={async (data: TemoignageTexteFormValues) => {
          try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("category", data.category);
            formData.append("description", data.description ?? "");
            formData.append("pays", data.pays);

            // --- Photo du témoignage ---
            if (data.photo instanceof File) {
              formData.append("photo", data.photo);
            } else if (data.photo && typeof data.photo === "object") {
              formData.append("photo", JSON.stringify(data.photo));
            }

            // --- Requête PUT ---
            const res = await fetch(`/api/admin/temoignages/texte/${temoignage.id}`, {
              method: "PUT",
              body: formData,
            });

            if (!res.ok) {
              const err = await res.json().catch(() => null);
              throw new Error(err?.message || "Erreur lors de la mise à jour");
            }

            toast.success("✅ Témoignage mis à jour avec succès !");
            router.push("/admin/temoignages/texte");
            router.refresh();
          } catch (err) {
            console.error("❌ Erreur mise à jour témoignage :", err);
            const message = err instanceof Error ? err.message : "Erreur inconnue";
            toast.error(message);
          }
        }}
      />
    </div>
  );
}
