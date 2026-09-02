"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import Container from "@/shared/components/Container";
import { FaCircleNotch, FaLock } from "react-icons/fa";

export default function ProtectedAILayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      const redirectPath = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "?redirect=/ai/chat";
      router.replace(`/auth${redirectPath}`);
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <Container className="px-4 py-24 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center justify-center p-8 bg-[var(--background)] border border-[var(--foreground)] rounded-2xl shadow-xl max-w-sm w-full text-center">
          <div className="relative mb-4">
            <FaCircleNotch className="animate-spin text-4xl text-[var(--foreground)] opacity-75" />
            <FaLock className="absolute inset-0 m-auto text-xs text-[var(--foreground)] opacity-50" />
          </div>
          <h3 className="text-base font-semibold mb-1">Authenticating</h3>
          <p className="text-xs opacity-60">Checking your access to AI features...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
