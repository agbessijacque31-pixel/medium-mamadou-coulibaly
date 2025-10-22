import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { mapVideoTemoignage } from "../../../../../../../../types/articles-type";
import EditTemoignageVideoPage from "@/components/Admin/Temoignages/EditTemoignageVideoPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const temoignageId = Number(id);

  // Récupération du témoignage vidéo depuis Prisma
  const temoignage = await prisma.videoTemoignage.findUnique({
    where: { id: temoignageId },
    select: {
      id: true,
      title: true,
      description: true,
      transcript: true,
      videotemoi: true,
      webmtemoi: true,
      thumbnailtemoi: true,
      subtitlestemoi: true,
      createdat: true, // Prisma
      updatedat: true, // Prisma
    },
  });

  if (!temoignage) return notFound();

  // ⚡ Mapping camelCase et gestion des null pour les Dates
  const temoignageCamelCase = {
    ...temoignage,
    createdAt: temoignage.createdat ?? new Date(),
    updatedAt: temoignage.updatedat ?? new Date(),
  };

  // Transformation via ton mapper existant
  const dto = mapVideoTemoignage(temoignageCamelCase);

  return <EditTemoignageVideoPage temoignage={dto} />;
}
