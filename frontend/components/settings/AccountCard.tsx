import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface SettingsAccount {
  name: string;
  email: string;
  role: string;
  photoUrl: string | null;
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";
}

export default function AccountCard({ account }: { account: SettingsAccount }) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><UserRound className="size-5" /></div>
        <CardTitle className="mt-3 text-xl">Account</CardTitle>
        <CardDescription>Your PathWise AI identity and profile details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border bg-muted/40 p-4">
          <Avatar className="size-14"><AvatarImage src={account.photoUrl ?? undefined} alt="Profile photo" /><AvatarFallback className="bg-primary text-base font-semibold text-primary-foreground">{initials(account.name)}</AvatarFallback></Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold text-card-foreground">{account.name}</p>
            <p className="truncate text-sm text-muted-foreground">{account.email}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><BriefcaseBusiness className="size-3.5" />{account.role}</p>
          </div>
        </div>
        <Button asChild variant="outline" className="w-full justify-between"><Link href="/dashboard/profile">Go to Profile <ArrowUpRight className="size-4" /></Link></Button>
      </CardContent>
    </Card>
  );
}
