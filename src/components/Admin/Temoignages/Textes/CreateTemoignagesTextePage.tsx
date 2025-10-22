"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TemoignagesTexteForme from "./TemoignagesTexteForme";
import { TemoignageTexteFormValues } from "@/lib/Schemas/articleSchema";


export default function CreateTemoignagesTextePage() {
    const router = useRouter();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Créer un nouveau témoignage texte</h1>

            <TemoignagesTexteForme
                onSubmit={async (data: TemoignageTexteFormValues) => {
                    try {
                        // 🔹 Création d’un FormData (même logique que les vidéos)
                        const formData = new FormData();

                        formData.append("name", data.name);
                        formData.append("category", data.category);
                        formData.append("description", data.description);
                        formData.append("pays", data.pays);
                        if (data.photo instanceof File) {
                            formData.append("photo", data.photo);
                        } else if (data.photo && typeof data.photo === "object" && "url" in data.photo) {
                            // Cas où tu veux conserver une photo existante (JSON)
                            formData.append("photo", JSON.stringify(data.photo));
                        } else {
                            // Rien à envoyer
                            formData.append("photo", "");
                        }


                        // 🔹 Envoi vers ton API Supabase / Next
                        const res = await fetch("/api/admin/temoignages/texte", {
                            method: "POST",
                            body: formData,
                        });

                        if (!res.ok) {
                            const text = await res.text();
                            console.error("❌ API error response text:", text);
                            let parsed;
                            try {
                                parsed = JSON.parse(text);
                            } catch {
                                parsed = { message: text || "Erreur API" };
                            }
                            throw new Error(parsed?.message ?? "Erreur API");
                        }

                        // 🔹 Succès
                        toast.success("✅ Témoignage texte créé avec succès !");
                        router.push("/admin/temoignages/texte");
                        router.refresh();
                    } catch (err) {
                        console.error("❌ Erreur création témoignage texte :", err);
                        const message = err instanceof Error ? err.message : "Erreur inconnue";
                        toast.error(message);
                    }
                }}
            />
        </div>
    );
}
