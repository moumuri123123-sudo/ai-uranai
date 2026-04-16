// ===== 型定義 =====

export type FortuneType = "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology";

export interface FortuneRequest {
  type: FortuneType;
  question: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
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
}

export interface TarotCard {
  name: string;
  meaning: string;
  reversedMeaning: string;
}

export interface ZodiacSign {
  name: string;
  period: string;
  element: string;
  traits: string;
}

// ===== タロットカード（大アルカナ22枚） =====

export const tarotCards: TarotCard[] = [
  { name: "愚者", meaning: "自由、冒険、新たな始まり", reversedMeaning: "無計画、軽率、現実逃避" },
  { name: "魔術師", meaning: "才能、創造力、自信", reversedMeaning: "空回り、詐欺、未熟" },
  { name: "女教皇", meaning: "直感、神秘、内なる知恵", reversedMeaning: "秘密主義、冷淡、閉鎖的" },
  { name: "女帝", meaning: "豊穣、母性、愛情", reversedMeaning: "過保護、虚栄、停滞" },
  { name: "皇帝", meaning: "支配、権威、安定", reversedMeaning: "独裁、頑固、横暴" },
  { name: "教皇", meaning: "慈悲、教え、信頼", reversedMeaning: "偽善、束縛、形式主義" },
  { name: "恋人", meaning: "愛、選択、調和", reversedMeaning: "優柔不断、誘惑、不信" },
  { name: "戦車", meaning: "勝利、前進、意志の力", reversedMeaning: "暴走、挫折、方向喪失" },
  { name: "力", meaning: "勇気、忍耐、内なる強さ", reversedMeaning: "弱さ、自信喪失、衝動" },
  { name: "隠者", meaning: "内省、探求、真実", reversedMeaning: "孤立、閉じこもり、頑固" },
  { name: "運命の輪", meaning: "転機、幸運、チャンス", reversedMeaning: "不運、停滞、変化への恐れ" },
  { name: "正義", meaning: "公正、バランス、真実", reversedMeaning: "不公平、偏見、不正" },
  { name: "吊るされた男", meaning: "試練、忍耐、新たな視点", reversedMeaning: "無駄な犠牲、執着、徒労" },
  { name: "死神", meaning: "変容、再生、終わりと始まり", reversedMeaning: "停滞、恐怖、変化の拒否" },
  { name: "節制", meaning: "調和、バランス、適度", reversedMeaning: "不均衡、極端、浪費" },
  { name: "悪魔", meaning: "誘惑、束縛、欲望", reversedMeaning: "解放、目覚め、回復" },
  { name: "塔", meaning: "崩壊、衝撃、解放", reversedMeaning: "回避、先送り、小さな変化" },
  { name: "星", meaning: "希望、再生、インスピレーション", reversedMeaning: "失望、悲観、見失い" },
  { name: "月", meaning: "不安、幻想、潜在意識", reversedMeaning: "混乱の解消、真実の発見" },
  { name: "太陽", meaning: "成功、喜び、活力", reversedMeaning: "延期、自信過剰、一時的な曇り" },
  { name: "審判", meaning: "復活、覚醒、決断", reversedMeaning: "後悔、優柔不断、停滞" },
  { name: "世界", meaning: "完成、達成、統合", reversedMeaning: "未完成、中途半端、遅延" },
];

// ===== 12星座 =====

