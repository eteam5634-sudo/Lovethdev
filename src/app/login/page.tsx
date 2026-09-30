import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | LovethDev",
  description: "Sign in to your LovethDev account.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-400">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
