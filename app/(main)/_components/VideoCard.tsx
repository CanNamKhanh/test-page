"use client";

import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Forward,
  Heart,
  MessageCircleMore,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { VideoType } from "@/app/services/videoService";
import { useVideo } from "@/app/contexts/videoContext";
import { ActionBtn } from "./ActionBtn";

type Props = {
  video: VideoType;
  index: number;
};

export default function VideoCard({ video, index }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isVideoShape, setIsVideoShape] = useState<
    "LANDSCAPE" | "PORTRAIT" | "SQUARE" | "BIG_LANDSCAPE" | null
  >(null);
  const { isMuted, setMuted } = useVideo();
  const [overlayIcon, setOverlayIcon] = useState<"play" | "pause" | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likesCount);

  const isFirst = index === 0;
  const isDisabled = !isActive || isFirst;

  // ─── Detect video aspect ratio ───────────────────────────────────────────
  const handleLoadedMetadata = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const ratio = vid.videoWidth / vid.videoHeight;
    let shape: "LANDSCAPE" | "PORTRAIT" | "SQUARE" | "BIG_LANDSCAPE" | null =
      null;
    if (ratio >= 1.2 && ratio <= 1.5) shape = "LANDSCAPE";
    else if (ratio < 0.8) shape = "PORTRAIT";
    else if (ratio > 1.5) shape = "BIG_LANDSCAPE";
    else if (ratio >= 1 && ratio < 1.2) shape = "SQUARE";
    setIsVideoShape(shape);
  }, []);

  // ─── Responsive sizing per shape ─────────────────────────────────────────
  const handleVideoShape = () => {
    switch (isVideoShape) {
      case "LANDSCAPE":
        return "w-full sm:w-[75%] md:w-[65%] max-h-full";
      case "BIG_LANDSCAPE":
        return "w-full sm:w-[80%] md:w-[70%] max-h-full";
      case "PORTRAIT":
        return "w-auto h-[95%] max-w-full sm:max-w-[380px] md:max-w-[420px]";
      case "SQUARE":
        return "w-full sm:w-[65%] md:w-[55%] h-auto max-h-full";
      default:
        return "w-full h-full";
    }
  };

  // ─── Navigation ──────────────────────────────────────────────────────────
  const handleNext = () => {
    const items = document.querySelectorAll(".snap-start");
    const currentIndex = Array.from(items).findIndex((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= -10 && rect.top <= 10;
    });
    items[currentIndex + 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePrev = () => {
    const items = document.querySelectorAll(".snap-start");
    const currentIndex = Array.from(items).findIndex((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= -10 && rect.top <= 10;
    });
    items[currentIndex - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ─── Play / Pause ─────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    setOverlayIcon(null);
    if (vid.paused) {
      vid.play();
      setTimeout(() => setOverlayIcon("play"), 10);
    } else {
      vid.pause();
      setTimeout(() => setOverlayIcon("pause"), 10);
    }
    setTimeout(() => setOverlayIcon(null), 400);
  }, []);

  // ─── Seek ─────────────────────────────────────────────────────────────────
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const vid = videoRef.current;
    const bar = progressRef.current;
    if (!vid || !bar || !vid.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1,
    );
    vid.currentTime = ratio * vid.duration;
    setProgress(ratio * 100);
  }, []);

  // ─── FIX: Like — tránh nested setState & double-call ─────────────────────
  const handleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount(next ? video.likesCount + 1 : video.likesCount);
      return next;
    });
  }, [video.likesCount]);

  // ─── Spacebar shortcut ───────────────────────────────────────────────────
  useEffect(() => {
    const handleSpace = (e: KeyboardEvent) => {
      if (e.code === "Space" && isActive) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleSpace);
    return () => window.removeEventListener("keydown", handleSpace);
  }, [togglePlay, isActive]);

  // ─── Start muted ─────────────────────────────────────────────────────────
  useEffect(() => {
    setMuted(true);
  }, [setMuted]);

  // ─── Progress bar rAF loop ────────────────────────────────────────────────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    let rafId: number;
    const tick = () => {
      if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
      rafId = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      rafId = requestAnimationFrame(tick);
    };
    const onPause = () => {
      cancelAnimationFrame(rafId);
    };
    vid.addEventListener("play", onPlay);
    vid.addEventListener("pause", onPause);
    if (!vid.paused) rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      vid.removeEventListener("play", onPlay);
      vid.removeEventListener("pause", onPause);
    };
  }, []);

  // ─── IntersectionObserver — auto play/pause ───────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting && entry.intersectionRatio >= 0.8;
        setIsActive(active);
        const vid = videoRef.current;
        if (!vid) return;
        if (active) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
          vid.currentTime = 0;
          setProgress(0);
        }
      },
      { threshold: 0.8 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full snap-start flex justify-center items-center bg-black text-white relative overflow-hidden"
    >
      {/* ── Video wrapper ──────────────────────────────────────────────────── */}
      <div
        className={`
          ${handleVideoShape()}
          relative flex items-center justify-center cursor-pointer
          /* on mobile: leave room on the right for action buttons */
          pr-14 sm:pr-0
        `}
      >
        <div className="relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-4xl">
          <video
            ref={videoRef}
            src={video.videoUrl!}
            muted={isMuted}
            loop
            playsInline
            autoPlay
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className="w-full h-full border border-white/10 rounded-2xl sm:rounded-3xl md:rounded-4xl object-contain"
          />

          {/* Mute toggle */}
          <button
            onClick={() => setMuted(!isMuted)}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="absolute top-2 left-2 sm:top-3 sm:left-3 rounded-full w-10 h-10 sm:w-13 sm:h-13 flex justify-center items-center hover:bg-white/40 transition-colors"
          >
            {isMuted ? (
              <VolumeX size={18} fill="white" className="text-white" />
            ) : (
              <Volume2 size={18} fill="white" className="text-white" />
            )}
          </button>

          {/* Author & description */}
          <div className="absolute flex flex-col bottom-4 left-3 sm:bottom-5 sm:left-5 font-medium gap-1 max-w-[75%]">
            <span className="text-sm sm:text-base md:text-[18px] font-semibold truncate">
              {video.authorName}
            </span>
            <span className="text-xs sm:text-sm md:text-[16px] text-white/80 line-clamp-2">
              {video.description}
            </span>
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="w-full absolute h-1.5 sm:h-2 bottom-0 rounded-b-2xl cursor-pointer group"
          >
            <div className="absolute inset-0 bg-white/20 rounded-b-2xl" />
            <div
              style={{ width: `${progress}%` }}
              className="relative bg-red-500 h-full rounded-bl-2xl will-change-[width]"
            />
            <div
              style={{ left: `${progress}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            />
          </div>

          {/* Play/Pause */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {overlayIcon && (
              <div className="flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full bg-black/40 backdrop-blur-md animate-icon-pop">
                {overlayIcon === "pause" ? (
                  <Pause
                    size={50}
                    fill="white"
                    strokeWidth={0}
                    className="sm:w-15! sm:h-15! md:w-17.5! md:h-17.5!"
                  />
                ) : (
                  <Play
                    size={50}
                    fill="white"
                    strokeWidth={0}
                    className="sm:w-15! sm:h-15! md:w-17.5! md:h-17.5!"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* ACTION BTN */}
        <div className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 sm:-right-15 md:-right-17 flex flex-col gap-1 sm:gap-1.5">
          {/* Like */}
          <div className="flex flex-col cursor-pointer items-center text-[#d1c2c2] font-medium gap-0.5">
            <button
              onClick={handleLike}
              aria-label="Like"
              className="w-10 h-10 sm:w-11 sm:h-11 cursor-pointer md:w-13 md:h-13 flex justify-center items-center rounded-full bg-[#1F1F1F] hover:bg-[#141414] active:scale-90 transition-all"
            >
              <Heart
                size={18}
                className={`transition-colors ${liked ? "text-red-500" : "text-white"}`}
                fill={liked ? "currentColor" : "none"}
              />
            </button>
            <span className="text-xs sm:text-sm">{likeCount}</span>
          </div>

          {/* Comment */}
          <ActionBtn label="Comment" count={0}>
            <MessageCircleMore size={18} className="text-white" />
          </ActionBtn>

          {/* Bookmark */}
          <ActionBtn label="Bookmark" count={0}>
            <Bookmark size={18} className="text-white" />
          </ActionBtn>

          {/* Share */}
          <ActionBtn label="Share" count={0}>
            <Forward size={18} className="text-white" />
          </ActionBtn>
        </div>
      </div>

      {/* UP/DOWN */}
      <div className="right-1 hidden sm:right-3 md:right-5 top-1/2 fixed -translate-y-1/2 z-50 md:flex flex-col gap-2 sm:gap-3">
        <button
          onClick={!isDisabled ? handlePrev : undefined}
          aria-label="Previous video"
          className={`w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 flex justify-center items-center rounded-full bg-[#1F1F1F] transition-all ${
            isDisabled
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:bg-[#545050] active:scale-90"
          }`}
        >
          <ChevronUp className="text-white scale-110 sm:scale-130" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next video"
          className="w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 flex justify-center items-center cursor-pointer rounded-full bg-[#1F1F1F] hover:bg-[#545050] active:scale-90 transition-all"
        >
          <ChevronDown className="text-white scale-110 sm:scale-130" />
        </button>
      </div>
    </div>
  );
}
