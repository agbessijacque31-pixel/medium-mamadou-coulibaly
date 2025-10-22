"use client";

import { useEffect, useState } from "react";
import { TexteTemoignageDTO } from "../../../../../../types/articles-type";
import TexteTemoignagesPage from "@/components/Admin/Temoignages/Textes/TexteTemoignagesPage";

export default function TexteTemoignagesAdminPage() {
  const [temoignages, setTemoignages] = useState<TexteTemoignageDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/temoignages/texte")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTemoignages(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;

  return <TexteTemoignagesPage temoignages={temoignages} />;
}
