"use client";

import { useRef, useCallback, useEffect } from "react";
import Script from "next/script";
import Wrapper from "@/shared/components/Wrapper";
import Container from "@/shared/components/Container";

interface RufflePlayerInstance extends HTMLDivElement {
  load: (src: string) => Promise<void> | void;
  pause?: () => void;
  stop?: () => void;
  destroy?: () => void;
}

interface RufflePlayerFactory {
  createPlayer: () => RufflePlayerInstance;
}

interface RuffleGlobal {
  newest: () => RufflePlayerFactory;
}

declare global {
  interface Window {
    RufflePlayer?: RuffleGlobal;
  }
}

export default function GamePlayer({ id }: { id: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<RufflePlayerInstance | null>(null);

  const destroyPlayer = useCallback(() => {
    try {
      if (playerRef.current) {
        playerRef.current.pause?.();
        playerRef.current.stop?.();
        playerRef.current.destroy?.();
        playerRef.current.remove();
        playerRef.current = null;
      }
      containerRef.current?.replaceChildren();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadGame = useCallback(() => {
    if (!window.RufflePlayer || !containerRef.current) return;

    destroyPlayer();

    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();

    player.style.width = "100%";
    player.style.height = "100%";

    playerRef.current = player;
    containerRef.current.appendChild(player);

    player.load(`/games/${id}.swf`);
  }, [id, destroyPlayer]);

  useEffect(() => {
    if (window.RufflePlayer) {
      loadGame();
    }

    return () => {
      destroyPlayer();
    };
  }, [loadGame, destroyPlayer]);

  return (
    <Wrapper>
      <Container>
        <Script
          src="https://unpkg.com/@ruffle-rs/ruffle"
          strategy="afterInteractive"
          onLoad={loadGame}
        />

        <div
          ref={containerRef}
          className="mx-auto mt-6 rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          style={{
            width: "800px",
            maxWidth: "100%",
            height: "600px",
          }}
        />
      </Container>
    </Wrapper>
  );
}
