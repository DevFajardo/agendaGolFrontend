interface StatusModalProps {
  isOpen?: boolean;
  show?: boolean;
  type: "success" | "error" | "info";
  message?: string;
  msg?: string;
  onClose: () => void;
}

export const StatusModal = ({
  isOpen,
  show,
  type,
  message,
  msg,
  onClose,
}: StatusModalProps) => {
  const open = typeof isOpen === "boolean" ? isOpen : Boolean(show);
  const text = message ?? msg ?? "";

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${type === "success" ? "bg-green-100" : "bg-red-100"}`}>
          {type === "success" ? (
            <span className="text-4xl">✅</span>
          ) : (
            <span className="text-4xl">❌</span>
          )}
        </div>
        <h3 className="text-xl font-black uppercase mb-2 italic">
          {type === "success" ? "¡Excelente!" : "Hubo un problema"}
        </h3>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">{text}</p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};