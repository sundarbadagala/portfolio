import type { Metadata } from "next";
import AuthForm from "@/features/auth/components/AuthForm";
import { constructMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Account Sign In & Registration",
  description: "Sign in or create an account to access AI models, profile management, and personalized bookmarks.",
  canonical: "/auth",
  noIndex: true, // Market standard: protect auth/account forms from search indexing
});

export default function AuthPage() {
  return <AuthForm />;
}
