import { ReactNode } from "react";

export default function Card({
  title,
  icon,
  label,
  value,
  children,
  action,
}: {
  title?: string;
  icon?: ReactNode;
  label?: string;
  value?: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-2xl bg-white p-4 shadow dark:bg-zinc-900">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {action}
        </div>
      )}

      {icon && value && (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-2 text-orange-500">{icon}</div>
          <div className="text-lg font-bold">{value}</div>
          <div className="text-muted-foreground text-sm">{label}</div>
        </div>
      )}

      {children}
    </div>
  );
}
