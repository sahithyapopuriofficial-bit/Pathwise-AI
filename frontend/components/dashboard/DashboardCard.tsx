import { ReactNode } from "react";
interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
}
export default function DashboardCard({
  title,
  description,
  icon,
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          {icon}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {title}
          </h3>

          <p className="text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}

