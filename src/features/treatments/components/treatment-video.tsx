"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Video, Volume2, VolumeX } from "lucide-react";

type VideoMode = "cover" | "card";

interface TreatmentVideoProps {
  videoUrl: string | null;
  posterUrl: string | null;
  title: string;
  mode?: VideoMode;
  stepTitles?: string[];
  stepCount?: number;
  playing?: boolean;
  className?: string;
}

const VISIBLE_RATIO = 0.55;

function positioned(className: string) {
  return /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? className : `relative ${className}`;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TreatmentVideo({
  videoUrl,
  posterUrl,
  title,
  mode = "cover",
  stepTitles = [],
  stepCount,
  playing,
  className = "",
}: TreatmentVideoProps) {
  if (!videoUrl) {
    return (
      <VideoPending
        title={title}
        mode={mode}
        stepTitles={stepTitles}
        stepCount={stepCount ?? stepTitles.length}
        className={className}
      />
    );
  }
  return (
    <VideoPlayer
      videoUrl={videoUrl}
      posterUrl={posterUrl}
      title={title}
      mode={mode}
      playing={playing}
      className={className}
    />
  );
}

function VideoPlayer({
  videoUrl,
  posterUrl,
  title,
  mode,
  playing,
  className,
}: {
  videoUrl: string;
  posterUrl: string | null;
  title: string;
  mode: VideoMode;
  playing?: boolean;
  className: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== "cover" || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= VISIBLE_RATIO && !userPaused) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: [0, VISIBLE_RATIO, 1] },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [mode, userPaused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== "card" || playing === undefined) return;
    if (playing && !prefersReducedMotion()) void video.play().catch(() => {});
    else video.pause();
  }, [mode, playing]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      void video.play().catch(() => {});
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const fullscreen = () => {
    const node = frameRef.current;
    if (node?.requestFullscreen) void node.requestFullscreen().catch(() => {});
  };

  return (
    <div ref={frameRef} className={`treatment-video group/video overflow-hidden bg-[#0B2C1A] ${positioned(className)}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl ?? undefined}
        muted
        loop
        playsInline
        preload={mode === "card" && posterUrl ? "none" : "metadata"}
        aria-label={`Video del procedimiento: ${title}`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (video.duration) setProgress(video.currentTime / video.duration);
        }}
        className="absolute inset-0 size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#062112]/70 to-transparent"
      />
      {mode === "cover" && (
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-2">
          <VideoControl label={isPlaying ? "Pausar video" : "Reproducir video"} onClick={toggle}>
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
          </VideoControl>
          <VideoControl label={muted ? "Activar sonido" : "Silenciar"} onClick={toggleSound}>
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </VideoControl>
          <div className="mx-2 h-[2px] flex-1 overflow-hidden rounded-full bg-[#F2EBDB]/25">
            <div
              className="h-full origin-left rounded-full bg-[#E0BC87]"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <VideoControl label="Ver en pantalla completa" onClick={fullscreen}>
            <Maximize2 className="size-4" />
          </VideoControl>
        </div>
      )}
    </div>
  );
}

function VideoControl({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-[#F2EBDB]/15 text-[#F2EBDB] backdrop-blur-md transition-colors duration-300 hover:bg-[#F2EBDB] hover:text-[#062112] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0BC87]"
    >
      {children}
    </button>
  );
}

function VideoPending({
  title,
  mode,
  stepTitles,
  stepCount,
  className,
}: {
  title: string;
  mode: VideoMode;
  stepTitles: string[];
  stepCount: number;
  className: string;
}) {
  const steps = stepTitles.slice(0, 6);
  return (
    <div
      role="img"
      aria-label={`Video del procedimiento de ${title} en preparación`}
      className={`media-empty block overflow-hidden ${positioned(className)}`}
      data-tone="dark"
    >
      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-[#E0BC87]/50 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0BC87]/85">
          <Video className="size-3.5" aria-hidden="true" />
          Video en preparación
        </span>
        {mode === "card" && stepCount > 0 && (
          <span className="font-heading text-[clamp(1.5rem,2.2vw,2rem)] leading-tight text-[#F2EBDB]/90">
            {stepCount} {stepCount === 1 ? "paso" : "pasos"} de cuidado
          </span>
        )}
        {mode === "cover" && steps.length > 0 && (
          <ol className="flex flex-col gap-1.5">
            {steps.map((step, index) => (
              <li
                key={step}
                className="video-pending-step flex items-baseline gap-3 font-sans text-sm text-[#F2EBDB]/80"
                style={{ animationDelay: `${index * 1.4}s`, animationDuration: `${steps.length * 1.4}s` }}
              >
                <span className="w-5 shrink-0 text-right font-bold tabular-nums text-[#E0BC87]">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
