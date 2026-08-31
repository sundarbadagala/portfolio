import type { Metadata } from "next";
import GamePlayer from "@/features/games/components/GamePlayer";
import { GAMES_LIST } from "@/features/games/data";
import { constructMetadata, getGameSchema, getBreadcrumbSchema } from "@/shared/lib/seo";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const game = GAMES_LIST.find((g) => g.game_id === params.id);
  const title = game ? game.game_title : "Retro Arcade Game";
  const description = game
    ? `${game.description} Play ${game.game_title} free in browser.`
    : "Play classic retro Flash games in your browser with Ruffle emulation.";

  return constructMetadata({
    title: `${title} - Play Online`,
    description,
    canonical: `/games/${params.id}`,
    ogImage: `/assets/games/${params.id}.jpg`,
    keywords: game?.tags ? [...game.tags, "Flash Game", "Retro Game", "Arcade Online"] : ["Flash Game"],
  });
}

export default function GamePage({ params }: PageProps) {
  const game = GAMES_LIST.find((g) => g.game_id === params.id);

  const gameSchema = game ? getGameSchema(game) : null;
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/blogs" },
    { name: "Games", path: "/games" },
    { name: game ? game.game_title : "Game", path: `/games/${params.id}` },
  ]);

  return (
    <>
      {gameSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GamePlayer id={params.id} />
    </>
  );
}
