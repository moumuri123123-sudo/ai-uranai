export interface HistoryEntry {
  id: string;
  fortuneType: "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology";
  label: string;
  firstResponse: string;
  timestamp: string;
}

const STORAGE_KEY = "uranai-history";
const MAX_ENTRIES = 50;

// PII（個人情報）をマスクするヘルパー
// - 生年月日の数字をマスク（例: "1990-05-20" → "19**-**-**"）
// - 1文字より長い名前を「先頭1文字 + ***」にマスク
// localStorage上でも生の個人情報を残さないため、保存時のみ適用する。
function maskPII(label: string): string {
  if (!label) return label;

  // 生年月日らしきパターンをマスク（YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD）
  let masked = label.replace(
    /(\d{2})(\d{2})([-/.])(\d{2})([-/.])(\d{2})/g,
    (_m, y1, _y2, sep1, _mm, sep2, _dd) => `${y1}**${sep1}**${sep2}**`,
  );

  // 日本語（ひらがな・カタカナ・漢字・長音記号）の名前らしき連続を
  // スクリプト混在（例: "田中たろう"）も1つのトークンとして扱い、先頭1文字 + *** にマスク
  masked = masked.replace(
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]{2,}/gu,
    (m) => `${Array.from(m)[0]}***`,
  );
  // ASCII英字の連続名もマスク
  masked = masked.replace(
    /[A-Za-z]{2,}/g,
    (m) => `${m[0]}***`,
  );

  return masked;
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addHistory(
  entry: Omit<HistoryEntry, "id" | "timestamp">
): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      // ラベルは生年月日や名前など入力値をそのまま含むことがあるためマスクしてから保存する
      label: maskPII(entry.label),
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      firstResponse: entry.firstResponse.slice(0, 200),
    };
    history.unshift(newEntry);
    if (history.length > MAX_ENTRIES) {
      history.splice(MAX_ENTRIES);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage full or disabled
  }
}

export function deleteHistory(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function clearAllHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
