import NextAuth, { SessionStrategy } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
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
    callbacks: {
      async signIn({ user, account, profile }: any) {
        try {
          const userCount = await prisma.user.count();

          if (userCount >= 420) {
            throw new Error("UserLimitExceeded");
          }

          await prisma.user.upsert({
            where: { username: user.username },
            update: {
              image: user.image,
            },
            create: {
              twitterId: user.id,
              username: user.username,
              image: user.image,
            },
          });
          return true; // Sign-in successful
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
          if (errorMessage === "UserLimitExceeded") {
            throw new Error("User limit reached. Sign up is closed.");
          }
          console.error("SignIn error:", errorMessage);
          throw new Error("An unexpected error occurred. Please try again.");
        }
      },
    },
    async session({ session, token }: any) {
      if (token) {
        const user = await prisma.user.findFirst({
          where: {
            twitterId: token.sub,
          },
        });
        session.user.id = user?.id;
        session.user.twitterId = token.sub;
        session.user.username = token.username;
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
