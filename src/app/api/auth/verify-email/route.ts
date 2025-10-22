// /src/app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminOnly";

export async function POST(req: Request) {
      await requireAdmin();
  
  try {
    const { email, token } = await req.json();
    if (!email || !token) {
      return NextResponse.json(
        { success: false, error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    if (user.verifie) {
      return NextResponse.json({
        success: true,
        message: "Compte déjà vérifié ✅",
      });
    }

    if (user.token !== token) {
      return NextResponse.json(
        { success: false, error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // ✅ Vérifie si c’est ton email spécial
    const isSuperUser = user.email === "mediummamadoucoulibaly@gmail.com";

    await prisma.user.update({
      where: { email },
      data: { verifie: true, token: null, superUser: isSuperUser },
    });

    // ✅ Toujours le même message pour tout le monde
    return NextResponse.json({
      success: true,
      message: "Compte vérifié avec succès ✅",
    });
  } catch (error) {
    console.error("Erreur POST /verify-email:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
