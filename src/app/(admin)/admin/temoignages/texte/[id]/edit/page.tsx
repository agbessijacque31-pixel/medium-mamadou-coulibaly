import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { mapTemoignageTexte } from "../../../../../../../../types/articles-type";
import EditTemoignageTextePage from "@/components/Admin/Temoignages/Textes/EditTemoignageTextePage";

type Props = {
  params: Promise<{ id: string }>; // ✅ Next.js 15: params est une Promise
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const temoignageId = Number(id);

  // 🔹 Récupération du témoignage texte
  const temoignage = await prisma.temoignagesTexte.findUnique({
    where: { id: temoignageId },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      pays: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },

  });

  if (!temoignage) return notFound();

  // 🔹 Transformation via ton mapper (à définir dans `articles-type.ts`)
  const dto = mapTemoignageTexte(temoignage);

  return <EditTemoignageTextePage temoignage={dto} />;
}
