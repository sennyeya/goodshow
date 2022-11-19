import NextAuth, { User, type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      console.log(session, user)
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development',
  providers: [
    SpotifyProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!
    })
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
