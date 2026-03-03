interface Court {
  id: number;
  name: string;
  location: string;
  description?: string;
  price_per_hour: number;
  is_active: boolean;
}

interface CourtCardProps {
  court: Court;
  onViewAvailability: (court: Court) => void;
}

export function CourtCard({ court, onViewAvailability }: CourtCardProps) {
  return (
    <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-6 flex flex-col">
      <div className="h-28 bg-slate-100 flex items-center justify-center rounded-2xl mb-2 text-5xl">
        🏟️
      </div>
      <h3 className="font-black text-xl text-slate-800">{court.name}</h3>
      <p className="cursor-pointer text-sm text-slate-500 mb-4">📍 {court.location}</p>
      <button
        className="cursor-pointer mt-auto w-full bg-slate-900 hover:bg-green-600 text-white font-black rounded-2xl transition-all py-3 px-4"
        onClick={() => onViewAvailability(court)}
      >
        VER DISPONIBILIDAD
      </button>
    </div>
  );
}
