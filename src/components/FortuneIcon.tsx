type FortuneIconProps = {
  type: "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology" | "ai" | "clock" | "lock";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const icons: Record<string, { char: string; color: string; glow: string; label: string }> = {
  tarot: { char: "札", color: "text-neon-red", glow: "shadow-neon-red/30", label: "タロット" },
  zodiac: { char: "星", color: "text-gold", glow: "shadow-gold/30", label: "星座" },
  compatibility: { char: "縁", color: "text-neon-pink", glow: "shadow-neon-pink/30", label: "相性" },
  mbti: { char: "心", color: "text-neon-cyan", glow: "shadow-neon-cyan/30", label: "MBTI" },
  dream: { char: "夢", color: "text-neon-purple", glow: "shadow-neon-purple/30", label: "夢" },
  numerology: { char: "数", color: "text-neon-amber", glow: "shadow-neon-amber/30", label: "数秘術" },
  ai: { char: "智", color: "text-gold", glow: "shadow-gold/30", label: "AI" },
  clock: { char: "刻", color: "text-gold", glow: "shadow-gold/30", label: "時刻" },
  lock: { char: "秘", color: "text-gold", glow: "shadow-gold/30", label: "秘密" },
};

const sizes = {
  sm: "h-11 w-11 text-lg",
  md: "h-14 w-14 text-2xl",
  lg: "h-20 w-20 text-4xl",
};

export default function FortuneIcon({
  type,
  size = "lg",
  className = "",
}: FortuneIconProps) {
  const icon = icons[type];
  if (!icon) return null;

  return (
    <div
      role="img"
      aria-label={`${icon.label}アイコン`}
      className={`mx-auto flex items-center justify-center rounded-full border border-border bg-surface shadow-lg ${icon.glow} ${sizes[size]} ${className}`}
    >
      <span className={`font-yuji ${icon.color}`} aria-hidden="true">{icon.char}</span>
    </div>
  );
}
