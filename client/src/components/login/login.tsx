"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Chrome, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginCard() {
  const { signInWithGoogle, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();

    if (error) {
      setMessage(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleEmailPasswordSignUp = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const redirectUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/auth/callback'
        : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Check your email for the verification link!");
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    }

    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Welcome to Cortek Portal</CardTitle>
          <Link  href="/signup">
            <Button className="hover:cursor-pointer" variant="link">Sign up</Button>
          </Link>
        </div>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailPasswordSignUp)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loggin in to account...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Login to Account
                </>
              )}
            </Button>
          </form>
        </Form>

        {message && (
          <div
            className={`text-sm text-center p-3 rounded-md mt-4 ${
              message.includes("Error")
                ? "text-red-600 bg-red-50 dark:bg-red-950/20"
                : "text-green-600 bg-green-50 dark:bg-green-950/20"
            }`}
          >
            {message}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
