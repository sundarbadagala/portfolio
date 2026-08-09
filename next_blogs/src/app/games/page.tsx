import Container from "@/shared/components/Container";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const GAMES_LSIT = [
  {
    game_id: "avalance",
    game_title: "Avalance",
    thumbnail: "",
  },
  {
    game_id: "billy_and_mandy_spell_book",
    game_title: "Billy And Mandy Spell Book",
    thumbnail: "",
  },
  {
    game_id: "bullet_bill",
    game_title: "Bullet Bill",
    thumbnail: "",
  },
  {
    game_id: "charlie_the_duck",
    game_title: "Charlie The Duck",
    thumbnail: "",
  },
  {
    game_id: "crazy_nut",
    game_title: "Crazy Nut",
    thumbnail: "",
  },
];

function Page() {
  return (
    <main className="min-h-screen mt-4">
      <Container>
        <h1 className="text-2xl md:text-3xl pt-6 pb-4 font-bold">🎮 Retro Arcade</h1>
        <h6 className="text-lg md:text-xl opacity-80">
          Warning: These games🎮 have been scientifically🧪 proven to destroy🔥
          productivity🏭. Proceed at your own risk.😄
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-6">
          {GAMES_LSIT.map((game) => (
            <Link
              key={game.game_id}
              href={`/games/${game.game_id}`}
              className="group flex justify-between flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-[var(--background)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="overflow-hidden">
                <Image
                  src={`/assets/games/${game.game_id}.jpg`}
                  alt={game.game_title}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={300}
                  height={200}
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">{game.game_title}</h2>

                <div className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-center font-medium text-white transition hover:bg-blue-700">
                  Play Now
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}

export default Page;
