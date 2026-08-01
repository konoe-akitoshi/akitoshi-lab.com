<script lang="ts">
  import JapanSvg from './JapanSvg.svelte';
  import { prefGeos, prefGeoByName } from '../../data/japan-geo';
  import { items, getYear, formatYearMonth } from '../../data/timeline';

  // TODO: エージェント作業完了後に timeline.ts の各itemへ `pref` フィールドとして移す。
  // 場所が確定しているイベントのみ登録（オンライン開催・場所未確認はまだ含めない）。
  // キー: `${title}|${date}`
  const prefByEvent: Record<string, string> = {
    '京都市立錦林小学校|2010-04-01': '京都府',
    '京都市立錦林小学校|2016-03-01': '京都府',
    '京都市立近衛中学校|2016-04-01': '京都府',
    '京都市立近衛中学校|2019-03-01': '京都府',
    '私立東山高等学校|2019-04-01': '京都府',
    '私立東山高等学校|2022-03-01': '京都府',
    '電気通信大学|2022-04-01': '東京都',
    'SRC@国際ロボット展|2017-11-29': '東京都',
    'ロボカップジュニア・ジャパンオープン2018和歌山|2018-04-28': '和歌山県',
    'BIWAKOオープン|2018-09-15': '滋賀県',
    'ロボカップジュニア・京滋奈ブロック大会|2020-01-12': '京都府',
    'ロボカップジュニア・京滋奈ブロック大会|2021-01-10': '京都府',
    'SRE NEXT 2025 IN TOKYO|2025-07-11': '東京都',
    'Observability Conference Tokyo 2025|2025-10-27': '東京都',
    'MMA創設50周年記念パーティー|2025-10-25': '東京都',
    'OSC2026 Tokyo/Spring|2026-02-27': '東京都',
    'クラウドネイティブ会議|2026-05-14': '愛知県',
    'JANOG58|2026-07-15': '愛媛県',
    'KubeCon + CloudNativeCon Japan 2026|2026-07-28': '神奈川県',
  };

  interface LocatedEvent {
    title: string;
    sub: string;
    date: string;
    pref: string;
    year: number;
  }

  const located: LocatedEvent[] = items
    .map((i) => {
      const pref = prefByEvent[`${i.title}|${i.date}`];
      return pref ? { title: i.title, sub: i.sub, date: i.date, pref, year: parseInt(getYear(i.date), 10) } : null;
    })
    .filter((e): e is LocatedEvent => e !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  const unlocatedCount = items.length - located.length;

  const minYear = located[0]?.year ?? 2010;
  const maxYear = located[located.length - 1]?.year ?? new Date().getFullYear();
  const yearsWithEvents = [...new Set(located.map((e) => e.year))].sort((a, b) => a - b);

  const codeToName = new Map(prefGeos.map((p) => [p.code, p.name]));

  let year = $state(maxYear);
  let playing = $state(false);

  const eventsUpTo = $derived(located.filter((e) => e.year <= year));
  const currentEvents = $derived(located.filter((e) => e.year === year));

  const countByPref = $derived(
    eventsUpTo.reduce((acc, e) => {
      acc.set(e.pref, (acc.get(e.pref) ?? 0) + 1);
      return acc;
    }, new Map<string, number>())
  );

  // 現在年のイベントを県ごとにまとめてドット化
  const dots = $derived(
    [...currentEvents.reduce((acc, e) => {
      if (!acc.has(e.pref)) acc.set(e.pref, 0);
      acc.set(e.pref, acc.get(e.pref)! + 1);
      return acc;
    }, new Map<string, number>())].flatMap(([pref, count]) => {
      const geo = prefGeoByName.get(pref);
      return geo ? [{ x: geo.cx, y: geo.cy, count }] : [];
    })
  );

  function fillFor(code: number): string {
    const name = codeToName.get(code);
    const n = name ? (countByPref.get(name) ?? 0) : 0;
    if (n === 0) return '#f5f5f4';
    if (n === 1) return '#e7e5e4';
    if (n <= 3) return '#d6d3d1';
    if (n <= 6) return '#a8a29e';
    return '#78716c';
  }

  function togglePlay() {
    if (playing) {
      playing = false;
      return;
    }
    if (year >= maxYear) year = minYear;
    playing = true;
  }

  $effect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const next = yearsWithEvents.find((y) => y > year);
      if (next === undefined) {
        playing = false;
      } else {
        year = next;
      }
    }, 1100);
    return () => clearInterval(id);
  });
</script>

<div>
  <div class="flex items-center gap-4 mb-4">
    <button
      class="play-btn"
      onclick={togglePlay}
      aria-label={playing ? '一時停止' : '再生'}
    >
      {playing ? '❚❚' : '▶'}
    </button>
    <input
      type="range"
      class="year-slider flex-1"
      min={minYear}
      max={maxYear}
      bind:value={year}
      aria-label="年"
      onpointerdown={() => (playing = false)}
    />
    <span class="text-2xl font-bold text-slate-900 tabular-nums w-16 text-right">{year}</span>
  </div>

  <div class="relative">
    <JapanSvg getFill={fillFor} interactive={false} label="活動の軌跡マップ">
      {#snippet overlay()}
        {#each dots as d (d.x + '-' + d.y)}
          <circle cx={d.x} cy={d.y} r="14" class="ping" fill="#e11d48" />
          <circle cx={d.x} cy={d.y} r="6" fill="#e11d48" stroke="white" stroke-width="2" />
          {#if d.count > 1}
            <text x={d.x + 12} y={d.y - 8} class="dot-count">{d.count}</text>
          {/if}
        {/each}
      {/snippet}
    </JapanSvg>
  </div>

  <div class="min-h-24 mt-2">
    {#if currentEvents.length > 0}
      <ul class="list-none p-0 m-0 flex flex-col gap-1.5">
        {#each currentEvents as e (e.title + e.date)}
          <li class="flex items-baseline gap-2 text-sm">
            <span class="text-xs text-stone-400 tabular-nums flex-shrink-0">{formatYearMonth(e.date)}</span>
            <span class="text-slate-900">{e.title}</span>
            <span class="text-xs text-stone-500 truncate">{e.sub}</span>
            <span class="text-xs text-stone-400 flex-shrink-0 ml-auto">@{e.pref}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-sm text-stone-400">{year}年: 記録なし</p>
    {/if}
  </div>

  <p class="text-xs text-stone-400 mt-4">
    濃さ = その年までの活動数。位置が確定しているイベントのみ表示（未設定 {unlocatedCount} 件）。
  </p>
</div>

<style>
  .play-btn {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    border: 1.5px solid #d6d3d1;
    background: white;
    color: #1c1917;
    font-size: 13px;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .play-btn:hover {
    border-color: #78716c;
    background: #fafaf9;
  }

  .year-slider {
    accent-color: #1c1917;
    height: 4px;
  }

  .ping {
    transform-box: fill-box;
    transform-origin: center;
    animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  @keyframes ping {
    0% { transform: scale(0.4); opacity: 0.5; }
    80%, 100% { transform: scale(1.4); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ping {
      animation: none;
      opacity: 0.15;
    }
  }

  .dot-count {
    font-size: 13px;
    font-weight: 700;
    fill: #e11d48;
    paint-order: stroke;
    stroke: white;
    stroke-width: 3px;
  }
</style>
