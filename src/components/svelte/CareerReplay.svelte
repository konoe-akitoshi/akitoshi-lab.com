<script lang="ts">
  import JapanSvg from './JapanSvg.svelte';
  import { prefGeos, prefGeoByName } from '../../data/japan-geo';
  import { items, getYear, formatYearMonth } from '../../data/timeline';

  interface LocatedEvent {
    title: string;
    sub: string;
    date: string;
    pref: string;
    year: number;
  }

  // 場所は timeline.ts の pref フィールドが正（オンライン開催・場所未確認は未設定）
  const located: LocatedEvent[] = items
    .filter((i) => i.pref)
    .map((i) => ({ title: i.title, sub: i.sub, date: i.date, pref: i.pref!, year: parseInt(getYear(i.date), 10) }))
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
