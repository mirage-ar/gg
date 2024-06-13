import NextAuth, { SessionStrategy } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import * as Sentry from "@sentry/nextjs";
import { GAME_API } from "@/utils/constants";
import prisma from "@/utils/prisma";

const OPTIONS = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0", // opt-in to Twitter OAuth 2.0
      profile(profile: any) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          image: profile.data.profile_image_url.replace("_normal", ""),
          username: profile.data.username, // Custom field
        };
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }: any) {
      return baseUrl;
    },

    async signIn({ user, account, profile }: any) {
      try {
        const prismaUser = await prisma.user.findUnique({
          where: {
            twitterId: user.id,
          },
        });

        if (!prismaUser) {
          const response = await fetch(`${GAME_API}/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                id: user.id,
                username: user.username,
                image: user.image,
                // wallet: prismaUser.wallet,
              },
            }),
          });
          // throw new Error("NO PRISMA USER");
        }

        console.log("prismaUser", prismaUser);

        // CREATE GAME USER
        const response = await fetch(`${GAME_API}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              id: user.id,
              username: user.username,
              image: user.image,
              wallet: prismaUser?.wallet,
            },
          }),
        });

        // Fetch additional user details (e.g., wallet information)
        const result = await response.json();
        if (result.success === false) {
          throw new Error(result.error);
        }
        return true;
      } catch (error) {
        if (error instanceof Error) {
          Sentry.captureException(error);
        }

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        console.error("SignIn error:", errorMessage);

        throw new Error(errorMessage);
      }
    },

    async jwt({ token, user }: any) {
      if (user) {
        const response = await fetch(`${GAME_API}/user/${user.id}`);

        // Fetch additional user details (e.g., wallet information)
        const result = await response.json();
        const userDetails = result.data;

        token.id = user.id;
        token.username = user.username;
        token.wallet = userDetails.wallet;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.wallet = token.wallet; // Add wallet to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/api/auth/login",
    callback: "/",
    error: "/api/auth/error",
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
