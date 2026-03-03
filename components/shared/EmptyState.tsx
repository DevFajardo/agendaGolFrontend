interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  containerClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 ${containerClassName}`.trim()}>
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-4xl">
        {icon}
      </div>
      <h2 className={`text-2xl font-black text-slate-900 uppercase italic mb-2 text-center ${titleClassName}`.trim()}>
        {title}
      </h2>
      {description && (
        <p
          className={`text-slate-400 font-bold uppercase tracking-tighter text-xs max-w-xs text-center leading-relaxed ${descriptionClassName}`.trim()}
        >
          {description}
        </p>
      )}
    </div>
  );
}
