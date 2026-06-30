import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface DashboardActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function DashboardActionButton({
  children,
  onClick,
}: DashboardActionButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="rounded-xl px-5 py-2 shadow-sm transition-all duration-300 hover:scale-105"
    >
      {children}
    </Button>
  );
}

