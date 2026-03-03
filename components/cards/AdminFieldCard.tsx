interface Field {
  id: number;
  name: string;
  location: string;
  description?: string;
  price_per_hour: number;
  capacity: number;
}

interface AdminFieldCardProps {
  field: Field;
  onEdit: (field: Field) => void;
  onDelete: (id: number) => void;
}

export function AdminFieldCard({ field, onEdit, onDelete }: AdminFieldCardProps) {
  return (
    <div className="bg-white p-6 rounded-[3rem] border border-slate-200 shadow-xl relative group overflow-hidden transition-all hover:shadow-2xl">
      <div className="absolute top-6 right-6 flex gap-2">
        <button
          onClick={() => onEdit(field)}
          className="cursor-pointer p-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all text-slate-400"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(field.id)}
          className="cursor-pointer p-3 bg-red-50 hover:bg-red-600 hover:text-white rounded-2xl transition-all text-red-400"
        >
          🗑️
        </button>
      </div>
      <span className="text-4xl block mb-4">🏟️</span>
      <h3 className="font-black text-slate-900 uppercase text-xl leading-tight">{field.name}</h3>
      <p className="text-slate-400 font-bold text-xs uppercase mt-1">📍 {field.location}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
        Descripción: {field.description || "Sin descripción"}
      </p>
      <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
        <p className="text-2xl font-black text-green-500">${field.price_per_hour}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cap: {field.capacity}</p>
      </div>
    </div>
  );
}
