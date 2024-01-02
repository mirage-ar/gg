import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const OPTIONS = {
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
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub; // Standard fields
        // Attach custom fields
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        // token.id = user.id;
        token.username = user.username; // Store custom fields in JWT
      }
      return token;
    },
  },
  pages: {
    signIn: "/api/auth/login",
    callback: "/",
    error: "/error",
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
