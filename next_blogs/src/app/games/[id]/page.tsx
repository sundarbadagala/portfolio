"use client";

import { useRef, useCallback, useEffect } from "react";
import Script from "next/script";
import { useParams } from "next/navigation";

import Wrapper from "@/shared/components/Wrapper";
import Container from "@/shared/components/Container";

declare global {
  interface Window {
    RufflePlayer: any;
  }
}

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const destroyPlayer = useCallback(() => {
    try {
      if (playerRef.current) {
        // Stop the movie if supported
        playerRef.current.pause?.();
        playerRef.current.stop?.();

        // Destroy the Ruffle instance if supported
        playerRef.current.destroy?.();

        // Remove from DOM
        playerRef.current.remove?.();

        playerRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current.replaceChildren();
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadGame = useCallback(() => {
    if (!window.RufflePlayer || !containerRef.current) return;

    // Destroy previous player
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
          className="mx-auto mt-6"
          style={{
            width: "800px",
            height: "600px",
          }}
        />
      </Container>
    </Wrapper>
  );
}
