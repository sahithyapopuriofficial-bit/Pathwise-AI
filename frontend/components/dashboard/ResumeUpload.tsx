"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/client";
import { saveResume } from "@/lib/actions/resume";


export default function ResumeUpload() {
  const router = useRouter();

  const supabase = createClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleUpload() {
    setSuccessMessage("");
    setErrorMessage("");

    if (!file) {
      setErrorMessage("Please select a resume.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension !== "pdf" && extension !== "docx") {
      setErrorMessage("Only PDF and DOCX files are allowed.");
      return;
    }

    try {
  setUploading(true);

  // Check logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Current User:", user);

  const filePath = `${crypto.randomUUID()}-${file.name}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) {
    console.log("UPLOAD ERROR:", uploadError);
    console.log(JSON.stringify(uploadError, null, 2));

    setErrorMessage(uploadError.message);
    return;
  }

      // Save metadata to database
      const saveResult = await saveResume(
  file.name,
  filePath
);

if (!saveResult.success) {
  setErrorMessage(
    saveResult.message ?? "Failed to save resume."
  );
  return;
}

// Extract text from resume

// Send to AI Resume Analyzer
const formData = new FormData();

formData.append("file", file);

const response = await fetch("/api/resume/upload", {
  method: "POST",
  body: formData,
});

const result = await response.json();

if (!result.success) {
  setErrorMessage(
    result.message ?? "Resume analysis failed."
  );
  return;
}

setSuccessMessage(
  "Resume uploaded and analyzed successfully!"
);

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      setErrorMessage("Something went wrong.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">

      <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-8">

        <div className="text-center">

          <UploadCloud className="mx-auto h-14 w-14 text-blue-600" />

          <h2 className="mt-4 text-2xl font-bold">
            Upload Resume
          </h2>

          <p className="mt-2 text-slate-600">
            Upload your latest resume in PDF or DOCX format.
          </p>

        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="mt-6 w-full rounded-lg border bg-white p-3"
          onChange={(e) =>
            setFile(e.target.files?.[0] ?? null)
          }
        />

        {file && (
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-white p-4 shadow">

            <FileText className="h-6 w-6 text-blue-600" />

            <div>

              <p className="font-semibold">
                {file.name}
              </p>

              <p className="text-sm text-slate-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>

            </div>

          </div>
        )}

        <Button
          className="mt-6 w-full"
          disabled={uploading}
          onClick={handleUpload}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Resume
            </>
          )}
        </Button>

        {successMessage && (
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">

            <CheckCircle2 className="h-5 w-5" />

            <span>{successMessage}</span>

          </div>
        )}

        {errorMessage && (
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">

            <AlertCircle className="h-5 w-5" />

            <span>{errorMessage}</span>

          </div>
        )}

      </div>

    </div>
  );
}

