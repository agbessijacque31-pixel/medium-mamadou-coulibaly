"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

  const [sitemapCount, setSitemapCount] = useState<number | null>(null);
  const [stats, setStats] = useState<{
    articles: number;
    categories: number;
    tags: number;
    messages: number;
  } | null>(null);

  // Récupérer le count sitemap
  useEffect(() => {
    async function fetchSitemapCount() {
      try {
        const res = await fetch("/api/sitemap-count");
        const data = await res.json();
        setSitemapCount(data.count);
      } catch (err) {
        console.error("Erreur en récupérant le sitemap:", err);
      }
    }
    fetchSitemapCount();
  }, []);

  // Récupérer les stats DB
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard-stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Erreur en récupérant les stats:", err);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { id: "sitemap", title: "🗺️ Sitemap URLs", value: sitemapCount !== null ? `${sitemapCount} URLs` : "Chargement..." },
    { id: "messages", title: "📩 Messages reçus", value: stats ? `${stats.messages} nouveaux messages` : "Chargement..." },
    { id: "temoignages", title: "⭐ Témoignages", value: "8 publiés" }, // à rendre dynamique si tu crées un modèle Temoignage
    { id: "articles", title: "📝 Articles", value: stats ? `${stats.articles} en ligne` : "Chargement..." },
    { id: "analytics", title: "📊 Google Analytics", value: "3.2k visites ce mois" },
    { id: "search-console", title: "🔍 Google Search Console", value: "450 clics organiques" },
    { id: "tags", title: "🏷️ Tags", value: stats ? `${stats.tags} tags actifs` : "Chargement..." },
    { id: "categories", title: "📂 Catégories", value: stats ? `${stats.categories} catégories` : "Chargement..." },
    { id: "performance", title: "⚡ Performance", value: "Score moyen : 92%" },
  ];

  return (
    <main className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-6">
        Bienvenue <span className="text-yellow-400">{siteName}</span> ✨
      </h2>
      <p className="text-lg mb-8">
        Depuis cet espace, vous avez le contrôle total de votre site : gérez vos témoignages, vos articles, vos pages, vos
        consultations et vos messages. Utilisez le menu à gauche pour naviguer facilement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-indigo-900">{card.title}</h3>
            <p className="text-gray-600">{card.value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
