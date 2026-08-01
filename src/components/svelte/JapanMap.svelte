<script lang="ts">
  import JapanSvg from './JapanSvg.svelte';
  import CareerReplay from './CareerReplay.svelte';
  import { visits, getVisitedCount, getTypeLabel, prefectureNames, type VisitType } from '../../data/visits';

  let activeTab = $state<'map' | 'replay' | 'list'>('map');
  let hoveredCode = $state<number | null>(null);
  let tooltipX = $state(0);
  let tooltipY = $state(0);

  const visitedCount = getVisitedCount();

  // Build lookup: prefecture name -> visit info
  const visitByName = new Map(visits.map(v => [v.prefecture, v]));

  const sortedVisits = [...visits].sort((a, b) => {
    const dateA = a.notes?.[a.notes.length - 1]?.date ?? '';
    const dateB = b.notes?.[b.notes.length - 1]?.date ?? '';
    return dateB.localeCompare(dateA);
  });

  function getFill(code: number): string {
    const name = prefectureNames[code];
    if (!name) return '#f5f5f4';
    const info = visitByName.get(name);
    if (!info) return '#f5f5f4';
    if (hoveredCode === code) return '#a8a29e';
    switch (info.type) {
      case 'travel': return '#d6d3d1';
      case 'work': return '#a8a29e';
      case 'both': return '#78716c';
      default: return '#f5f5f4';
    }
  }

  function getStroke(code: number): string {
    if (hoveredCode === code) return '#57534e';
    return '#a8a29e';
  }

  function handleMouseMove(e: MouseEvent) {
    const container = (e.currentTarget as Element | null)?.closest('.map-container') ?? (e.target as Element | null)?.closest('.map-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    tooltipX = e.clientX - rect.left;
    tooltipY = e.clientY - rect.top - 12;
  }

  function handleMouseEnter(code: number, e: MouseEvent) {
    hoveredCode = code;
    handleMouseMove(e);
  }

  function handleMouseLeave() {
    hoveredCode = null;
  }

  function getTypeBadgeClass(type: VisitType): string {
    switch (type) {
      case 'travel': return 'bg-stone-200 text-stone-700';
      case 'work': return 'bg-stone-300 text-stone-800';
      case 'both': return 'bg-stone-400 text-white';
      default: return 'bg-stone-100 text-stone-600';
    }
  }

  const tabs = [
    { id: 'map', label: 'マップ' },
    { id: 'replay', label: '軌跡' },
    { id: 'list', label: 'リスト' },
  ] as const;
</script>

<div class="max-w-4xl mx-auto py-8 px-4">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-slate-900 mb-2">訪問マップ</h1>
    <p class="text-sm text-stone-500">旅行・仕事での訪問記録</p>
  </div>

  <div class="mb-6 flex items-baseline gap-4 flex-wrap">
    <div class="text-4xl font-bold text-slate-900 tabular-nums">
      {visitedCount} <span class="text-lg font-normal text-stone-400">/ 47</span>
    </div>
    <div class="flex gap-4 text-xs text-stone-500">
      <span class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-3 rounded-sm" style="background:#d6d3d1"></span>旅行
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-3 rounded-sm" style="background:#a8a29e"></span>仕事
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-3 rounded-sm" style="background:#78716c"></span>両方
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-3 rounded-sm border border-stone-300" style="background:#f5f5f4"></span>未訪問
      </span>
    </div>
  </div>

  <div class="flex gap-0 mb-6 border-b border-stone-200" role="tablist">
    {#each tabs as tab (tab.id)}
      <button
        class="tab-btn"
        class:active={activeTab === tab.id}
        role="tab"
        aria-selected={activeTab === tab.id}
        onclick={() => activeTab = tab.id}
      >{tab.label}</button>
    {/each}
  </div>

  {#if activeTab === 'map'}
    <div class="relative map-container">
      <JapanSvg
        {getFill}
        {getStroke}
        onPrefEnter={handleMouseEnter}
        onPrefMove={handleMouseMove}
        onPrefLeave={handleMouseLeave}
        label="訪問した都道府県の地図"
      />

      {#if hoveredCode}
        {@const name = prefectureNames[hoveredCode]}
        {@const info = name ? visitByName.get(name) : null}
        <div
          class="absolute pointer-events-none bg-white border border-stone-200 shadow-sm rounded-md py-2 px-3 text-sm z-10 whitespace-nowrap"
          style="left:{tooltipX}px;top:{tooltipY}px;transform:translate(-50%,-100%)"
        >
          <div class="font-medium text-slate-900">{name}</div>
          {#if info}
            <div class="text-xs text-stone-500 mt-0.5">{getTypeLabel(info.type)}</div>
            {#if info.notes && info.notes.length > 0}
              <div class="text-xs text-stone-400 mt-1">{info.notes[info.notes.length - 1].description}</div>
            {/if}
          {:else}
            <div class="text-xs text-stone-400 mt-0.5">未訪問</div>
          {/if}
        </div>
      {/if}
    </div>

  {:else if activeTab === 'replay'}
    <CareerReplay />

  {:else}
    <div class="space-y-0">
      <div class="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-0 text-xs text-stone-400 font-medium pb-2 border-b border-stone-200 mb-2 px-2">
        <span>都道府県</span>
        <span>種別</span>
        <span>メモ</span>
      </div>
      {#each sortedVisits as visit (visit.prefecture)}
        <div class="grid grid-cols-[1fr_auto_1fr] gap-x-4 items-start py-3 px-2 border-b border-stone-100 hover:bg-stone-50 transition-colors duration-150">
          <span class="text-sm font-medium text-slate-900">{visit.prefecture}</span>
          <span class="text-xs py-0.5 px-2 rounded {getTypeBadgeClass(visit.type)}">{getTypeLabel(visit.type)}</span>
          <div class="text-xs text-stone-500">
            {#if visit.notes}
              {#each visit.notes as note (note.date + note.description)}
                <div class="mb-1 last:mb-0">
                  <span class="text-stone-400 tabular-nums">{note.date}</span>
                  <span class="ml-1">{note.description}</span>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <p class="text-xs text-stone-400 mt-6">
    地図データ: <a href="https://github.com/geolonia/japanese-prefectures" class="underline" target="_blank" rel="noopener">Geolonia</a> (GFDL)
  </p>
</div>

<style>
  .tab-btn {
    padding: 8px 24px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    background: none;
    cursor: pointer;
    color: #a8a29e;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s ease;
  }
  .tab-btn:hover {
    color: #57534e;
  }
  .tab-btn.active {
    color: #1c1917;
    border-bottom-color: #1c1917;
  }
</style>
