import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // logic to salt and hash password

        // logic to verify if the user exists
        const [userExists] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!userExists) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("invalidUser");
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password as string,
          userExists.password
        );

        if (!isPasswordMatch) {
          throw new Error(`invalidCredentials`);
        }

        const user = {
          id: userExists.id as string,
          name: `${userExists.firstName as string} ${
            userExists.lastName as string
          }`,
          email: userExists.email,
        };

        // return user object with their profile data
        return user;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to the app on 3001 after successful login
      const redirectUrl = new URL(url).searchParams.get("redirect_url");
      return redirectUrl ? redirectUrl : baseUrl;
    },
  },
});
