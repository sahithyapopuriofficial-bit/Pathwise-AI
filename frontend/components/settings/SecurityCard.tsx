"use client";

import { useMemo, useState } from "react";
import { KeyRound, Loader2, LogOut, ShieldAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function SecurityCard() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleChangePassword() {
    if (password.length < 8) { toast.error("Use at least 8 characters for your new password."); return; }
    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSavingPassword(false);
    if (error) { toast.error(error.message); return; }
    setPassword(""); setPasswordDialogOpen(false); toast.success("Your password has been updated.");
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    setIsLoggingOut(false);
    if (error) { toast.error(error.message); return; }
    router.replace("/login"); router.refresh();
  }

  return (
    <><Card className="rounded-2xl border-destructive/30 shadow-sm transition-shadow duration-300 hover:shadow-md"><CardHeader><div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive"><ShieldAlert className="size-5" /></div><CardTitle className="mt-3 text-xl">Security</CardTitle><CardDescription>Manage access to your PathWise AI account.</CardDescription></CardHeader><CardContent className="space-y-3"><SecurityRow icon={KeyRound} title="Change password" description="Choose a new password for your account." action={<Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>Change Password</Button>} /><SecurityRow icon={LogOut} title="Logout" description="End this session on this device." action={<Button variant="outline" disabled={isLoggingOut} onClick={handleLogout}>{isLoggingOut && <Loader2 className="animate-spin" />}{isLoggingOut ? "Logging out..." : "Logout"}</Button>} /><SecurityRow icon={Trash2} title="Delete account" description="Permanently delete your account and its data." danger action={<Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>Delete Account</Button>} /></CardContent></Card>
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}><DialogContent><DialogHeader><DialogTitle>Change password</DialogTitle><DialogDescription>Enter a new password with at least 8 characters.</DialogDescription></DialogHeader><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" aria-label="New password" /><DialogFooter showCloseButton><Button disabled={isSavingPassword} onClick={handleChangePassword}>{isSavingPassword && <Loader2 className="animate-spin" />}{isSavingPassword ? "Updating..." : "Update Password"}</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><DialogContent><DialogHeader><DialogTitle>Delete account?</DialogTitle><DialogDescription>This action requires a secure server-side deletion endpoint so your account data can be removed safely.</DialogDescription></DialogHeader><div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">Account deletion is not enabled yet. Contact support to request deletion.</div><DialogFooter showCloseButton><Button variant="destructive" disabled>Delete Account</Button></DialogFooter></DialogContent></Dialog></>
  );
}

function SecurityRow({ icon: Icon, title, description, action, danger = false }: { icon: typeof KeyRound; title: string; description: string; action: React.ReactNode; danger?: boolean }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl border p-4"><div className="flex min-w-0 items-center gap-3"><div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${danger ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}><Icon className="size-4" /></div><div><p className="font-medium">{title}</p><p className="text-sm text-muted-foreground">{description}</p></div></div>{action}</div>;
}