export const zodiacSigns: Record<string, ZodiacSign> = {
  aries: { name: "牡羊座", period: "3/21〜4/19", element: "火", traits: "情熱的で行動力があり、リーダーシップに優れる" },
  taurus: { name: "牡牛座", period: "4/20〜5/20", element: "地", traits: "忍耐強く穏やかで、美しいものを愛する" },
  gemini: { name: "双子座", period: "5/21〜6/21", element: "風", traits: "知的好奇心が旺盛で、コミュニケーション能力が高い" },
  cancer: { name: "蟹座", period: "6/22〜7/22", element: "水", traits: "感受性が豊かで、家庭や仲間を大切にする" },
  leo: { name: "獅子座", period: "7/23〜8/22", element: "火", traits: "華やかで自信に満ち、創造力に溢れる" },
  virgo: { name: "乙女座", period: "8/23〜9/22", element: "地", traits: "几帳面で分析力に優れ、人の役に立つことを喜ぶ" },
  libra: { name: "天秤座", period: "9/23〜10/23", element: "風", traits: "バランス感覚に優れ、美的センスと社交性を持つ" },
  scorpio: { name: "蠍座", period: "10/24〜11/22", element: "水", traits: "洞察力が鋭く、深い情熱と集中力を持つ" },
  sagittarius: { name: "射手座", period: "11/23〜12/21", element: "火", traits: "冒険心が旺盛で、自由と知識を愛する" },
  capricorn: { name: "山羊座", period: "12/22〜1/19", element: "地", traits: "真面目で責任感が強く、着実に目標を達成する" },
  aquarius: { name: "水瓶座", period: "1/20〜2/18", element: "風", traits: "独創的で革新的、自由な精神と博愛の心を持つ" },
  pisces: { name: "魚座", period: "2/19〜3/20", element: "水", traits: "共感力が高く、想像力豊かでロマンチスト" },
};

// ===== ユーティリティ =====

/** 配列からランダムに1つ選ぶ */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 正位置か逆位置をランダムに決める */
export function isReversed(): boolean {
  return Math.random() < 0.35;
}

// ===== モックレスポンス生成 =====

export function generateTarotReading(question: string): string {
  const card = pickRandom(tarotCards);
  const reversed = isReversed();
  const position = reversed ? "逆位置" : "正位置";
  const meaning = reversed ? card.reversedMeaning : card.meaning;

  const readings = [
    `カードをめくってみますね...\n\n出たのは『${card.name}』の${position}！\n\nキーワードは「${meaning}」だよ。\n\n「${question}」についてなんだけど、${
      reversed
        ? "ちょっと立ち止まって考えてみるのがいいかも。焦らなくて大丈夫！じっくりいこう。"
        : "いい感じの流れが来てるよ！ピンときたことがあれば、思い切ってやってみて。"
    }\n\n${
      reversed
        ? "今はちょっと大変かもしれないけど、この経験は絶対ムダにならないよ。応援してるね！"
        : "あなたなら大丈夫。自分を信じて進んでいこう！"
    }`,
    `カードをシャッフルしています...\n\n出ました。『${card.name}』の${position}です。\n\nこのカードのキーワードは「${meaning}」だよ。\n\n「${question}」についてだけど...\n\n${
      reversed
        ? "なんかモヤモヤしてない？でもそれって、次のステップに進むためのサインかも。無理しなくていいから、自分のペースで行こう！"
        : "いいね！今の方向性はバッチリだと思うよ。小さな一歩でも確実に前に進んでるから、自信持っていこう！"
    }\n\n何か気になることがあったらまた聞いてね！`,
  ];

  return pickRandom(readings);
}

