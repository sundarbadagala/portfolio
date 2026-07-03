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
        <div className="grid grid-cols-5 gap-3 pt-6">
          {GAMES_LSIT.map((game) => (
            <Link
              key={game.game_id}
              href={`/games/${game.game_id}`}
              className="flex !justify-between flex-col overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Image
                src={`/assets/games/${game.game_id}.jpg`}
                alt={game.game_title}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                width={100}
                height={100}
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold">{game.game_title}</h2>

                <button className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700">
                  Play Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}

export default Page;
