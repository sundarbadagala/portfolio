import React from "react";

function NeuroCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 transition-all duration-150
        bg-[#ebe8e9] dark:bg-[#292829]
        shadow-[10px_10px_24px_#c9c7c8,-10px_-10px_24px_#ffffff]
        hover:shadow-[6px_6px_14px_#c9c7c8,-6px_-6px_14px_#ffffff]
        active:scale-[0.97] active:shadow-[inset_4px_4px_10px_#c9c7c8,inset_-4px_-4px_10px_#ffffff]
        dark:shadow-[10px_10px_24px_#1a1a1a,-10px_-10px_24px_#3d3d3d]
        dark:hover:shadow-[6px_6px_14px_#1a1a1a,-6px_-6px_14px_#3d3d3d]
        dark:active:shadow-[inset_4px_4px_10px_#1a1a1a,inset_-4px_-4px_10px_#3d3d3d]"
    >
      {children}
    </div>
  );
}

export default NeuroCard;
