"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { updateProfile, type ProfileDetails, type ProfileFormValues } from "@/lib/actions/profile";

interface EditProfileDialogProps {
  profile: ProfileDetails | null;
}

function formValues(profile: ProfileDetails | null): ProfileFormValues {
  return {
    fullName: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    college: profile?.college ?? "",
    degree: profile?.degree ?? "",
    graduationYear: profile?.graduation_year?.toString() ?? "",
    location: profile?.location ?? "",
    targetRole: profile?.target_role ?? "",
    targetCompany: profile?.target_company ?? "",
    workMode: profile?.work_mode ?? "",
    experienceLevel: profile?.experience_level ?? "",
  };
}

export default function EditProfileDialog({ profile }: EditProfileDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(() => formValues(profile));
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof ProfileFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setValues(formValues(profile));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateProfile(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <Toaster richColors />
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild><Button>Edit Profile</Button></DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Keep your personal and career information up to date.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" id="fullName"><Input id="fullName" value={values.fullName} onChange={(event) => updateField("fullName", event.target.value)} /></Field>
            <Field label="Phone" id="phone"><Input id="phone" type="tel" value={values.phone} onChange={(event) => updateField("phone", event.target.value)} /></Field>
            <Field label="College" id="college"><Input id="college" value={values.college} onChange={(event) => updateField("college", event.target.value)} /></Field>
            <Field label="Degree" id="degree"><Input id="degree" value={values.degree} onChange={(event) => updateField("degree", event.target.value)} /></Field>
            <Field label="Graduation Year" id="graduationYear"><Input id="graduationYear" inputMode="numeric" value={values.graduationYear} onChange={(event) => updateField("graduationYear", event.target.value)} /></Field>
            <Field label="Location" id="location"><Input id="location" value={values.location} onChange={(event) => updateField("location", event.target.value)} /></Field>
            <Field label="Target Role" id="targetRole"><Input id="targetRole" value={values.targetRole} onChange={(event) => updateField("targetRole", event.target.value)} /></Field>
            <Field label="Target Company" id="targetCompany"><Input id="targetCompany" value={values.targetCompany} onChange={(event) => updateField("targetCompany", event.target.value)} /></Field>
            <Field label="Preferred Work Mode" id="workMode">
              <Select value={values.workMode} onValueChange={(value) => updateField("workMode", value)}><SelectTrigger id="workMode" className="w-full"><SelectValue placeholder="Select work mode" /></SelectTrigger><SelectContent><SelectItem value="On-site">On-site</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem><SelectItem value="Remote">Remote</SelectItem></SelectContent></Select>
            </Field>
            <Field label="Experience Level" id="experienceLevel">
              <Select value={values.experienceLevel} onValueChange={(value) => updateField("experienceLevel", value)}><SelectTrigger id="experienceLevel" className="w-full"><SelectValue placeholder="Select experience level" /></SelectTrigger><SelectContent><SelectItem value="Student">Student</SelectItem><SelectItem value="Entry level">Entry level</SelectItem><SelectItem value="Mid level">Mid level</SelectItem><SelectItem value="Senior level">Senior level</SelectItem></SelectContent></Select>
            </Field>
          </div>
          <DialogFooter><Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button></DialogFooter>
        </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
