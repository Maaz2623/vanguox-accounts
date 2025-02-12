import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        domain: ".vanguox.com",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      },
    },
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const [userExists] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));
        const user = {
          id: userExists.id as string,
          name: `${userExists.firstName as string} ${
            userExists.lastName as string
          }`,
          email: userExists.email,
        };
        return user;
      },
    }),
  ],
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     // Redirect to the app on 3001 after successful login
  //     const redirectUrl = new URL(url).searchParams.get("redirect_url");
  //     if (redirectUrl) return redirectUrl;
  //     return baseUrl;
  //   },
  // },
});
