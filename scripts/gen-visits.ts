// Googleロケーション履歴 (Googleマップアプリの「タイムラインのエクスポート」timeline.json)
// から都道府県滞在を集計し、src/data/timeline.ts のイベント開催地(pref)とマージして
// src/data/visits.ts を生成する。
//
// 座標データはローカル処理のみ。リポジトリへ書き出されるのは県レベルの集計だけ。
//
// 使い方:
//   bun scripts/gen-visits.ts <timeline.json> <japan.geojson>            # ドライラン
//   bun scripts/gen-visits.ts <timeline.json> <japan.geojson> --write    # visits.ts 生成
//
// japan.geojson は https://github.com/dataofjapan/land の japan.geojson
// (47 features, properties: nam_ja / id) を使う。

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { items } from '../src/data/timeline';

const [timelinePath, geojsonPath] = process.argv.slice(2);
const WRITE = process.argv.includes('--write');
if (!timelinePath || !geojsonPath) {
  console.error('usage: bun scripts/gen-visits.ts <timeline.json> <japan.geojson> [--write]');
  process.exit(1);
}
const REPO = join(import.meta.dir, '..');

// ---------- 県ポリゴン ----------
type Ring = [number, number][];
interface PrefFeature {
  name: string;
  code: number;
  polys: Ring[][]; // MultiPolygon: polys[i][0]=外周, [i][1..]=穴
  bbox: [number, number, number, number]; // minLng, minLat, maxLng, maxLat
}

const geo = JSON.parse(readFileSync(geojsonPath, 'utf8'));
const prefs: PrefFeature[] = geo.features.map((f: any) => {
  const polys: Ring[][] = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let minLng = 180, minLat = 90, maxLng = -180, maxLat = -90;
  for (const poly of polys) for (const [lng, lat] of poly[0]) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }
  return { name: f.properties.nam_ja, code: f.properties.id, polys, bbox: [minLng, minLat, maxLng, maxLat] };
});

function inRing(lng: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const memo = new Map<string, string | null>();
function classify(lng: number, lat: number): string | null {
  if (lng < 122 || lng > 147 || lat < 24 || lat > 46) return null; // 国外
  const key = `${lng.toFixed(3)},${lat.toFixed(3)}`;
  if (memo.has(key)) return memo.get(key)!;
  let found: string | null = null;
  for (const p of prefs) {
    const [a, b, c, d] = p.bbox;
    if (lng < a || lng > c || lat < b || lat > d) continue;
    for (const poly of p.polys) {
      if (inRing(lng, lat, poly[0])) {
        let inHole = false;
        for (let k = 1; k < poly.length; k++) if (inRing(lng, lat, poly[k])) { inHole = true; break; }
        if (!inHole) { found = p.name; break; }
      }
    }
    if (found) break;
  }
  memo.set(key, found);
  return found;
}

// ---------- ロケーション履歴 ----------
const data = JSON.parse(readFileSync(timelinePath, 'utf8'));
const segs: any[] = data.semanticSegments ?? [];

const LATLNG_RE = /(-?\d+\.\d+)°,\s*(-?\d+\.\d+)°/g;

const visitDays = new Map<string, Set<string>>(); // pref -> YYYY-MM-DD
const transitDays = new Map<string, Set<string>>();
let visitCount = 0, pointCount = 0, abroad = 0;

function add(map: Map<string, Set<string>>, pref: string, day: string) {
  if (!map.has(pref)) map.set(pref, new Set());
  map.get(pref)!.add(day);
}

for (const seg of segs) {
  const day = (seg.startTime ?? '').slice(0, 10);
  if (!day) continue;

  if (seg.visit) {
    const prob = seg.visit.probability ?? 1;
    const latLng = seg.visit.topCandidate?.placeLocation?.latLng ?? '';
    const m = /(-?\d+\.\d+)°,\s*(-?\d+\.\d+)°/.exec(latLng);
    if (m && prob >= 0.3) {
      const pref = classify(parseFloat(m[2]), parseFloat(m[1]));
      visitCount++;
      if (pref) add(visitDays, pref, day);
      else abroad++;
    }
    continue;
  }

  // 移動系セグメント（timelinePath / activity）: 形式差異に強いよう文字列から座標を抽出
  const str = JSON.stringify(seg);
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = LATLNG_RE.exec(str)) !== null) {
    if (i++ % 3 !== 0) continue; // 間引き
    pointCount++;
    const pref = classify(parseFloat(m[2]), parseFloat(m[1]));
    if (pref) add(transitDays, pref, day);
  }
}

