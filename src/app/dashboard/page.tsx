import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | LovethDev",
  description: "Your LovethDev account dashboard.",
};

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login?next=/dashboard");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden pt-24 pb-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
          <div className="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[110px]" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
        </div>
        <div className="relative z-10">
          <DashboardContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
