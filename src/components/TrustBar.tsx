// 占処のトラストシグナル（信頼感を伝える控えめな一行）。
// 偽りの数値は使わず、事実ベースのメッセージのみで構成する。
// サーバーコンポーネント・Tailwindのみ・レスポンシブ（モバイル2列、デスクトップ4列）。
export default function TrustBar() {
  const items: { icon: string; label: string }[] = [
    { icon: "✨", label: "AI占い 6種類" },
    { icon: "🌅", label: "毎朝7時更新" },
    { icon: "🔒", label: "占い内容は保存されません" },
    { icon: "📱", label: "完全無料" },
  ];

  return (
    <section
      aria-label="占処の特徴"
      className="border-y border-gold/10 bg-[#0a0408]/80"
    >
      <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-y-3 px-4 py-4 text-center sm:grid-cols-4 sm:gap-y-0 sm:py-5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-center gap-1.5 text-[11px] tracking-wide text-gold/70 sm:text-xs"
          >
            <span aria-hidden="true" className="text-sm opacity-80">
              {item.icon}
            </span>
            <span className="text-warm/80">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
