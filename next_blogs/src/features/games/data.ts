export interface Game {
  game_id: string;
  game_title: string;
  description: string;
  tags: string[];
  rating: number;
  year: string;
  controls: ("Keyboard" | "Mouse")[];
}

export const GAMES_LIST: Game[] = [
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
