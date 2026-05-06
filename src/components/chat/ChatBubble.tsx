"use client";

import { ChatMessage } from "@/types/chat";
import { ExternalLink, PlayCircle } from "lucide-react";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`mb-4 flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[92%] overflow-hidden rounded-[24px] border px-4 py-3.5 text-[15px] font-bold leading-relaxed shadow-sm ${
          isAssistant
            ? "rounded-tl-none bg-white text-charcoal border-charcoal/5"
            : "rounded-tr-none bg-brand-yellow text-charcoal border-charcoal/10"
        }`}
      >
        <p className="break-words">{message.content}</p>
        {isAssistant && message.resources && message.resources.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.resources.map((resource) => (
              <article
                key={resource.url}
                className="rounded-2xl border border-charcoal/10 bg-brand-cream/70 p-3.5 text-left"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-charcoal/35">
                  {resource.source}
                </p>
                <h3 className="mt-1 break-words text-[15px] font-black leading-snug text-charcoal">{resource.title}</h3>
                <p className="mt-2 text-[13px] font-semibold leading-snug text-charcoal/55">{resource.snippet}</p>
                <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-[12px] font-bold leading-snug text-charcoal/60">
                  {resource.whyRecommended}
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-[12px] font-black uppercase tracking-wide text-charcoal"
                >
                  <span className="truncate">Open link</span>
                  <ExternalLink size={14} strokeWidth={3} />
                </a>
              </article>
            ))}
          </div>
        )}
        {isAssistant && message.videos && message.videos.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.videos.map((video) => (
              <article
                key={video.videoId}
                className="overflow-hidden rounded-2xl border border-charcoal/10 bg-brand-cream/70 text-left"
              >
                <div className="aspect-video w-full bg-charcoal/5">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-charcoal/35">
                    <PlayCircle size={14} strokeWidth={3} />
                    {video.channelTitle}
                  </p>
                  <h3 className="mt-1 break-words text-[15px] font-black leading-snug text-charcoal">{video.title}</h3>
                  <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-[12px] font-bold leading-snug text-charcoal/60">
                    {video.whyRecommended}
                  </p>
                  <a
                    href={video.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-[12px] font-black uppercase tracking-wide text-charcoal"
                  >
                    <span className="truncate">Watch on YouTube</span>
                    <ExternalLink size={14} strokeWidth={3} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
