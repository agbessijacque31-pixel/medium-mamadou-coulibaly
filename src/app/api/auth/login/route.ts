import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminOnly";

export async function POST(req: Request) {
      await requireAdmin();
  
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 401 });
    }

    // Vérifie que l'email a été confirmé
    if (!user.verifie) {
      return NextResponse.json({ error: "Veuillez confirmer votre email avant de vous connecter." }, { status: 403 });
    }

const isValid = await bcrypt.compare(password, user.password);
if (!isValid) {
  return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
}

if (!user.superUser) {
  return NextResponse.json(
    { error: "Vous n'êtes pas l'administrateur, veuillez contacter un administrateur" },
    { status: 403 }
  );
}


    return NextResponse.json({
      message: "Connexion réussie",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
