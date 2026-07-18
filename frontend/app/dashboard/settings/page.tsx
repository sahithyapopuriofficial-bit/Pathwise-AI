import { redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Toaster } from "@/components/ui/sonner";
import AccountCard, { type SettingsAccount } from "@/components/settings/AccountCard";
import ThemeCard from "@/components/settings/ThemeCard";
import NotificationCard from "@/components/settings/NotificationCard";
import SecurityCard from "@/components/settings/SecurityCard";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, profile_photo, target_role")
    .eq("user_id", user.id)
    .maybeSingle();

  const fullName = profile?.full_name ?? (typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : user.email?.split("@")[0] ?? "User");
  const account: SettingsAccount = {
    name: fullName,
    email: user.email ?? "",
    role: profile?.target_role ?? "PathWise member",
    photoUrl: profile?.profile_photo ?? null,
  };

  return (
    <DashboardLayout fullName={fullName}>
      <Toaster richColors />
      <div className="mx-auto max-w-6xl space-y-8 pb-8">
        <div className="max-w-2xl"><p className="text-sm font-semibold text-primary">Workspace preferences</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Settings</h1><p className="mt-3 text-muted-foreground">Manage your account, appearance, notifications, and security in one place.</p></div>
        <div className="grid gap-6 md:grid-cols-2"><AccountCard account={account} /><ThemeCard /><NotificationCard /><SecurityCard /></div>
      </div>
    </DashboardLayout>
  );
}
