import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, CredentialsSignin } from "next-auth";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { NextAuthConfig } from "next-auth";
 
declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

declare module "next-auth" {
  interface Session {
    token: {
      id: string
    }
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

class InvalidLoginError extends CredentialsSignin {
  code = "Please use the original sign-up method"
}

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


export default { 
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        pasword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        const user = query[0];

        if (!user) {
          return null;
        } else if (!user.password) {
          // User exists, but no password, maybe by OAuth
          throw new InvalidLoginError();
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.password,
        );

        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }), 
    GitHub, Google],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id as string
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
} satisfies NextAuthConfig