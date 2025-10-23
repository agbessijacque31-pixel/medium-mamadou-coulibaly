export async function GET() {
  const sitemapUrl = "https://www.medium-mamadou-coulibaly.com/sitemap.xml";
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  try {
    const res = await fetch(pingUrl);
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    return Response.json({ success: true, message: "Ping envoyé à Google avec succès." });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: (error as Error).message });
  }
}
