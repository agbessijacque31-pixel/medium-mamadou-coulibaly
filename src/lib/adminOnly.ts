// src/lib/auth-guard.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.superUser) {
    throw new Error("Accès refusé. Vous devez être administrateur pour effectuer cette action.");
  }

  return session;
}
