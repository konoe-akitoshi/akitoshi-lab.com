export type TagKey =
  | 'education' | 'work' | 'internship' | 'award' | 'event'
  | 'speaking' | 'contest' | 'noc' | 'staff' | 'robotics'
  | 'network' | 'research' | 'ai';

export interface TimelineItem {
  title: string;
  sub: string;
  date: string;
  dateEnd?: string;
  tags: TagKey[];
  ongoing?: boolean;
  pickup?: boolean;
  url?: string;
}

export const tags: Record<TagKey, string> = {
  education: 'Education',
  work: 'Work',
  internship: 'Internship',
  award: 'Award',
  event: 'Event',
  speaking: 'Speaking',
  contest: 'Contest',
  noc: 'NOC',
  staff: 'Staff',
  robotics: 'Robotics',
  network: 'Network',
  research: 'Research',
  ai: 'AI',
};

export const items: TimelineItem[] = [
  { title: '電気通信大学', sub: '入学', date: '2022-04-01', tags: ['education'], ongoing: true },
  { title: '私立東山高等学校', sub: '卒業', date: '2022-03-01', tags: ['education'] },
  { title: '私立東山高等学校', sub: '入学', date: '2019-04-01', tags: ['education'] },
  { title: '京都市立近衛中学校', sub: '卒業', date: '2019-03-01', tags: ['education'] },
  { title: '京都市立近衛中学校', sub: '入学', date: '2016-04-01', tags: ['education'] },
  { title: '京都市立錦林小学校', sub: '卒業', date: '2016-03-01', tags: ['education'] },
  { title: '京都市立錦林小学校', sub: '入学', date: '2010-04-01', tags: ['education'] },
  { title: '電気通信大学 共創進化スマート社会実現機構', sub: '技術支援員', date: '2024-07-01', tags: ['work', 'network'], ongoing: true },
  { title: '株式会社インフォクラフト', sub: 'アルバイト勤務 サーバー管理業務', date: '2023-04-01', tags: ['work', 'network'], ongoing: true },
  { title: '株式会社サイバーエージェント', sub: 'インターン', date: '2025-07-01', tags: ['internship'] },
  { title: 'シスコシステムズ合同会社', sub: 'インターン', date: '2024-08-19', dateEnd: '2024-08-23', tags: ['internship', 'network'] },
  { title: '株式会社Turing', sub: 'インターン', date: '2023-08-01', tags: ['internship', 'ai'] },
  { title: 'JAWS DAYS 2026', sub: 'NOC', date: '2026-03-01', dateEnd: '2026-03-02', tags: ['event', 'staff', 'noc', 'network'] },
  { title: 'JANOG57', sub: 'NOC backboneチーム', date: '2026-02-05', dateEnd: '2026-02-07', tags: ['event', 'staff', 'noc', 'network'], pickup: true },
  { title: 'MMA創設50周年記念パーティー', sub: '実行委員＆NOC発起人', date: '2025-10-25', tags: ['event', 'staff', 'noc', 'network'] },
  { title: 'Observability Conference Tokyo 2025', sub: 'NOC', date: '2025-10-27', tags: ['event', 'staff', 'noc', 'network'] },
  { title: 'Platform Engineering Kaigi(PEK) 2025', sub: 'NOC', date: '2025-09-18', tags: ['event', 'staff', 'noc', 'network'] },
  { title: 'SRE NEXT 2025 IN TOKYO', sub: 'NOC', date: '2025-07-11', dateEnd: '2025-07-12', tags: ['event', 'staff', 'noc', 'network'] },
  { title: 'OisixのSREチームとの交流会 お野菜を添えて', sub: '登壇', date: '2025-07-15', tags: ['speaking', 'network'] },
  { title: 'MCP Ops LT大会！！！', sub: '登壇', date: '2025-06-15', tags: ['speaking', 'ai'] },
  { title: 'さくらのAI Meetup vol.10「MCP」', sub: '学内専用のチャットポットを作った話', date: '2025-05-15', tags: ['speaking', 'ai'] },
  { title: 'RoboCupper Online Meeting by Scramble #2', sub: '登壇', date: '2022-11-15', tags: ['speaking', 'robotics'] },
  { title: 'ICTSC 2025', sub: '1st Prize', date: '2026-03-08', dateEnd: '2026-03-09', tags: ['award', 'contest', 'network'], url: '/awards/ictsc-2025', pickup: true },
  { title: 'ICTSC 2024', sub: '4th', date: '2025-03-01', dateEnd: '2025-03-02', tags: ['award', 'contest', 'network'], url: '/awards/ictsc-2024' },
  { title: 'RobocupJuniorJapanOpen', sub: 'ロボット学会賞, デザイン賞', date: '2023-03-25', dateEnd: '2023-03-26', tags: ['award', 'contest', 'robotics'] },
  { title: 'Robocup Asia-Pacific (Junior Soccer Open)', sub: '2nd', date: '2021-11-22', dateEnd: '2021-11-28', tags: ['award', 'contest', 'robotics'] },
  { title: 'サイエンスキャッスル研究費 THK賞', sub: '採択「感情を汲み取る自立走行型配膳ロボットの開発」', date: '2021-06-01', tags: ['award', 'research', 'robotics'], url: '/awards/science-castle-thk-2021' },
  { title: 'FIRST Robotics Competition Infinite ReCharge', sub: 'Rookie Game Changer Award', date: '2021-05-20', dateEnd: '2021-05-23', tags: ['award', 'contest', 'robotics'] , pickup: true },
  { title: 'RoboCup World Wide (Junior Soccer Open)', sub: 'Best Team Description Paper Award, Individual 4th', date: '2021-04-01', tags: ['award', 'contest', 'robotics'], pickup: true },
  { title: 'RobocupJuniorJapanOpen', sub: 'Open 2位', date: '2021-03-28', dateEnd: '2021-03-29', tags: ['award', 'contest', 'robotics'] },
  { title: 'ロボカップジュニア・京滋奈ブロック大会', sub: 'Open 準優勝', date: '2021-01-10', tags: ['award', 'contest', 'robotics'] },
  { title: 'RoboMaster', sub: '2nd Prize', date: '2020-10-01', tags: ['award', 'contest', 'robotics'] , pickup: true },
  { title: 'RoboCupJunior Soccer Virtual Poster Session', sub: 'Most Popular Poster in Open', date: '2020-09-01', tags: ['award', 'contest', 'robotics'] },
  { title: '第64回日本学生科学賞', sub: '入選3等「自律走行システムの考案」', date: '2020-06-01', tags: ['award', 'contest', 'research', 'robotics'], url: '/awards/japan-student-science-prize-64th', pickup: true },
  { title: 'ロボカップジュニア・京滋奈ブロック大会', sub: 'Open 優勝', date: '2020-01-12', tags: ['award', 'contest', 'robotics'] },
  { title: '関西オープン', sub: 'Open 準優勝', date: '2019-06-15', tags: ['award', 'contest', 'robotics'] },
  { title: 'BIWAKOオープン', sub: 'LightWeight 4位', date: '2018-09-15', dateEnd: '2018-09-16', tags: ['award', 'contest', 'robotics'] },
  { title: 'せとうちオープン', sub: 'LightWeight 4位, SuperTeam 優勝', date: '2018-07-15', dateEnd: '2018-07-16', tags: ['award', 'contest', 'robotics'] },
  { title: 'ロボカップジュニア・ジャパンオープン2018和歌山', sub: 'NIPPON League サッカー ビギナーズ 予選12位', date: '2018-04-28', dateEnd: '2018-04-29', tags: ['award', 'contest', 'robotics'] },
  { title: 'SRC@国際ロボット展', sub: 'Classic部門 優勝', date: '2017-11-29', dateEnd: '2017-12-02', tags: ['award', 'contest', 'robotics'] },
  { title: 'SRC13', sub: '全国予選 8位', date: '2016-06-01', tags: ['award', 'contest', 'robotics'] },
  { title: '第53回自然科学観察コンクール', sub: '2等賞「オクラに見つけた水玉の正体」', date: '2012-06-01', tags: ['award', 'contest', 'research'], url: '/awards/shizen-kagaku-kansatsu-concours-53rd', pickup: true },
];

export function getYear(date: string): string {
  return date.split('-')[0];
}

export function formatMonth(date: string): string {
  return parseInt(date.split('-')[1]) + '月';
}

export function getPickupItems(): TimelineItem[] {
  return items.filter(i => i.pickup).sort((a, b) => b.date.localeCompare(a.date));
}
