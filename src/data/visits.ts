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
    prefecture: '東京都',
    type: 'both',
    notes: [
      { date: '2023-04', description: '上京・大学院進学' },
      { date: '2024-06', description: 'インターン勤務開始' },
    ],
  },
  {
    prefecture: '京都府',
    type: 'both',
    notes: [
      { date: '2019-04', description: '大学入学' },
      { date: '2023-03', description: '大学卒業' },
    ],
  },
  {
    prefecture: '大阪府',
    type: 'travel',
    notes: [
      { date: '2020-02', description: '友人と日帰り旅行' },
      { date: '2022-08', description: '技術カンファレンス参加' },
    ],
  },
  {
    prefecture: '奈良県',
    type: 'travel',
    notes: [
      { date: '2020-11', description: '紅葉シーズンに訪問' },
    ],
  },
  {
    prefecture: '兵庫県',
    type: 'travel',
    notes: [
      { date: '2021-05', description: '神戸観光' },
    ],
  },
  {
    prefecture: '滋賀県',
    type: 'travel',
    notes: [
      { date: '2021-09', description: '琵琶湖一周サイクリング' },
    ],
  },
  {
    prefecture: '神奈川県',
    type: 'travel',
    notes: [
      { date: '2023-07', description: '鎌倉・江ノ島' },
      { date: '2024-01', description: '横浜中華街' },
    ],
  },
  {
    prefecture: '千葉県',
    type: 'travel',
    notes: [
      { date: '2023-12', description: '成田空港経由' },
    ],
  },
  {
    prefecture: '埼玉県',
    type: 'travel',
    notes: [
      { date: '2024-03', description: '川越散策' },
    ],
  },
  {
    prefecture: '愛知県',
    type: 'work',
    notes: [
      { date: '2022-11', description: 'ロボコン全国大会' },
    ],
  },
  {
    prefecture: '静岡県',
    type: 'travel',
    notes: [
      { date: '2023-08', description: '熱海温泉旅行' },
    ],
  },
  {
    prefecture: '北海道',
    type: 'travel',
    notes: [
      { date: '2022-02', description: '札幌雪まつり' },
    ],
  },
  {
    prefecture: '福岡県',
    type: 'work',
    notes: [
      { date: '2024-05', description: 'ICTSC本選' },
    ],
  },
  {
    prefecture: '広島県',
    type: 'travel',
    notes: [
      { date: '2021-03', description: '宮島・原爆ドーム' },
    ],
  },
  {
    prefecture: '石川県',
    type: 'travel',
    notes: [
      { date: '2022-09', description: '金沢21世紀美術館' },
    ],
  },
  {
    prefecture: '宮城県',
    type: 'work',
    notes: [
      { date: '2024-08', description: 'セキュリティキャンプ' },
    ],
  },
  {
    prefecture: '三重県',
    type: 'travel',
    notes: [
      { date: '2020-01', description: '伊勢神宮参拝' },
    ],
  },
  {
    prefecture: '和歌山県',
    type: 'travel',
    notes: [
      { date: '2021-08', description: '白浜温泉' },
    ],
  },
  {
    prefecture: '岡山県',
    type: 'travel',
    notes: [
      { date: '2021-03', description: '倉敷美観地区' },
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
