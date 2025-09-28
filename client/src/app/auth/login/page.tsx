import { LoginCard } from "@/components/login/login";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import React from "react";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <LoginCard />
    </div>
  );
}
