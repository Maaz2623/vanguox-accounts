"use server";

import { signIn } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const register = async ({
  firstName,
  lastName,
  email,
  password,
  securityPin,
}: RegisterUser) => {
  const hashedPw = await hashPassword(password);
  const hashedSecurityPin = await hashPassword(securityPin);

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    throw new Error(`EMAIL_EXISTS`);
  }

  const [newUser] = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPw,
      securityPin: hashedSecurityPin,
    })
    .returning();

  await login({
    email: email,
    password: password,
  });

  return newUser;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // logic to verify if the user exists
  const [userExists] = await db
    .select()
    .from(users)
    .where(eq(users.email, email as string));

  if (!userExists) {
    // No user found, so this is their first attempt to login
    // Optionally, this is also the place you could do a user registration
    throw new Error("INVALID_EMAIL");
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    userExists.password
  );

  if (!isPasswordMatch) {
    throw new Error("INVALID_PASSWORD");
  }
  await signIn("credentials", {
    email,
    password,
    redirect: true,
  });
};