export function generateZodiacReading(question: string, zodiacSign?: string): string {
  const sign = zodiacSign ? zodiacSigns[zodiacSign] : undefined;

  if (!sign) {
    const allSigns = Object.values(zodiacSigns);
    const randomSign = pickRandom(allSigns);
    return `あれ、星座が選ばれてないみたい。じゃあ${randomSign.name}で占ってみるね！\n\n${randomSign.name}（${randomSign.period}）の人は、${randomSign.traits}って言われてるよ。\n\n「${question}」についてだけど、今日はいつもと違うことを試してみるといいかも。ちょっとした変化が良い方向に転がるかもよ！`;
  }

  const forecasts = [
    `${sign.name}さん、こんにちは！\n\n${sign.traits}っていう${sign.name}の良さ、ちゃんと活かせてる？\n\n「${question}」についてだけど...\n\n今は${sign.element === "火" ? "やる気が湧いてくる時期" : sign.element === "地" ? "コツコツ積み上げたことが実を結ぶ時期" : sign.element === "風" ? "新しい出会いやチャンスが来やすい時期" : "自分の気持ちに素直になるといい時期"}みたいだよ！\n\n今週のラッキーデーは${sign.element === "火" ? "火曜日" : sign.element === "地" ? "土曜日" : sign.element === "風" ? "水曜日" : "月曜日"}。ラッキーカラーは${sign.element === "火" ? "赤" : sign.element === "地" ? "緑" : sign.element === "風" ? "黄色" : "青"}だよ！\n\n何か気になることがあったらまた聞いてね。`,
    `${sign.name}のあなた、今日の運勢をチェックしていこう！\n\n${sign.name}の人って${sign.traits}よね。その魅力が今まさに発揮される時！\n\n「${question}」についてなんだけど...\n\n${sign.element === "火" ? "思い立ったら即行動！その勢いが今は正解だよ。" : sign.element === "地" ? "焦らずマイペースでOK。じっくり進めた方がうまくいくよ。" : sign.element === "風" ? "周りの人との会話の中にヒントがあるかも。アンテナ張っておいてね！" : "直感を大事にして。「なんとなくこっち」っていう感覚、当たってると思うよ。"}\n\nいい流れが来てるから、楽しんでいこう！`,
  ];

  return pickRandom(forecasts);
}

// ===== MBTI 16タイプ =====

export interface MbtiType {
  code: string;
  name: string;
  traits: string;
  compatibleTypes: string[];
}

export const mbtiTypes: Record<string, MbtiType> = {
  INTJ: { code: "INTJ", name: "建築家", traits: "戦略的で独立心が強く、計画的に物事を進める完璧主義者", compatibleTypes: ["ENFP", "ENTP"] },
  INTP: { code: "INTP", name: "論理学者", traits: "知識欲が旺盛で革新的なアイデアを生み出す思索家", compatibleTypes: ["ENTJ", "ENFJ"] },
  ENTJ: { code: "ENTJ", name: "指揮官", traits: "決断力とリーダーシップに優れ、目標達成に全力を注ぐ", compatibleTypes: ["INTP", "INFP"] },
  ENTP: { code: "ENTP", name: "討論者", traits: "機知に富み、新しい挑戦と議論を楽しむ発明家タイプ", compatibleTypes: ["INTJ", "INFJ"] },
  INFJ: { code: "INFJ", name: "提唱者", traits: "理想主義で洞察力に優れ、人の成長を支援する", compatibleTypes: ["ENTP", "ENFP"] },
  INFP: { code: "INFP", name: "仲介者", traits: "豊かな想像力と深い共感力を持つ理想主義者", compatibleTypes: ["ENTJ", "ENFJ"] },
  ENFJ: { code: "ENFJ", name: "主人公", traits: "カリスマ性があり、人を導き励ますことに喜びを感じる", compatibleTypes: ["INTP", "INFP"] },
  ENFP: { code: "ENFP", name: "広報運動家", traits: "情熱的で創造力豊か、人とのつながりを大切にする", compatibleTypes: ["INTJ", "INFJ"] },
  ISTJ: { code: "ISTJ", name: "管理者", traits: "責任感が強く誠実で、伝統と秩序を重んじる", compatibleTypes: ["ESFP", "ESTP"] },
  ISFJ: { code: "ISFJ", name: "擁護者", traits: "献身的で温かく、周囲の人を守ることに使命感を持つ", compatibleTypes: ["ESFP", "ESTP"] },
  ESTJ: { code: "ESTJ", name: "幹部", traits: "組織力と実行力に優れ、ルールと効率を重視する", compatibleTypes: ["ISFP", "ISTP"] },
  ESFJ: { code: "ESFJ", name: "領事官", traits: "社交的で面倒見がよく、調和とチームワークを大切にする", compatibleTypes: ["ISFP", "ISTP"] },
  ISTP: { code: "ISTP", name: "巨匠", traits: "冷静で実践的、問題解決能力と適応力に優れる", compatibleTypes: ["ESTJ", "ESFJ"] },
  ISFP: { code: "ISFP", name: "冒険家", traits: "感受性が豊かで芸術的センスを持つ自由な魂", compatibleTypes: ["ESTJ", "ESFJ"] },
  ESTP: { code: "ESTP", name: "起業家", traits: "行動力があり社交的、リスクを恐れずチャンスを掴む", compatibleTypes: ["ISTJ", "ISFJ"] },
  ESFP: { code: "ESFP", name: "エンターテイナー", traits: "明るく陽気で、周囲を楽しませることが得意", compatibleTypes: ["ISTJ", "ISFJ"] },
};

