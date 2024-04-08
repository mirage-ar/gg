import NextAuth, { SessionStrategy } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/utils/prisma";
import { API } from "@/utils/constants";

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
        // CREATE USER
        const response = await fetch(`${API}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { id: user.id, username: user.username, image: user.image } }),
        });
        const data = await response.json();

        console.log(data);

        return true; // Sign-in successful
      } catch (error) {
        // First, log the error to Sentry for detailed error reporting
        if (error instanceof Error) {
          Sentry.captureException(error);
        }

        // Then, log the error message to the server console for visibility
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        console.error("SignIn error:", errorMessage);

        // Decide on a user-friendly error message to throw
        if (errorMessage === "UserLimitExceeded") {
          throw new Error("User limit reached. Sign up is closed.");
        }

        // Throw a generic error for the user without exposing specific details
        throw new Error("An unexpected error occurred. Please try again.");
      }
    },

    async session({ session, token }: any) {
      if (token) {
        try {
          session.user.id = token.sub;
          session.user.username = token.username;
        } catch (error) {
          console.error("Session error:", error);
          throw new Error("An unexpected error occurred. Please try again.");
        }
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        // token.id = user.id;
        token.username = user?.username; // Store custom fields in JWT
      }
      return token;
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
