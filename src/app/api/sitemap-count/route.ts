import { requireAdmin } from "@/lib/adminOnly";
import { NextResponse } from "next/server";

export async function GET() {
    await requireAdmin();

  const siteUrl = process.env.NEXT_PUBLIC_URL_SITE_BASE;


  const sitemapUrl = `${siteUrl}sitemap.xml`;

  try {
    const res = await fetch(sitemapUrl);
    const text = await res.text();

    // Compter les balises <loc>
    const urlsCount = (text.match(/<loc>/g) || []).length;

    return NextResponse.json({ count: urlsCount });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
  }
}
