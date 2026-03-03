import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex justify-between items-center mb-4 ${className}`.trim()}>
      <div>
        <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm font-medium mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
