import type React from "react";
import Link from "next/link";

/**
 * 占処ブログ用の軽量マークダウンレンダラ。
 *
 * `blog-data.ts` の `content` は厳密なMarkdownではなく、以下のような
 * 和製フォーマットで書かれているため、専用のパーサで扱う:
 *   - 段落区切り: 空行（\n\n）
 *   - 見出し: 行頭が 【...】 で始まる行
 *   - インラインリンク: [テキスト](/path)
 *   - 箇条書き: 行頭が "- " または "・" で始まる連続した行
 *   - 番号付きリスト: 行頭が "1. ", "2. " ... で始まる連続した行
 *   - Q/A ブロック: "Q. ..." / "A. ..." 行
 *
 * これらを意味のあるHTML要素（h2, ul, ol, p, a）にマップし、
 * SEO上 Google が記事構造を認識できるようにする。
 */

const HEADING_LINE_REGEX = /^【[^】]+】.*$/;
const BULLET_LINE_REGEX = /^(?:-|\u30fb)\s+(.+)$/;
const NUMBERED_LINE_REGEX = /^(\d+)\.\s+(.+)$/;

function decodeEntities(text: string): string {
  return text
    .replace(/&reg;/g, "\u00AE")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/**
 * テキスト内のマークダウンリンク記法を React ノードに変換する。
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const decoded = decodeEntities(text);
  const parts: React.ReactNode[] = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let found: RegExpExecArray | null = linkPattern.exec(decoded);

  while (found !== null) {
    if (found.index > lastIndex) {
      parts.push(decoded.slice(lastIndex, found.index));
    }
    const linkKey = `${keyPrefix}-link-${found.index}`;
    const href = found[2];
    const label = found[1];
    const isInternal = href.startsWith("/");
    if (isInternal) {
      parts.push(
        <Link
          key={linkKey}
          href={href}
          className="inline-block font-bold text-gold underline decoration-gold/40 underline-offset-2 transition-colors hover:text-gold/80 hover:decoration-gold"
        >
          {label}
        </Link>,
      );
    } else {
      parts.push(
        <a
          key={linkKey}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          className="inline-block font-bold text-gold underline decoration-gold/40 underline-offset-2 transition-colors hover:text-gold/80 hover:decoration-gold"
        >
          {label}
        </a>,
      );
    }
    lastIndex = found.index + found[0].length;
    found = linkPattern.exec(decoded);
  }
  if (lastIndex < decoded.length) {
    parts.push(decoded.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [decoded];
}

function renderBlock(block: string, index: number): React.ReactNode {
  const rawLines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (rawLines.length === 0) return null;

  if (rawLines.every((l) => BULLET_LINE_REGEX.test(l))) {
    return (
      <ul
        key={`ul-${index}`}
        className="mb-4 list-disc space-y-2 pl-6 text-sm leading-relaxed text-foreground/80 marker:text-gold/60 last:mb-0"
      >
        {rawLines.map((l, i) => {
          const m = l.match(BULLET_LINE_REGEX);
          const text = m ? m[1] : l;
          return (
            <li key={`li-${index}-${i}`}>
              {renderInline(text, `p${index}-li${i}`)}
            </li>
          );
        })}
      </ul>
    );
  }

  if (rawLines.every((l) => NUMBERED_LINE_REGEX.test(l))) {
    return (
      <ol
        key={`ol-${index}`}
        className="mb-4 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-foreground/80 marker:text-gold/70 last:mb-0"
      >
        {rawLines.map((l, i) => {
          const m = l.match(NUMBERED_LINE_REGEX);
          const text = m ? m[2] : l;
          return (
            <li key={`li-${index}-${i}`}>
              {renderInline(text, `p${index}-oli${i}`)}
            </li>
          );
        })}
      </ol>
    );
  }

  if (HEADING_LINE_REGEX.test(rawLines[0])) {
    const headingLine = rawLines[0];
    const bodyLines = rawLines.slice(1);
    const isQaBody =
      bodyLines.length >= 2 &&
      /^Q\.\s/.test(bodyLines[0]) &&
      /^A\.\s/.test(bodyLines[1]);
    return (
      <div key={`sec-${index}`} className="mb-6 last:mb-0">
        <h2 className="font-mincho mb-3 border-l-2 border-neon-red/70 pl-3 text-base font-semibold text-gold sm:text-lg">
          {renderInline(headingLine, `p${index}-h`)}
        </h2>
        {isQaBody ? (
          <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
            <p className="mb-2 text-sm font-semibold text-warm">
              {renderInline(bodyLines[0], `p${index}-q`)}
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              {bodyLines.slice(1).map((l, i) => (
                <span key={`qa-${index}-${i}`}>
                  {renderInline(l, `p${index}-a${i}`)}
                  {i < bodyLines.length - 2 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>
        ) : bodyLines.length > 0 ? (
          <p className="text-sm leading-relaxed text-foreground/80">
            {bodyLines.map((line, i) => (
              <span key={`bl-${index}-${i}`}>
                {renderInline(line, `p${index}-b${i}`)}
                {i < bodyLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        ) : null}
      </div>
    );
  }

  if (
    rawLines.length >= 2 &&
    /^Q\.\s/.test(rawLines[0]) &&
    /^A\.\s/.test(rawLines[1])
  ) {
    return (
      <div
        key={`qa-${index}`}
        className="mb-4 rounded-xl border border-border/60 bg-surface/40 p-4 last:mb-0"
      >
        <p className="mb-2 text-sm font-semibold text-warm">
          {renderInline(rawLines[0], `p${index}-q`)}
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          {rawLines.slice(1).map((l, i) => (
            <span key={`qa-${index}-${i}`}>
              {renderInline(l, `p${index}-a${i}`)}
              {i < rawLines.length - 2 ? <br /> : null}
            </span>
          ))}
        </p>
      </div>
    );
  }

  return (
    <p
      key={`p-${index}`}
      className="mb-4 text-sm leading-relaxed text-foreground/80 last:mb-0"
    >
      {rawLines.map((line, i) => (
        <span key={`pl-${index}-${i}`}>
          {renderInline(line, `p${index}-l${i}`)}
          {i < rawLines.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  );
}

/**
 * 記事本文をレンダリングする。
 */
export function renderArticleContent(content: string): React.ReactNode[] {
  return content
    .split(/\n{2,}/)
    .map((block, i) => renderBlock(block, i))
    .filter((n): n is React.ReactNode => n !== null);
}

/**
 * JSON-LD articleBody 用のプレーンテキストを抽出する。
 */
export function extractPlainText(content: string, maxLength = 1500): string {
  const plain = decodeEntities(content)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/【([^】]+)】/g, "$1 ")
    .replace(/^(?:-|\u30fb)\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength);
}
