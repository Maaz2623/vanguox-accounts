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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { register } from "@/actions/auth.actions";
import { usePathname, useSearchParams } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
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

export const RegisterCard = () => {
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const redirect_url = searchParams.get("redirect_url");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityPin, setSecurityPin] = useState("");

  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (confirmPassword !== values.password) {
      toast.error("Passwords don't match");
      return;
    }
    if (securityPin === "" || securityPin.length < 4) {
      toast.error("Check the security pin");
    }
    try {
      setLoading(true);
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: confirmPassword,
        securityPin: securityPin,
      });
      toast.success("Registered successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "NEXT_REDIRECT") {
          console.log(error);
        }
        if (error.message === "EMAIL_EXISTS") {
          toast.error("User already exists");
        }
      } else {
        toast.error("An unknown error occured");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 1,
          y: -100,
        }}
        className="w-full max-w-3xl flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden border"
      >
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-6 space-y-5">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
            <p className="text-sm text-gray-500">
              Create your Vanguox account today
            </p>
          </div>

          <hr className="w-3/4 mx-auto border-gray-300" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="flex flex-col sm:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="John"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Fields */}
              <div className="flex flex-col sm:flex-row gap-4">
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
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    disabled={loading}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Security Pin */}
              <div className="w-full">
                <Label>Security Pin</Label>
                <InputOTP
                  maxLength={4}
                  className="mt-2"
                  disabled={loading}
                  onChange={(e) => setSecurityPin(e)}
                >
                  <InputOTPGroup className="">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Login Redirect */}
              <p className="text-sm text-gray-800 font-medium">
                Already have an account?{" "}
                <Link
                  href={`/sign-in?redirect_url=${
                    redirect_url && encodeURIComponent(redirect_url)
                  }`}
                  className="underline-offset-2 underline"
                >
                  Login
                </Link>
              </p>

              {/* Submit Button */}
              <Button
                className="w-full text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Right Section - Image */}
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-lime-100 to-lime-200">
          <Image src="/next.svg" width={120} height={120} alt="Vanguox Logo" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
