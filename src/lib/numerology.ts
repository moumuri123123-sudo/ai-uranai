// ===== 数秘術（ライフパスナンバー算出） =====
//
// 生年月日（YYYY-MM-DD 形式など）からライフパスナンバーを計算します。
// マスターナンバー（11, 22, 33）はそのまま残します。
// 数字以外の文字は自動的に除去されるため、
// "2000-01-05" / "20000105" / "2000/01/05" など多様な形式を受け付けます。

export function calculateLifePath(birthDate: string): number {
  const digits = birthDate.replace(/\D/g, "");
  let sum = 0;
  for (const d of digits) {
    sum += parseInt(d, 10);
  }
  // マスターナンバー（11, 22, 33）をチェックしながら1桁にする
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    let newSum = 0;
    while (sum > 0) {
      newSum += sum % 10;
      sum = Math.floor(sum / 10);
    }
    sum = newSum;
  }
  return sum;
}
