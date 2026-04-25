import { getRandomColor } from "../utils";

function NeuroTag({ children }: { children: string }) {
  const color = getRandomColor();

  return (
    <button
      className="text-black py-1 px-2 rounded-lg text-sm"
      style={{ backgroundColor: color }}
    >
      #{children}
    </button>
  );
}

export default NeuroTag;
