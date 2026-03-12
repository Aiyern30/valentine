"use client";
import React, { useState, useRef, useEffect } from "react";
import { Music, VolumeX, Volume2, ExternalLink } from "lucide-react";

interface MusicPlayerProps {
  music?: string;
  isOpen: boolean;
  titleColor?: string;
}

/** Converts a YouTube / Spotify URL into an embed URL */
export function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // Spotify track
  if (url.includes("spotify.com")) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    if (match?.[1]) {
      return `https://open.spotify.com/embed/track/${match[1]}?utm_source=generator&theme=0`;
    }
  }

  // YouTube – standard watch URL
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId: string | null = null;
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("music.youtube.com")) {
      const match = url.match(/[?&]v=([^&]+)/);
      videoId = match?.[1] ?? null;
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`;
    }
  }

  return null;
}

/** Floating music bar displayed when the envelope is open */
export function MusicPlayer({ music, isOpen, titleColor }: MusicPlayerProps) {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl = React.useMemo(
    () => (music ? getEmbedUrl(music) : null),
    [music],
  );

  // Auto-start when the envelope opens (user already clicked = gesture)
  useEffect(() => {
    if (isOpen && embedUrl) {
      setStarted(true);
    }
    if (!isOpen) {
      setStarted(false);
    }
  }, [isOpen, embedUrl]);

  // Send mute/unmute via postMessage to the YouTube iframe
  useEffect(() => {
    if (!iframeRef.current || !started) return;
    try {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: muted ? "mute" : "unMute",
        }),
        "*",
      );
    } catch {
      // cross-origin – swallow silently
    }
  }, [muted, started]);

  if (!embedUrl || !isOpen) return null;

  const accentColor = titleColor ?? "#be185d";

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-9999 flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20 animate-in slide-in-from-bottom-4 duration-500"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      {/* Tiny visible iframe (1×1 px) – browsers require it to be in the DOM and *technically* visible */}
      {started && (
        <iframe
          ref={iframeRef}
          src={`${embedUrl}&enablejsapi=1`}
          width="1"
          height="1"
          style={{ position: "absolute", opacity: 0.01, pointerEvents: "none" }}
          allow="autoplay; encrypted-media"
          title="background music"
        />
      )}

      {/* Music icon / note animation */}
      <span
        className="text-sm animate-bounce"
        style={{ animationDuration: "1.5s" }}
      >
        🎵
      </span>

      {/* Label */}
      <span className="text-xs font-medium text-white/90 max-w-32 truncate">
        {started ? "Playing music" : "Music"}
      </span>

      {/* Mute toggle */}
      <button
        onClick={() => setMuted((m) => !m)}
        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <VolumeX size={14} className="text-white/70" />
        ) : (
          <Volume2 size={14} style={{ color: accentColor }} />
        )}
      </button>

      {/* Open in YouTube */}
      {music && (
        <a
          href={music}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          title="Open in YouTube"
        >
          <ExternalLink size={14} className="text-white/50" />
        </a>
      )}
    </div>
  );
}
