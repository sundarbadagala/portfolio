import React, { ReactNode } from "react";

function Wrapper({ children }: { children: ReactNode }) {
  return <main className="min-h-screen mt-4">{children}</main>;
}

export default Wrapper;
