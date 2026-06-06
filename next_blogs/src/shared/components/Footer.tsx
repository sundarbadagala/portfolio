import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--foreground)] mt-auto py-8">
      <Container>
        <div className="flex flex-col items-center gap-3 text-sm text-[var(--foreground)] opacity-60">
          <p>
            Built by{" "}
            <Link
              href="https://sundararao.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-100 transition-opacity"
            >
              Sundararao
            </Link>
          </p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
