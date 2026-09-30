import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { UserProfileDetail } from "@/components/profile/user-profile-detail";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Profile | LovethDev",
  description: "View a LovethDev community profile.",
};

export default async function UserDetailPage({ params }: PageProps) {
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

  const { id } = await params;

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden pt-24 pb-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
          <div className="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[110px]" />
        </div>
        <div className="container-narrow relative z-10 px-4 sm:px-6 lg:px-8">
          <UserProfileDetail userId={id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
