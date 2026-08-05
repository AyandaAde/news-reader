"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { PlatformPlaybackItem } from "@/lib/platform-playback";

type PlatformPlaybackContextValue = {
  current: PlatformPlaybackItem | null;
  isPlaying: boolean;
  play: (item: PlatformPlaybackItem) => void;
  togglePlay: () => void;
  close: () => void;
};

const PlatformPlaybackContext =
  createContext<PlatformPlaybackContextValue | null>(null);

export function PlatformPlaybackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState<PlatformPlaybackItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((item: PlatformPlaybackItem) => {
    setCurrent(item);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const close = useCallback(() => {
    setCurrent(null);
    setIsPlaying(false);
  }, []);

  const value = useMemo(
    () => ({
      current,
      isPlaying,
      play,
      togglePlay,
      close,
    }),
    [current, isPlaying, play, togglePlay, close],
  );

  return (
    <PlatformPlaybackContext.Provider value={value}>
      {children}
    </PlatformPlaybackContext.Provider>
  );
}

export function usePlatformPlayback() {
  const context = useContext(PlatformPlaybackContext);

  if (!context) {
    throw new Error(
      "usePlatformPlayback must be used within PlatformPlaybackProvider",
    );
  }

  return context;
}
