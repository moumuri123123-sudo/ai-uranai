"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import { addHistory } from "@/lib/history";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// サーバー側（Gemini ストリーミングエラー時）が送信するエラーマーカー。
// これが本文に含まれる場合、履歴には保存しない。
const STREAM_ERROR_MARKER = "[ERROR:stream_interrupted]";

type ChatBoxProps = {
  fortuneType: "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology";
  initialMessage?: string;
  zodiacSign?: string;
  person1?: string;
  person2?: string;
  mbtiType?: string;
  dreamKeyword?: string;
  birthDate?: string;
  tarotTheme?: string;
  tarotCard?: string;
  tarotReversed?: boolean;
  tarotCards?: Array<{ name: string; reversed: boolean; position: string }>;
  tarotSpread?: string;
  tarotQuestion?: string;
  compatibilityScore?: number;
  historyLabel?: string;
  onFirstResponse?: (response: string) => void;
  autoStart?: boolean;
};

export default function ChatBox({ fortuneType, initialMessage, zodiacSign, person1, person2, mbtiType, dreamKeyword, birthDate, tarotTheme, tarotCard, tarotReversed, tarotCards, tarotSpread, tarotQuestion, compatibilityScore, historyLabel, onFirstResponse, autoStart }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialMessage) {
      return [{ role: "assistant", content: initialMessage }];
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historySavedRef = useRef(false);
  // アンマウントや再実行時に進行中のストリーミングを中断するためのAbortController。
  const abortControllerRef = useRef<AbortController>(new AbortController());

  // アンマウント時に進行中のfetchを中止（setStateがアンマウント後に走るのを防ぐ）
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [input]);

  // 自動鑑定：マウント時にAPIを呼んで結果をストリーミング表示
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (!autoStart || autoStartedRef.current) return;
    autoStartedRef.current = true;

    // 既存のコントローラが中断済みの場合に備え、新しいものを用意する
    if (abortControllerRef.current.signal.aborted) {
      abortControllerRef.current = new AbortController();
    }
    const controller = abortControllerRef.current;

    const runAutoReading = async () => {
      setIsLoading(true);
      setMessages([{ role: "assistant", content: "" }]);
      let streamCompleted = false;

      try {
        const res = await fetch("/api/fortune", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: fortuneType,
            question: "__auto__",
            messages: [],
            zodiacSign,
            person1,
            person2,
            mbtiType,
            dreamKeyword,
            birthDate,
            tarotTheme,
            tarotCard,
            tarotReversed,
            tarotCards,
            tarotSpread,
            tarotQuestion,
            compatibilityScore,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          if (res.status === 429) {
            let msg = "占いの上限に達しました。少し時間をおいてからお試しください。";
            try {
              const data = await res.json();
              if (data && typeof data.error === "string") msg = data.error;
            } catch {
              // JSON解析失敗時はデフォルトメッセージを使用
            }
            throw new Error(msg);
          }
          throw new Error("APIエラー");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("ストリーミング非対応");

        const decoder = new TextDecoder();
        let content = "";

        while (true) {
          if (controller.signal.aborted) break;
          const { done, value } = await reader.read();
          if (done) {
            streamCompleted = !controller.signal.aborted;
            break;
          }
          content += decoder.decode(value, { stream: true });
          setMessages([{ role: "assistant", content }]);
        }

        const hasErrorMarker = content.includes(STREAM_ERROR_MARKER);
        if (
          streamCompleted &&
          !hasErrorMarker &&
          !controller.signal.aborted &&
          content &&
          historyLabel
        ) {
          addHistory({ fortuneType, label: historyLabel, firstResponse: content });
          historySavedRef.current = true;
          onFirstResponse?.(content);
        }
      } catch (err) {
        // アンマウント等による中断はサイレントに無視
        if (
          controller.signal.aborted ||
          (err instanceof DOMException && err.name === "AbortError")
        ) {
          return;
        }
        let errorMessage =
          "申し訳ございません。占いの途中でエラーが発生しました。もう一度お試しください。";
        if (err instanceof TypeError) {
          // fetch自体が失敗（ネットワークエラー）
          errorMessage = "通信エラーです。接続をご確認ください。";
        } else if (err instanceof Error && err.message) {
          // 429などサーバーから返ったエラーメッセージ
          errorMessage = err.message;
        }
        setMessages([{ role: "assistant", content: errorMessage }]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    runAutoReading();

    // クリーンアップ：進行中のストリーミングを中断し、次回用に新しいコントローラを用意
    return () => {
      controller.abort();
      abortControllerRef.current = new AbortController();
    };
  }, [autoStart, fortuneType, zodiacSign, person1, person2, mbtiType, dreamKeyword, birthDate, tarotTheme, tarotCard, tarotReversed, tarotCards, tarotSpread, tarotQuestion, compatibilityScore, historyLabel, onFirstResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // このリクエスト用のAbortController。アンマウントの副作用で中断できるよう
    // refに登録しておく。
    if (abortControllerRef.current.signal.aborted) {
      abortControllerRef.current = new AbortController();
    }
    const controller = abortControllerRef.current;

    let streamCompleted = false;
    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: fortuneType,
          question: trimmed,
          messages: updatedMessages,
          zodiacSign,
          person1,
          person2,
          mbtiType,
          dreamKeyword,
          birthDate,
          tarotTheme,
          tarotCard,
          tarotReversed,
          tarotCards,
          tarotSpread,
          tarotQuestion,
          compatibilityScore,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 429) {
          let msg = "占いの上限に達しました。少し時間をおいてからお試しください。";
          try {
            const data = await res.json();
            if (data && typeof data.error === "string") msg = data.error;
          } catch {
            // JSON解析失敗時はデフォルトメッセージを使用
          }
          throw new Error(msg);
        }
        throw new Error("APIエラーが発生しました");
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("ストリーミングに対応していません");
      }

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        if (controller.signal.aborted) break;
        const { done, value } = await reader.read();
        if (done) {
          streamCompleted = !controller.signal.aborted;
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return next;
        });
      }

      const hasErrorMarker = assistantContent.includes(STREAM_ERROR_MARKER);
      if (
        streamCompleted &&
        !hasErrorMarker &&
        !controller.signal.aborted &&
        !historySavedRef.current &&
        assistantContent &&
        historyLabel
      ) {
        addHistory({
          fortuneType,
          label: historyLabel,
          firstResponse: assistantContent,
        });
        historySavedRef.current = true;
        onFirstResponse?.(assistantContent);
      }
    } catch (err) {
      // アンマウント等による中断はサイレントに無視
      if (
        controller.signal.aborted ||
        (err instanceof DOMException && err.name === "AbortError")
      ) {
        return;
      }
      let errorMessage =
        "申し訳ございません。占いの途中でエラーが発生しました。もう一度お試しください。";
      if (err instanceof TypeError) {
        // fetch自体が失敗（ネットワークエラー）
        errorMessage = "通信エラーです。接続をご確認ください。";
      } else if (err instanceof Error && err.message && err.message !== "APIエラーが発生しました") {
        // 429などサーバーから返ったエラーメッセージ
        errorMessage = err.message;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh] sm:max-h-[600px] w-full max-w-2xl mx-auto rounded-2xl border border-border bg-[#0a0408] shadow-2xl overflow-hidden">
      {/* メッセージ一覧 */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted py-12">
            <span className="text-3xl mb-3 text-gold">&#x2726;</span>
            <p className="text-sm">質問を入力して占いを始めましょう</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            isStreaming={
              isLoading &&
              i === messages.length - 1 &&
              msg.role === "assistant"
            }
          />
        ))}
      </div>

      {/* 入力エリア */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-3 border-t border-border bg-[#0a0408]/80"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= 500) setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="悩みや質問を入力してください..."
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm bg-surface border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/30 disabled:opacity-50 transition-colors"
        />
        {input.length > 400 && (
          <span className={`absolute -top-5 right-3 text-xs ${input.length >= 500 ? "text-neon-red" : "text-muted"}`}>
            {input.length}/500
          </span>
        )}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex-shrink-0 h-11 w-11 rounded-xl bg-neon-red text-white flex items-center justify-center hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          aria-label="送信"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.105 2.29a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.897 28.897 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.289z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
