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
    throw new Error(`User already exists`);
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

  await signIn("credentials", {
    email,
    password,
    redirect: true,
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
  await signIn("credentials", {
    email,
    password,
    redirect: true,
  });
};
