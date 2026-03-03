interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  overlayClassName?: string;
  contentClassName?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  verticalActions?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  cancelText = "Cancelar",
  onCancel,
  onConfirm,
  isSubmitting = false,
  overlayClassName = "fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm",
  contentClassName = "bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl",
  confirmButtonClassName = "bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[10px]",
  cancelButtonClassName = "bg-slate-100 py-4 rounded-2xl font-black uppercase text-[10px]",
  verticalActions = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={overlayClassName}>
      <div className={contentClassName}>
        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">{title}</h2>
        {description && <p className="text-slate-400 font-bold text-sm mb-8 uppercase tracking-tighter">{description}</p>}
        <div className={verticalActions ? "space-y-3" : "grid grid-cols-2 gap-4"}>
          <button
            onClick={onCancel}
            className={`cursor-pointer ${cancelButtonClassName}`}
          >
            {cancelText}
          </button>
          <button onClick={onConfirm} disabled={isSubmitting} className={`cursor-pointer ${confirmButtonClassName}`}>
            {isSubmitting ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
