import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { UsersDirectory } from "@/components/profile/users-directory";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community | LovethDev",
  description: "Explore LovethDev members and profiles.",
};

export default async function UsersPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login?next=/users");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/users");
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden pt-24 pb-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[110px]" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
        </div>

        <div className="container-narrow relative z-10 px-4 sm:px-6 lg:px-8">
          <header className="mb-10 max-w-2xl">
            <h1 className="section-title">Community</h1>
            <p className="section-subtitle">
              Explore LovethDev members and profiles.
            </p>
          </header>
          <UsersDirectory />
        </div>
      </main>
      <Footer />
    </>
  );
}
