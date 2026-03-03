interface DurationSelectorProps {
  value: number;
  options?: number[];
  onChange: (value: number) => void;
  containerClassName?: string;
  buttonClassName?: (option: number, isActive: boolean) => string;
  renderLabel?: (option: number) => string;
}

export function DurationSelector({
  value,
  options = [1, 2],
  onChange,
  containerClassName = "flex gap-2",
  buttonClassName,
  renderLabel,
}: DurationSelectorProps) {
  return (
    <div className={containerClassName}>
      {options.map((option) => {
        const isActive = value === option;
        const defaultClass = `flex-1 py-3 rounded-xl font-bold border ${
          isActive ? "bg-blue-600 text-white" : "bg-white text-slate-500"
        }`;

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={buttonClassName ? buttonClassName(option, isActive) : defaultClass}
          >
            {renderLabel
              ? renderLabel(option)
              : `${option} ${option === 1 ? "Hora" : "Horas"}`}
          </button>
        );
      })}
    </div>
  );
}
