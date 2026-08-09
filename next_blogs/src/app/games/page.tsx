"use client";
import React, { useState, useMemo } from "react";
import Container from "@/shared/components/Container";
import Image from "next/image";
import Link from "next/link";
import {
  FaGamepad,
  FaStar,
  FaKeyboard,
  FaMouse,
  FaPlay,
  FaSearch,
} from "react-icons/fa";

interface Game {
  game_id: string;
  game_title: string;
  description: string;
  tags: string[];
  rating: number;
  year: string;
  controls: ("Keyboard" | "Mouse")[];
}

const GAMES_LIST: Game[] = [
  {
    game_id: "avalance",
    game_title: "Avalanche",
    description: "Scale falling blocks, dodge ice, and survive the collapsing snowy structure in this high-intensity arcade survival game.",
    tags: ["Action", "Survival"],
    rating: 4.8,
    year: "2007",
    controls: ["Keyboard"],
  },
  {
    game_id: "billy_and_mandy_spell_book",
    game_title: "Billy & Mandy: Spellbook",
    description: "Help Billy and Mandy cast mysterious spells and solve challenging magical puzzles in this Cartoon Network classic.",
    tags: ["Puzzle", "Adventure"],
    rating: 4.5,
    year: "2005",
    controls: ["Mouse", "Keyboard"],
  },
  {
    game_id: "bullet_bill",
    game_title: "Bullet Bill",
    description: "Fly at light speed as Mario's blast nemesis. Smash obstacles and navigate crazy courses as fast as you can.",
    tags: ["Arcade", "Action"],
    rating: 4.7,
    year: "2006",
    controls: ["Mouse"],
  },
  {
    game_id: "charlie_the_duck",
    game_title: "Charlie the Duck",
    description: "Take a nostalgic run through retro-styled levels, stomping enemies and collecting secrets as Charlie the Duck.",
    tags: ["Platformer", "Adventure"],
    rating: 4.6,
    year: "2001",
    controls: ["Keyboard"],
  },
  {
    game_id: "crazy_nut",
    game_title: "Crazy Nut",
    description: "Aim, adjust trajectories, and throw nuts with physics calculation to gather winter supplies for your squirrel.",
    tags: ["Physics", "Puzzle"],
    rating: 4.4,
    year: "2010",
    controls: ["Mouse"],
  },
];

const GENRES = ["All", "Action", "Adventure", "Platformer", "Puzzle", "Arcade"];

