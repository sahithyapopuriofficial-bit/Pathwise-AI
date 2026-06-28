"use client";

import { Button } from "@/components/ui/button";

export default function OAuthButtons() {
  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
      >
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
      >
        Continue with GitHub
      </Button>
    </div>
  );
}