// ---------- 集計表示 ----------
const codeOf = new Map(prefs.map((p) => [p.name, p.code]));
const summary = [...visitDays.entries()]
  .map(([pref, days]) => {
    const sorted = [...days].sort();
    return { pref, days: days.size, first: sorted[0], last: sorted[sorted.length - 1] };
  })
  .sort((a, b) => (codeOf.get(a.pref) ?? 99) - (codeOf.get(b.pref) ?? 99));

console.log('=== 滞在（visitセグメント）ベース ===');
for (const s of summary) {
  console.log(`${String(codeOf.get(s.pref)).padStart(2)} ${s.pref.padEnd(5, '　')} ${String(s.days).padStart(4)}日  ${s.first} 〜 ${s.last}`);
}

const transitOnly = [...transitDays.keys()].filter((p) => !visitDays.has(p))
  .sort((a, b) => (codeOf.get(a) ?? 99) - (codeOf.get(b) ?? 99));
console.log(`\n通過のみ（滞在記録なし）: ${transitOnly.join('、') || 'なし'}`);
console.log(`\nvisitセグメント: ${visitCount} / 移動点(間引後): ${pointCount} / 日本国外・海上: ${abroad}`);

if (!WRITE) {
  console.log('\n(--write で src/data/visits.ts を生成)');
  process.exit(0);
}

// ---------- visits.ts 生成 ----------
interface CareerEvent { title: string; date: string }
const careerByPref = new Map<string, CareerEvent[]>();
for (const it of items) {
  if (!it.pref) continue;
  if (!careerByPref.has(it.pref)) careerByPref.set(it.pref, []);
  careerByPref.get(it.pref)!.push({ title: it.title, date: it.date });
}
for (const evs of careerByPref.values()) evs.sort((a, b) => b.date.localeCompare(a.date));

const allPrefs = new Set<string>([...visitDays.keys(), ...careerByPref.keys()]);

interface Note { date: string; description: string }
interface Visit { prefecture: string; type: 'travel' | 'work' | 'both'; notes: Note[] }

const visits: Visit[] = [...allPrefs]
  .sort((a, b) => (codeOf.get(a) ?? 99) - (codeOf.get(b) ?? 99))
  .map((pref) => {
    const days = visitDays.get(pref);
    const career = careerByPref.get(pref) ?? [];
    const notes: Note[] = [];
    let type: Visit['type'];

    if (pref === '東京都') {
      type = 'both';
      notes.push({ date: '2022-04', description: '上京・電気通信大学入学' });
    } else if (pref === '京都府') {
      type = 'both';
      notes.push({ date: '2003-11', description: '出身・実家' });
    } else {
      type = days && career.length > 0 ? 'both' : days ? 'travel' : 'work';
    }

    if (days && pref !== '東京都' && pref !== '京都府') {
      const sorted = [...days].sort();
      const first = sorted[0].slice(0, 7);
      const last = sorted[sorted.length - 1].slice(0, 7);
      if (first === last) {
        notes.push({ date: first, description: `訪問（のべ${days.size}日）` });
      } else {
        notes.push({ date: first, description: '初記録' });
        notes.push({ date: last, description: `直近の記録（のべ${days.size}日）` });
      }
    }
    if (days && (pref === '東京都' || pref === '京都府')) {
      notes.push({ date: [...days].sort()[days.size - 1].slice(0, 7), description: `ロケーション履歴 のべ${days.size}日` });
    }

    for (const ev of career.slice(0, 2)) {
      notes.push({ date: ev.date.slice(0, 7), description: ev.title });
    }

    notes.sort((a, b) => a.date.localeCompare(b.date));
    return { prefecture: pref, type, notes };
  });

