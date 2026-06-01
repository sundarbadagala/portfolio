import React from "react";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 transition-all duration-150
        bg-white dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-800
        shadow-sm hover:shadow-md"
    >
      {children}
    </div>
  );
}

export default Card;