// ===== MBTI診断用の質問（10問） =====

export interface MbtiQuestion {
  question: string;
  axis: "EI" | "SN" | "TF" | "JP";
  choiceA: string; // Aを選ぶと E, S, T, J 寄り
  choiceB: string; // Bを選ぶと I, N, F, P 寄り
}

export const mbtiQuestions: MbtiQuestion[] = [
  // E/I（外向/内向）: 3問
  { question: "休日の過ごし方は？", axis: "EI", choiceA: "友達と出かける", choiceB: "家でゆっくり過ごす" },
  { question: "初対面の人と話すのは？", axis: "EI", choiceA: "わりと平気、楽しい", choiceB: "ちょっと緊張する" },
  { question: "考えを整理するとき", axis: "EI", choiceA: "誰かに話しながら考える", choiceB: "一人で静かに考える" },
  // S/N（感覚/直感）: 2問
  { question: "仕事や勉強で重視するのは？", axis: "SN", choiceA: "具体的な事実やデータ", choiceB: "全体の流れや可能性" },
  { question: "旅行の計画を立てるとき", axis: "SN", choiceA: "細かくスケジュールを決める", choiceB: "大まかに決めてあとは気分で" },
  // T/F（思考/感情）: 3問
  { question: "友達が悩んでいるとき", axis: "TF", choiceA: "解決策を一緒に考える", choiceB: "まず気持ちに寄り添う" },
  { question: "大事な決断をするとき", axis: "TF", choiceA: "論理的にメリット・デメリットを分析", choiceB: "自分の気持ちや価値観を大切にする" },
  { question: "議論で意見が対立したら", axis: "TF", choiceA: "正しさを追求したい", choiceB: "相手との関係を大事にしたい" },
  // J/P（判断/知覚）: 2問
  { question: "締め切りがあるとき", axis: "JP", choiceA: "早めに取りかかって余裕を持つ", choiceB: "ギリギリでもなんとかなる派" },
  { question: "予定が急に変わったら", axis: "JP", choiceA: "ちょっとストレスを感じる", choiceB: "臨機応変に楽しめる" },
];

// ===== MBTIフォールバック =====

export function generateMbtiReading(question: string, mbtiType?: string): string {
  const typeData = mbtiType ? mbtiTypes[mbtiType] : undefined;

  if (!typeData) {
    return `MBTIタイプが指定されていないみたいだけど、大丈夫！\n\n「${question}」についてだけど...\n\n自分を知ることは、より良い人生を歩む第一歩だよ。まずは診断してみて、自分のタイプを知ってみよう！きっと新しい発見があるはず。`;
  }

  const compatible = typeData.compatibleTypes.map(c => `${c}（${mbtiTypes[c]?.name}）`).join("、");

  const readings = [
    `あなたは ${typeData.code}（${typeData.name}）タイプだね！\n\n${typeData.traits}っていう特徴があるよ。\n\n「${question}」についてだけど...\n\n${typeData.code}タイプの強みを活かすのがポイント！自分の特性を理解して行動すると、驚くほどうまくいくことがあるよ。\n\n相性がいいタイプは ${compatible} だよ。気になる人がいたらチェックしてみてね！`,
    `${typeData.code}（${typeData.name}）さん、こんにちは！\n\n${typeData.traits}というのがあなたの持ち味だね。\n\n「${question}」についてなんだけど...\n\n自分のタイプを知っているのは大きなアドバンテージだよ。${typeData.code}ならではの視点や感性を大切にして進んでいこう！\n\nちなみに、${compatible} との相性がバッチリだから、周りにいたら仲良くなってみて！`,
  ];

  return pickRandom(readings);
}

