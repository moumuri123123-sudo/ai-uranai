"use client";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

export default function ChatMessage({
  role,
  content,
  isStreaming,
}: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 bg-neon-red/90 text-white shadow-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4">
      <div
        className="flex-shrink-0 w-9 h-9 rounded-full bg-neon-red flex items-center justify-center text-base text-white shadow-lg shadow-neon-red/30"
        aria-hidden="true"
      >
        &#x2726;
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 bg-surface border border-border text-foreground shadow-md">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-flex ml-1" aria-hidden="true">
              <span className="animate-pulse text-neon-red">.</span>
              <span className="animate-pulse text-neon-red [animation-delay:200ms]">.</span>
              <span className="animate-pulse text-neon-red [animation-delay:400ms]">.</span>
            </span>
          )}
          {isStreaming && <span className="sr-only">鑑定中です</span>}
        </p>
      </div>
    </div>
  );
}
