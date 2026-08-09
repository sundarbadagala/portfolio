import { getRandomColor } from "../utils";

function NeuroTag({
  children,
  isDisableAnimation = false,
  onClick,
  className = "text-sm",
}: {
  children: string;
  isDisableAnimation?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  const color = getRandomColor();

  return (
    <button
      onClick={onClick}
      className={`text-black bg-[var(--tag-color)] border border-transparent py-1 px-2 rounded-lg ${className}${!isDisableAnimation ? " transition-all duration-150 hover:!bg-transparent hover:border-[var(--tag-color)] hover:!text-[var(--tag-color)]" : ""}`}
      style={{ "--tag-color": color } as React.CSSProperties}
    >
      #{children}
    </button>
  );
}

export default NeuroTag;