export function generateDreamReading(question: string, dreamKeyword?: string): string {
  const keyword = dreamKeyword || "不思議な夢";
  const readings = [
    `「${keyword}」の夢を見たんだね。\n\nこの夢にはあなたの深層心理が映し出されていますよ。${keyword}は、心の中で変化を求めているサインかもしれません。\n\n「${question}」についてですが、この夢は前向きな変化の前触れです。自分の直感を信じて、新しい一歩を踏み出してみてください。きっといい方向に進みますよ。`,
    `「${keyword}」の夢ですか、興味深いですね。\n\nこの夢は、あなたの心が何か大切なことを伝えようとしている証拠です。${keyword}には自己成長や内面の声というメッセージが込められています。\n\n「${question}」についてですが、今は自分と向き合う時期です。焦らずに、心の声に耳を傾けてみてくださいね。`,
  ];
  return pickRandom(readings);
}

export function generateNumerologyReading(question: string, birthDate?: string): string {
  const date = birthDate || "不明";
  const readings = [
    `生年月日${date}から導き出されたあなたの運命の数字を見てみましょう。\n\nあなたには独自の才能と使命があります。この数字はあなたの人生の道しるべとなるものです。\n\n「${question}」についてですが、数秘術が示すのは「自分らしさを大切に」ということ。周りに流されず、あなた自身のペースで進むことが幸運を引き寄せます。`,
    `${date}生まれのあなたの数秘を読み解きますね。\n\nあなたの持つエネルギーはとてもユニークです。この数字が示す特性を活かすことで、人生がより豊かになりますよ。\n\n「${question}」についてですが、今のあなたに必要なのは自分への信頼です。数秘が教えてくれるのは、あなたにはすでに答えが備わっているということ。自信を持って進んでください。`,
  ];
  return pickRandom(readings);
}

export function generateCompatibilityReading(question: string, person1?: string, person2?: string): string {
  const name1 = person1 || "あなた";
  const name2 = person2 || "お相手";

  const score = Math.floor(Math.random() * 41) + 60; // 60-100

  const readings = [
    `${name1}さんと${name2}さんの相性、見てみるね...\n\nドキドキ...相性度は ${score}%！\n\n${
      score >= 90
        ? "めちゃくちゃいい相性じゃん！一緒にいると自然体でいられるタイプだね。お互いにいい影響を与え合えるよ。"
        : score >= 80
          ? "かなりいい相性だね！お互いの良いところを引き出せる関係。たまにはちゃんと気持ちを伝えると、もっと仲良くなれるよ。"
          : score >= 70
            ? "なかなかいい感じ！考え方が違うところもあるけど、それが逆にいいバランスになってるよ。違いを楽しめると最強だね。"
            : "悪くないよ！タイプは違うけど、だからこそ一緒にいて飽きない関係になれるかも。お互いの「違い」を面白がれるかがポイントだね。"
    }\n\n「${question}」についてだけど、二人にはまだまだ伸びしろがあるよ。気負わず自然体でいくのが一番！`,
    `${name1}さんと${name2}さんの相性チェック、いってみよう！\n\n結果は... ${score}%！\n\n${
      score >= 85
        ? `${name1}さんと${name2}さん、一緒にいるとお互い元気になれるタイプだね。周りから見ても「いいコンビだな〜」って思われてるかも！`
        : `${name1}さんと${name2}さんは、お互いに持ってないものを持ってる感じ。「自分にはないな〜」って思うところが実は魅力なんだよね。`
    }\n\n「${question}」についてだけど...\n\n思ってることはちゃんと言葉にするのが大事！「言わなくてもわかるでしょ」はすれ違いのもとだよ。素直に伝えてみて！`,
  ];

  return pickRandom(readings);
}
