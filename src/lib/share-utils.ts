export type FortuneType = "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology";

export type FortuneResultData = {
  fortuneType: FortuneType;
  label: string;
  summary: string;
};

export const fortuneTypeNames: Record<FortuneType, string> = {
  tarot: "タロット占い",
  zodiac: "星座占い",
  compatibility: "相性占い",
  mbti: "MBTI診断",
  dream: "夢占い",
  numerology: "数秘術",
};

export const fortuneTypeIcons: Record<FortuneType, string> = {
  tarot: "札",
  zodiac: "星",
  compatibility: "縁",
  mbti: "心",
  dream: "夢",
  numerology: "数",
};

const fortuneTypePaths: Record<FortuneType, string> = {
  tarot: "/tarot",
  zodiac: "/zodiac",
  compatibility: "/compatibility",
  mbti: "/mbti",
  dream: "/dream",
  numerology: "/numerology",
};

export function getFortuneTypePath(type: FortuneType): string {
  return fortuneTypePaths[type] || "/";
}

const VALID_TYPES: FortuneType[] = ["tarot", "zodiac", "compatibility", "mbti", "dream", "numerology"];

export function isValidFortuneType(type: string): type is FortuneType {
  return VALID_TYPES.includes(type as FortuneType);
}

export function buildShareUrl(baseUrl: string, data: FortuneResultData): string {
  const params = new URLSearchParams({
    type: data.fortuneType,
    label: data.label.slice(0, 30),
    summary: data.summary.slice(0, 80),
  });
  return `${baseUrl}/share?${params.toString()}`;
}

export function parseShareParams(
  searchParams: Record<string, string | string[] | undefined>
): FortuneResultData | null {
  const type = typeof searchParams.type === "string" ? searchParams.type : "";
  const label = typeof searchParams.label === "string" ? searchParams.label : "";

  if (!isValidFortuneType(type) || !label) {
    return null;
  }

  const summary = typeof searchParams.summary === "string" ? searchParams.summary : "";

  return {
    fortuneType: type,
    label: label.slice(0, 30),
    summary: summary.slice(0, 80),
  };
}
