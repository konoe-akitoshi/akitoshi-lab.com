// Googleロケーション履歴（2018-09〜のエクスポート）と timeline.ts のイベント開催地から生成。
// 再生成: scratchpad/gen-visits.ts 参照。手で編集してもよい（次回生成時は上書き注意）。

export type VisitType = 'travel' | 'work' | 'both';

export interface VisitNote {
  date: string;
  description: string;
}

export interface VisitInfo {
  prefecture: string;
  type: VisitType;
  notes?: VisitNote[];
}

export const prefectureNames: Record<number, string> = {
  1: '北海道', 2: '青森県', 3: '岩手県', 4: '宮城県', 5: '秋田県',
  6: '山形県', 7: '福島県', 8: '茨城県', 9: '栃木県', 10: '群馬県',
  11: '埼玉県', 12: '千葉県', 13: '東京都', 14: '神奈川県', 15: '新潟県',
  16: '富山県', 17: '石川県', 18: '福井県', 19: '山梨県', 20: '長野県',
  21: '岐阜県', 22: '静岡県', 23: '愛知県', 24: '三重県', 25: '滋賀県',
  26: '京都府', 27: '大阪府', 28: '兵庫県', 29: '奈良県', 30: '和歌山県',
  31: '鳥取県', 32: '島根県', 33: '岡山県', 34: '広島県', 35: '山口県',
  36: '徳島県', 37: '香川県', 38: '愛媛県', 39: '高知県', 40: '福岡県',
  41: '佐賀県', 42: '長崎県', 43: '熊本県', 44: '大分県', 45: '宮崎県',
  46: '鹿児島県', 47: '沖縄県',
};

