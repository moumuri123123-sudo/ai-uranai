'use client';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
};

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  if (role === 'user') {
    return (
      <div className="mb-4 flex justify-end">
        <div className="bg-neon-red/90 max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-white shadow-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-start gap-3">
      <div
        className="bg-neon-red shadow-neon-red/30 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base text-white shadow-lg"
        aria-hidden="true"
      >
        &#x2726;
      </div>
      <div className="bg-surface border-border text-foreground max-w-[80%] rounded-2xl rounded-bl-sm border px-4 py-3 shadow-md">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="ml-1 inline-flex" aria-hidden="true">
              <span className="text-neon-red animate-pulse">.</span>
              <span className="text-neon-red animate-pulse [animation-delay:200ms]">.</span>
              <span className="text-neon-red animate-pulse [animation-delay:400ms]">.</span>
            </span>
          )}
          {isStreaming && <span className="sr-only">鑑定中です</span>}
        </p>
      </div>
    </div>
  );
}
