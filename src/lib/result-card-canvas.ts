import type { FortuneResultData, FortuneType } from "./share-utils";
import { fortuneTypeNames, fortuneTypeIcons } from "./share-utils";

const WIDTH = 1200;
const HEIGHT = 630;

const accentColors: Record<FortuneType, string> = {
  tarot: "#ff2d55",
  zodiac: "#ffd700",
  compatibility: "#ff69b4",
  mbti: "#00ddff",
  dream: "#884898",
  numerology: "#f0a030",
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export async function generateResultCardImage(
  data: FortuneResultData
): Promise<Blob> {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;

  const accent = accentColors[data.fortuneType];
  const typeName = fortuneTypeNames[data.fortuneType];
  const icon = fortuneTypeIcons[data.fortuneType];

  // 背景グラデーション
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, "#0a0408");
  gradient.addColorStop(0.5, "#1a0a12");
  gradient.addColorStop(1, "#0a0408");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 外枠
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.shadowColor = hexToRgba(accent, 0.3);
  ctx.shadowBlur = 30;
  roundRect(ctx, 20, 20, WIDTH - 40, HEIGHT - 40, 8);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 内枠
  ctx.strokeStyle = hexToRgba(accent, 0.3);
  ctx.lineWidth = 1;
  roundRect(ctx, 36, 36, WIDTH - 72, HEIGHT - 72, 4);
  ctx.stroke();

  // 漢字アイコン（円形）
  const iconY = 140;
  ctx.beginPath();
  ctx.arc(WIDTH / 2, iconY, 36, 0, Math.PI * 2);
  ctx.strokeStyle = hexToRgba(accent, 0.5);
  ctx.lineWidth = 2;
  ctx.shadowColor = hexToRgba(accent, 0.2);
  ctx.shadowBlur = 20;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = accent;
  ctx.font = '32px "Yuji Syuku", serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(icon, WIDTH / 2, iconY);

  // 占いタイプ名
  ctx.fillStyle = "rgba(245,230,208,0.8)";
  ctx.font = '24px "Zen Maru Gothic", sans-serif';
  ctx.fillText(typeName, WIDTH / 2, iconY + 64);

  // 装飾ライン（上）
  const lineY = iconY + 92;
  ctx.strokeStyle = hexToRgba(accent, 0.3);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 140, lineY);
  ctx.lineTo(WIDTH / 2 - 20, lineY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 + 20, lineY);
  ctx.lineTo(WIDTH / 2 + 140, lineY);
  ctx.stroke();

  // 星マーク
  ctx.fillStyle = "rgba(255,215,0,0.5)";
  ctx.font = "18px serif";
  ctx.fillText("\u2726", WIDTH / 2, lineY);

  // メインラベル（カード名など）
  const labelY = lineY + 56;
  ctx.fillStyle = "#ffd700";
  ctx.shadowColor = "rgba(255,215,0,0.5)";
  ctx.shadowBlur = 40;
  ctx.font = '56px "Shippori Mincho B1", serif';
  ctx.fillText(data.label.slice(0, 30), WIDTH / 2, labelY);
  ctx.shadowBlur = 0;

  // 要約テキスト
  if (data.summary) {
    ctx.fillStyle = "rgba(245,230,208,0.75)";
    ctx.font = '20px "Zen Maru Gothic", sans-serif';
    const lines = wrapText(ctx, data.summary.slice(0, 80), 680);
    lines.forEach((line, i) => {
      ctx.fillText(line, WIDTH / 2, labelY + 50 + i * 32);
    });
  }

  // 下部装飾ライン
  const bottomLineY = HEIGHT - 80;
  ctx.strokeStyle = hexToRgba(accent, 0.2);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 100, bottomLineY);
  ctx.lineTo(WIDTH / 2 - 16, bottomLineY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 + 16, bottomLineY);
  ctx.lineTo(WIDTH / 2 + 100, bottomLineY);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,215,0,0.4)";
  ctx.font = "14px serif";
  ctx.fillText("\u2726", WIDTH / 2, bottomLineY);

  // サイト名
  ctx.fillStyle = "rgba(255,215,0,0.4)";
  ctx.font = '16px "Zen Maru Gothic", sans-serif';
  ctx.letterSpacing = "3px";
  ctx.fillText("占処 ── AI占い師", WIDTH / 2, HEIGHT - 50);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("画像の生成に失敗しました"));
      },
      "image/png"
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  let current = "";

  for (const char of text) {
    const test = current + char;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = char;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  return lines.slice(0, 3);
}
