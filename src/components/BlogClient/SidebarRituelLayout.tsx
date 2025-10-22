// app/rituels/BlogLayout.tsx
import React from "react";
import { getArticles } from "@/lib/getArticles";
import prisma from "@/lib/prisma";
import { ArticleSidebarDTO } from "../../../types/articles-type";
import SidebarRituel from "./SidebarRetourAffectif";


export const revalidate = 120;

function getRandomItems<T>(arr: T[], n: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}


interface Props {
  tagspara?: { id: string; name: string; slug: string }[];
}

export default async function SidebarRituelLayout({ tagspara }: Props) {
  // 🔹 Récupération des articles via getArticles
  const articles = await getArticles();

  // 🔹 Récupération des catégories et tags
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, createdAt: true },
  });


  // Toujours avoir un tableau de tags
  let finalTags: { id: string; name: string; slug: string }[] = [];


  if (tagspara) {
    finalTags = tagspara;
  } else {
    const tagsFromDB = await prisma.tag.findMany({
      take: 20,
      select: { id: true, name: true, slug: true },
    });
    finalTags = getRandomItems(tagsFromDB, 10).map(tag => ({
      id: tag.id.toString(), // conversion number -> string
      name: tag.name,
      slug: tag.slug,
    }));


  }
  // 🔹 Préparer les articles pour la sidebar
  const sidebarArticles: ArticleSidebarDTO[] = articles.map((a) => ({
    title: a.title,
    slug: a.slug,
    coverImage: a.coverImage?.url
      ? {
        url: a.coverImage.url,
        publicId: a.coverImage.publicId ?? "",
      }
      : null,
  }));

  return (
    <SidebarRituel
      articles={sidebarArticles}
      categories={categories}
      tags={finalTags}
    />
  );
}
