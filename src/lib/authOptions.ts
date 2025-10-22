// src/lib/optionAuth.ts
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("Email ou mot de passe incorrect.");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Email ou mot de passe incorrect.");

        if (!user.verifie)
          throw new Error("Vous devez confirmer votre email avant de vous connecter.");

        if (!user.superUser)
          throw new Error(
            "Vous n'êtes pas l'administrateur, veuillez contacter un administrateur"
          );

        const customUser: User = {
          id: user.id.toString(),
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          superUser: user.superUser,
        };

        return customUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    updateAge: 24 * 60 * 60,   // 24h -> refresh du token
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 jours (s’aligne avec la session)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.superUser = (user as User).superUser;
      }
      return {
        ...token,
        superUser: token.superUser, // conserve toujours la valeur
      };
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.superUser = token.superUser as boolean;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};