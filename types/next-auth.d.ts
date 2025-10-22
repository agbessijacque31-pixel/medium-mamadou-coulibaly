// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    superUser: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      superUser: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    superUser?: boolean;
  }
}
