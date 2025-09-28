"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Chrome, Loader2, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

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
import { loginSchema, LoginForm } from "@/client-schema/auth-schema";
import { loginUser } from "@/api/auth/auth-api";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export function LoginCard() {
  const { loading } = useAuth();
  const { setUser } = useAuthStore();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      setUser(response.user);
      setMessage("Login successful!");
      router.push('/dashboard');
    },
    onError: (error: any) => {
      setMessage(`Error: ${error.message || "An unexpected error occurred"}`);
    },
  });

  const handleEmailPasswordLogin = (data: LoginForm) => {
    setMessage("");
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
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
        <CardTitle>Welcome to Cortek Portal</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailPasswordLogin)}
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute hover:cursor-pointer right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loginMutation.isPending} className="w-full hover:cursor-pointer">
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
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
    </Card>
  );
}
