"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { login } from "@/actions/auth.actions";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.string().min(2).max(100).email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not exceed 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const LoginCard = () => {
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();

  const redirect_url = searchParams.get("redirect_url");
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await login({
        email: values.email,
        password: values.password,
      });
      toast.success(`Logged in successfully`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "NEXT_REDIRECT") {
          return;
        }
        if (error.message === "INVALID_EMAIL") {
          toast.error("User does not exist");
        }
        if (error.message === "INVALID_CREDENTIALS") {
          toast.error("Invalid credentials");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -100,
        }}
        className="md:w-[60%] sm:w-[75%] w-[90%] flex rounded-lg border overflow-hidden shadow-lg"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-5 py-4 w-full md:w-1/2"
          >
            <div className="w-full text-center mb-4 mt-4">
              <h1 className="text-2xl font-semibold">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">
                Login to your vanguox account
              </p>
            </div>
            <hr className="w-3/4 mx-auto" />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="password"
                      placeholder="shadcn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="py-1 ml-2 font-medium">
              <p className="text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/register?redirect_url=${
                    redirect_url && encodeURIComponent(redirect_url)
                  }`}
                  className="underline underline-offset-2"
                >
                  Sign up
                </Link>
              </p>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="w-1/2 border-l hidden md:flex justify-center items-center bg-lime-100">
          <Image
            src={`/next.svg`}
            width={100}
            height={100}
            alt="placeholder"
            className=""
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
