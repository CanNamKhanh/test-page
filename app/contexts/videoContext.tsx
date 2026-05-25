"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

interface Video {
  id: number;
  videoUrl: string;
  authorName: string;
  description: string;
  likesCount: number;
}

interface VideoContextValue {
  playlist: Video[];
  currentIndex: number;
  currentVideo: Video | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMuted: boolean;
  setMuted: (value: boolean) => void;
  setPlaylist: (data: Video[], startIndex?: number) => void;
}

const VideoContext = createContext<VideoContextValue | null>(null);

export function VideoProvider({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playlist, setPlaylistState] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setMuted = useCallback((value: boolean) => {
    setIsMuted(value);
    if (videoRef.current) videoRef.current.muted = value;
  }, []);

  const setPlaylist = useCallback((data: Video[], startIndex = 0) => {
    setPlaylistState(data);
    setCurrentIndex(startIndex);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        playlist,
        currentIndex,
        currentVideo: playlist[currentIndex] ?? null,
        videoRef,
        isMuted,
        setMuted,
        setPlaylist,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo(): VideoContextValue {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used inside <VideoProvider>");
  return ctx;
}
