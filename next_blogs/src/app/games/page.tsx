import type { Metadata } from "next";
import GamesStore from "@/features/games/components/GamesStore";
import { constructMetadata, getBreadcrumbSchema } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Retro Flash Games Arcade",
  description:
    "Play classic retro Flash arcade games directly in your browser with modern WebAssembly Ruffle emulation. No plugin installations required.",
  canonical: "/games",
  keywords: [
    "Retro Games",
    "Flash Games Online",
    "Ruffle Emulator Games",
    "Browser Arcade",
    "Classic Web Games",
    "Play Flash Games",
  ],
});

export default function GamesPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/blogs" },
    { name: "Retro Arcade Games", path: "/games" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GamesStore />
    </>
  );
}
