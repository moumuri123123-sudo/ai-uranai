type FortuneIconProps = {
  type: "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology" | "ai" | "clock" | "lock";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const icons: Record<string, { char: string; color: string; glow: string }> = {
  tarot: { char: "札", color: "text-neon-red", glow: "shadow-neon-red/30" },
  zodiac: { char: "星", color: "text-gold", glow: "shadow-gold/30" },
  compatibility: { char: "縁", color: "text-neon-pink", glow: "shadow-neon-pink/30" },
  mbti: { char: "心", color: "text-neon-cyan", glow: "shadow-neon-cyan/30" },
  dream: { char: "夢", color: "text-neon-purple", glow: "shadow-neon-purple/30" },
  numerology: { char: "数", color: "text-neon-amber", glow: "shadow-neon-amber/30" },
  ai: { char: "智", color: "text-gold", glow: "shadow-gold/30" },
  clock: { char: "刻", color: "text-gold", glow: "shadow-gold/30" },
  lock: { char: "秘", color: "text-gold", glow: "shadow-gold/30" },
};

const sizes = {
  sm: "h-10 w-10 text-lg",
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
      className={`mx-auto flex items-center justify-center rounded-full border border-border bg-surface shadow-lg ${icon.glow} ${sizes[size]} ${className}`}
    >
      <span className={`font-yuji ${icon.color}`}>{icon.char}</span>
    </div>
  );
}
