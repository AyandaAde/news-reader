"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const play = useCallback((item: PlatformPlaybackItem) => {
    setCurrent(item);
    setIsPlaying(true);

    const audio = audioRef.current;
    if (!audio || !item.audioUrl) {
      return;
    }

    if (audio.src !== new URL(item.audioUrl, window.location.origin).href) {
      audio.src = item.audioUrl;
    }

    void audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;

    setIsPlaying((playing) => {
      const next = !playing;

      if (audio?.src) {
        if (next) {
          void audio.play().catch(() => undefined);
        } else {
          audio.pause();
        }
      }

      return next;
    });
  }, []);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

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
