export interface HistoryEntry {
  id: string;
  fortuneType: "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology";
  label: string;
  firstResponse: string;
  timestamp: string;
}

const STORAGE_KEY = "uranai-history";
const MAX_ENTRIES = 50;

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
