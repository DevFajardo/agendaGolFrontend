interface PaginationControlsProps {
  page: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControls({ page, hasMore, onPrev, onNext }: PaginationControlsProps) {
  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button
        disabled={page === 1}
        onClick={onPrev}
        className="cursor-pointer px-6 py-3 bg-white border border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white disabled:opacity-30 transition-all shadow-md"
      >
        ← Anterior
      </button>
      <div className="bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-xs">PÁGINA {page}</div>
      <button
        disabled={!hasMore}
        onClick={onNext}
        className="cursor-pointer px-6 py-3 bg-white border border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white disabled:opacity-30 transition-all shadow-md"
      >
        Siguiente →
      </button>
    </div>
  );
}
