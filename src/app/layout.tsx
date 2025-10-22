import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import SessionWrappers from "@/lib/sessionWrappers";



// Définition des fonts
const playfair = Playfair_Display({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL_SITE_BASE || "https://medium-mamadou-coulibaly.com/"),
  title: "Medium Marabout Mamadou Coulibaly ",
  description: "Puissant medium marabout medium mamadou coulibaly, spécialiste en amour, protection, réussite et rituels puissants. Solutions rapides et efficaces à vos problèmes spirituels et personnels.",
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_CONSOLE || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <SessionWrappers>
    <html lang="fr">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-x-hidden`}
      >

        <div className="absolute inset-0 overflow-hidden" id="stars-container"></div>

        {children}
      </body>
    </html>
    </SessionWrappers>
  );
}
