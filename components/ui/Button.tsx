interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export const Button = ({
  children,
  isLoading,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const bgColors =
    variant === "primary"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-gray-800 hover:bg-gray-900";

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all disabled:opacity-50 flex justify-center items-center ${bgColors}`}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
