import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile Settings | LovethDev",
  description: "Manage your LovethDev profile.",
};

export default async function ProfileSettingsPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login?next=/profile");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden pt-24 pb-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
          <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
        </div>
        <div className="container-narrow relative z-10 px-4 sm:px-6 lg:px-8">
          <ProfileSettingsForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