const esc = (s: string) => s.replace(/'/g, "\\'");
const lines: string[] = [];
lines.push('// Googleロケーション履歴（2018-09〜のエクスポート）と timeline.ts のイベント開催地から生成。');
lines.push('// 再生成: bun scripts/gen-visits.ts <timeline.json> <japan.geojson> --write');
lines.push('// 手で編集してもよい（次回生成時は上書きに注意）。');
lines.push('');
lines.push("export type VisitType = 'travel' | 'work' | 'both';");
lines.push('');
lines.push('export interface VisitNote {');
lines.push('  date: string;');
lines.push('  description: string;');
lines.push('}');
lines.push('');
lines.push('export interface VisitInfo {');
lines.push('  prefecture: string;');
lines.push('  type: VisitType;');
lines.push('  notes?: VisitNote[];');
lines.push('}');
lines.push('');
lines.push('export const prefectureNames: Record<number, string> = {');
lines.push("  1: '北海道', 2: '青森県', 3: '岩手県', 4: '宮城県', 5: '秋田県',");
lines.push("  6: '山形県', 7: '福島県', 8: '茨城県', 9: '栃木県', 10: '群馬県',");
lines.push("  11: '埼玉県', 12: '千葉県', 13: '東京都', 14: '神奈川県', 15: '新潟県',");
lines.push("  16: '富山県', 17: '石川県', 18: '福井県', 19: '山梨県', 20: '長野県',");
lines.push("  21: '岐阜県', 22: '静岡県', 23: '愛知県', 24: '三重県', 25: '滋賀県',");
lines.push("  26: '京都府', 27: '大阪府', 28: '兵庫県', 29: '奈良県', 30: '和歌山県',");
lines.push("  31: '鳥取県', 32: '島根県', 33: '岡山県', 34: '広島県', 35: '山口県',");
lines.push("  36: '徳島県', 37: '香川県', 38: '愛媛県', 39: '高知県', 40: '福岡県',");
lines.push("  41: '佐賀県', 42: '長崎県', 43: '熊本県', 44: '大分県', 45: '宮崎県',");
lines.push("  46: '鹿児島県', 47: '沖縄県',");
lines.push('};');
lines.push('');
lines.push('export const visits: VisitInfo[] = [');
for (const v of visits) {
  lines.push('  {');
  lines.push(`    prefecture: '${v.prefecture}',`);
  lines.push(`    type: '${v.type}',`);
  lines.push('    notes: [');
  for (const n of v.notes) {
    lines.push(`      { date: '${n.date}', description: '${esc(n.description)}' },`);
  }
  lines.push('    ],');
  lines.push('  },');
}
lines.push('];');
lines.push('');
lines.push('export function getVisitInfo(prefecture: string): VisitInfo | undefined {');
lines.push('  return visits.find((v) => v.prefecture === prefecture);');
lines.push('}');
lines.push('');
lines.push('export function getVisitedCount(): number {');
lines.push('  return visits.length;');
lines.push('}');
lines.push('');
lines.push('export function getTypeLabel(type: VisitType): string {');
lines.push("  switch (type) {");
lines.push("    case 'travel':");
lines.push("      return '旅行';");
lines.push("    case 'work':");
lines.push("      return '仕事';");
lines.push("    case 'both':");
lines.push("      return '旅行・仕事';");
lines.push('  }');
lines.push('}');
lines.push('');

writeFileSync(join(REPO, 'src/data/visits.ts'), lines.join('\n'), 'utf8');
console.log(`\nOK: ${visits.length}県 -> src/data/visits.ts`);