export const visits: VisitInfo[] = [
  {
    prefecture: '北海道',
    type: 'travel',
    notes: [
      { date: '2023-08', description: '初記録' },
      { date: '2024-09', description: '直近の記録（のべ9日）' },
    ],
  },
  {
    prefecture: '宮城県',
    type: 'travel',
    notes: [
      { date: '2023-09', description: '訪問（のべ1日）' },
    ],
  },
  {
    prefecture: '福島県',
    type: 'travel',
    notes: [
      { date: '2022-09', description: '訪問（のべ3日）' },
    ],
  },
  {
    prefecture: '栃木県',
    type: 'travel',
    notes: [
      { date: '2022-09', description: '初記録' },
      { date: '2023-09', description: '直近の記録（のべ3日）' },
    ],
  },
  {
    prefecture: '群馬県',
    type: 'travel',
    notes: [
      { date: '2024-03', description: '訪問（のべ1日）' },
    ],
  },
  {
    prefecture: '埼玉県',
    type: 'travel',
    notes: [
      { date: '2023-09', description: '初記録' },
      { date: '2024-12', description: '直近の記録（のべ3日）' },
    ],
  },
  {
    prefecture: '千葉県',
    type: 'travel',
    notes: [
      { date: '2023-04', description: '初記録' },
      { date: '2024-09', description: '直近の記録（のべ8日）' },
    ],
  },
  {
    prefecture: '東京都',
    type: 'both',
    notes: [
      { date: '2022-04', description: '上京・電気通信大学入学' },
      { date: '2024-12', description: 'ロケーション履歴 のべ830日' },
      { date: '2026-03', description: 'ICTSC 2025' },
      { date: '2026-03', description: 'JAWS DAYS 2026' },
    ],
  },
  {
    prefecture: '神奈川県',
    type: 'both',
    notes: [
      { date: '2022-09', description: '初記録' },
      { date: '2024-09', description: '直近の記録（のべ16日）' },
      { date: '2026-07', description: 'KubeCon + CloudNativeCon Japan 2026' },
    ],
  },
  {
    prefecture: '新潟県',
    type: 'travel',
    notes: [
      { date: '2024-03', description: '訪問（のべ2日）' },
    ],
  },
  {
    prefecture: '富山県',
    type: 'travel',
    notes: [
      { date: '2024-08', description: '訪問（のべ1日）' },
    ],
  },
  {
    prefecture: '石川県',
    type: 'travel',
    notes: [
      { date: '2022-09', description: '訪問（のべ2日）' },
    ],
  },
  {
    prefecture: '福井県',
    type: 'travel',
    notes: [
      { date: '2022-09', description: '訪問（のべ3日）' },
    ],
  },
  {
    prefecture: '山梨県',
    type: 'travel',
    notes: [
      { date: '2023-08', description: '初記録' },
      { date: '2024-10', description: '直近の記録（のべ6日）' },
    ],
  },
  {
    prefecture: '長野県',
    type: 'travel',
    notes: [
      { date: '2022-04', description: '初記録' },
      { date: '2024-12', description: '直近の記録（のべ5日）' },
    ],
  },
  {
    prefecture: '岐阜県',
    type: 'travel',
    notes: [
      { date: '2022-04', description: '訪問（のべ1日）' },
    ],
  },
  {
    prefecture: '静岡県',
    type: 'travel',
    notes: [
      { date: '2023-09', description: '初記録' },
      { date: '2024-09', description: '直近の記録（のべ6日）' },
    ],
  },
  {
    prefecture: '愛知県',
    type: 'both',
    notes: [
      { date: '2021-11', description: '初記録' },
      { date: '2024-03', description: '直近の記録（のべ5日）' },
      { date: '2026-05', description: 'クラウドネイティブ会議' },
    ],
  },
  {
    prefecture: '三重県',
    type: 'travel',
    notes: [
      { date: '2019-05', description: '初記録' },
      { date: '2023-05', description: '直近の記録（のべ2日）' },
    ],
  },
  {
    prefecture: '滋賀県',
    type: 'both',
    notes: [
      { date: '2018-09', description: '初記録' },
      { date: '2018-09', description: 'BIWAKOオープン' },
      { date: '2024-09', description: '直近の記録（のべ23日）' },
    ],
  },
  {
    prefecture: '京都府',
    type: 'both',
    notes: [
      { date: '2003-11', description: '出身・実家' },
      { date: '2021-01', description: 'ロボカップジュニア・京滋奈ブロック大会' },
      { date: '2022-03', description: '私立東山高等学校' },
      { date: '2024-10', description: 'ロケーション履歴 のべ1067日' },
    ],
  },
  {
    prefecture: '大阪府',
    type: 'both',
    notes: [
      { date: '2019-02', description: '初記録' },
      { date: '2024-03', description: '直近の記録（のべ12日）' },
      { date: '2026-02', description: 'JANOG57' },
    ],
  },
  {
    prefecture: '兵庫県',
    type: 'travel',
    notes: [
      { date: '2019-03', description: '初記録' },
      { date: '2024-10', description: '直近の記録（のべ9日）' },
    ],
  },
  {
    prefecture: '奈良県',
    type: 'travel',
    notes: [
      { date: '2018-12', description: '訪問（のべ1日）' },
    ],
  },
  {
    prefecture: '和歌山県',
    type: 'both',
    notes: [
      { date: '2018-04', description: 'ロボカップジュニア・ジャパンオープン2018和歌山' },
      { date: '2019-04', description: '初記録' },
      { date: '2019-05', description: '直近の記録（のべ5日）' },
    ],
  },
  {
    prefecture: '岡山県',
    type: 'travel',
    notes: [
      { date: '2020-01', description: '初記録' },
      { date: '2022-03', description: '直近の記録（のべ4日）' },
    ],
  },
  {
    prefecture: '広島県',
    type: 'travel',
    notes: [
      { date: '2019-03', description: '初記録' },
      { date: '2019-06', description: '直近の記録（のべ3日）' },
    ],
  },
  {
    prefecture: '徳島県',
    type: 'travel',
    notes: [
      { date: '2023-09', description: '訪問（のべ2日）' },
    ],
  },
  {
    prefecture: '香川県',
    type: 'travel',
    notes: [
      { date: '2019-03', description: '訪問（のべ1日）' },
    ],
  },
  {
    prefecture: '愛媛県',
    type: 'both',
    notes: [
      { date: '2019-03', description: '初記録' },
      { date: '2023-09', description: '直近の記録（のべ10日）' },
      { date: '2026-07', description: 'JANOG58' },
    ],
  },
];

export function getVisitInfo(prefecture: string): VisitInfo | undefined {
  return visits.find((v) => v.prefecture === prefecture);
}

export function getVisitedCount(): number {
  return visits.length;
}

export function getTypeLabel(type: VisitType): string {
  switch (type) {
    case 'travel':
      return '旅行';
    case 'work':
      return '仕事';
    case 'both':
      return '旅行・仕事';
  }
}