function Page() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Determine featured game (e.g. highest rated)
  const featuredGame = GAMES_LIST[0];

  // Filter games based on category and search query
  const filteredGames = useMemo(() => {
    return GAMES_LIST.filter((game) => {
      const matchesGenre =
        selectedGenre === "All" || game.tags.includes(selectedGenre);
      const matchesSearch =
        game.game_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, searchQuery]);

  return (
    <main className="min-h-screen mt-4 pb-16">
      <Container>
        {/* Page Headers */}
        <div className="pt-6 pb-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-3">
            🎮 Retro Arcade Store
          </h1>
          <p className="text-md md:text-lg opacity-70 mt-2 max-w-2xl">
            A curated library of classic Flash games powered by Ruffle emulation. No downloads required, play instantly in your browser.
          </p>
        </div>

        {/* Hero Spotlight Section */}
        {featuredGame && (
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-blue-50/50 via-indigo-50/10 to-transparent dark:from-indigo-950/30 dark:via-zinc-900/40 dark:to-zinc-950/40 p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-xl mt-6 transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/30">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-50%] right-[-10%] w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl pointer-events-none" />

            {/* Hero Left Content */}
            <div className="flex-1 flex flex-col items-start gap-4 z-10 w-full">
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-widest animate-pulse">
                ★ Spotlight Game
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--foreground)]">
                {featuredGame.game_title}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 text-sm font-semibold text-yellow-500 bg-yellow-500/10 px-2.5 py-0.5 rounded-lg border border-yellow-500/20">
                  <FaStar /> {featuredGame.rating}
                </span>
                <span className="text-xs font-medium opacity-60">
                  Released {featuredGame.year}
                </span>
                <span className="text-xs opacity-30">|</span>
                {featuredGame.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md font-medium text-[var(--foreground)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-md opacity-75 max-w-xl leading-relaxed">
                {featuredGame.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 w-full">
                <Link
                  href={`/games/${featuredGame.game_id}`}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 border border-white/10 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
                >
                  <FaPlay size={14} /> Play Now
                </Link>
                <div className="flex flex-wrap items-center gap-2 text-xs opacity-60">
                  Controls: 
                  {featuredGame.controls.map((ctrl) => (
                    <span key={ctrl} className="flex items-center gap-1 bg-slate-200/50 dark:bg-zinc-800/80 px-2 py-1 rounded" title={`${ctrl} required`}>
                      {ctrl === "Keyboard" ? <FaKeyboard size={12} /> : <FaMouse size={12} />}
                      {ctrl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Right Visual mockup */}
            <div className="relative w-full lg:w-96 h-56 lg:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-zinc-800 group z-10 flex-shrink-0">
              <Image
                src={`/assets/games/${featuredGame.game_id}.jpg`}
                alt={featuredGame.game_title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        )}

        {/* Filters and Search Control Panel */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-200/60 dark:border-zinc-800/60 pb-6">
          {/* Genre Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {GENRES.map((genre) => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.03]"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 text-[var(--foreground)] opacity-70 hover:opacity-100"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search retro games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-[var(--background)] text-sm text-[var(--foreground)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
            {filteredGames.map((game) => (
              <Link
                key={game.game_id}
                href={`/games/${game.game_id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/20 backdrop-blur-md shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] hover:border-blue-500/30 dark:hover:border-indigo-500/30"
              >
                {/* Cover Art Wrapper */}
                <div className="overflow-hidden relative h-48 w-full bg-slate-900">
                  <Image
                    src={`/assets/games/${game.game_id}.jpg`}
                    alt={game.game_title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Dynamic Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    {/* Floating Play Action */}
                    <div className="transform translate-y-6 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/30 border border-white/10 hover:brightness-110 hover:scale-105 active:scale-95 pointer-events-auto">
                      <FaPlay size={10} /> PLAY NOW
                    </div>
                  </div>
                  {/* Tags Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-bold tracking-wider bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-yellow-500">
                        <FaStar size={12} /> {game.rating}
                      </span>
                      <span className="text-[11px] opacity-40 font-medium text-[var(--foreground)]">{game.year}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--foreground)] mt-2 group-hover:text-blue-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {game.game_title}
                    </h3>

                    <p className="text-xs opacity-70 mt-1.5 line-clamp-2 leading-relaxed text-[var(--foreground)]">
                      {game.description}
                    </p>
                  </div>

                  {/* Card bottom details */}
                  <div className="mt-5 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] opacity-60 text-[var(--foreground)]">
                    <span className="flex items-center gap-1 font-medium">
                      <FaGamepad size={12} /> Compatibility
                    </span>
                    <div className="flex items-center gap-1.5 font-bold">
                      {game.controls.map((ctrl) => (
                        <span key={ctrl} className="flex items-center gap-0.5 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-gray-200/50 dark:border-zinc-700/50" title={`${ctrl} support`}>
                          {ctrl === "Keyboard" ? <FaKeyboard size={10} /> : <FaMouse size={10} />}
                          {ctrl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty Search/Filter State */
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <span className="text-5xl">🔍</span>
            <h3 className="text-xl font-bold text-[var(--foreground)]">No games found</h3>
            <p className="text-sm opacity-60 max-w-sm">
              We couldn&apos;t find any games matching &quot;{searchQuery}&quot; in category &quot;{selectedGenre}&quot;. Try clearing your filters or refining your search.
            </p>
            <button
              onClick={() => {
                setSelectedGenre("All");
                setSearchQuery("");
              }}
              className="mt-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-5 rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Container>
    </main>
  );
}

export default Page;
