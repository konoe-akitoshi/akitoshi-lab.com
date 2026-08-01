<script lang="ts">
  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { items, tags, getYear, formatDateRange } from '../../data/timeline';
  import type { TagKey, TimelineItem } from '../../data/timeline';

  type FilterKey = TagKey | 'all';

  const tagColors: Record<TagKey, {
    bg: string;
    text: string;
    dot: string;
    active: string;
    ring: string;
    activeHex: string;
    inactiveHex: string;
  }> = {
    education: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500', active: 'bg-violet-600', ring: 'ring-violet-300', activeHex: '#7c3aed', inactiveHex: '#6d28d9' },
    work: { bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500', active: 'bg-sky-600', ring: 'ring-sky-300', activeHex: '#0284c7', inactiveHex: '#0369a1' },
    internship: { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500', active: 'bg-teal-600', ring: 'ring-teal-300', activeHex: '#0d9488', inactiveHex: '#0f766e' },
    award: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', active: 'bg-amber-600', ring: 'ring-amber-300', activeHex: '#d97706', inactiveHex: '#b45309' },
    event: { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500', active: 'bg-rose-600', ring: 'ring-rose-300', activeHex: '#e11d48', inactiveHex: '#be123c' },
    speaking: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', active: 'bg-emerald-600', ring: 'ring-emerald-300', activeHex: '#059669', inactiveHex: '#047857' },
    contest: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', active: 'bg-red-600', ring: 'ring-red-300', activeHex: '#dc2626', inactiveHex: '#b91c1c' },
    noc: { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500', active: 'bg-cyan-600', ring: 'ring-cyan-300', activeHex: '#0891b2', inactiveHex: '#0e7490' },
    staff: { bg: 'bg-lime-100', text: 'text-lime-700', dot: 'bg-lime-500', active: 'bg-lime-600', ring: 'ring-lime-300', activeHex: '#65a30d', inactiveHex: '#4d7c0f' },
    robotics: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', active: 'bg-orange-600', ring: 'ring-orange-300', activeHex: '#ea580c', inactiveHex: '#c2410c' },
    network: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', active: 'bg-blue-600', ring: 'ring-blue-300', activeHex: '#2563eb', inactiveHex: '#1d4ed8' },
    research: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', active: 'bg-indigo-600', ring: 'ring-indigo-300', activeHex: '#4f46e5', inactiveHex: '#4338ca' },
    ai: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', dot: 'bg-fuchsia-500', active: 'bg-fuchsia-600', ring: 'ring-fuchsia-300', activeHex: '#c026d3', inactiveHex: '#a21caf' },
  };

  let expanded = $state(true);
  let activeTags = $state(new Set<TagKey>());

  function toggleTag(tag: TagKey) {
    const next = new Set(activeTags);
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    activeTags = next;
  }

  function clearAll() {
    activeTags = new Set();
  }

  // Inline style for a filter pill: colored background when active, colored text when inactive.
  function pillStyle(key: FilterKey, active: boolean): string {
    if (key === 'all') {
      return active ? 'background:#111' : '';
    }
    return active ? `background:${tagColors[key].activeHex}` : `color:${tagColors[key].inactiveHex}`;
  }

  const allTagKeys = Object.keys(tags) as TagKey[];
  const sortedTagKeys = $derived(
    ['all' as FilterKey, ...[...allTagKeys].sort((a, b) => {
      const aActive = activeTags.has(a) ? 0 : 1;
      const bActive = activeTags.has(b) ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return allTagKeys.indexOf(a) - allTagKeys.indexOf(b);
    })]
  );

  const hasActive = $derived(activeTags.size > 0);

  const baseItems = $derived(expanded ? items : items.filter(i => i.pickup));

  const filtered = $derived(
    !hasActive ? baseItems : baseItems.filter(item => item.tags.some(t => activeTags.has(t)))
  );

  // Full count per year (always based on all items, ignoring pickup/filter)
  const yearCounts = $derived(
    items.reduce<Record<string, number>>((acc, item) => {
      const y = getYear(item.date);
      acc[y] = (acc[y] || 0) + 1;
      return acc;
    }, {})
  );

  const grouped = $derived(
    Object.entries(
      filtered.reduce<Record<string, TimelineItem[]>>((acc, item) => {
        const y = getYear(item.date);
        if (!acc[y]) acc[y] = [];
        acc[y].push(item);
        return acc;
      }, {})
    ).map(([year, yearItems]) => [year, yearItems.sort((a, b) => b.date.localeCompare(a.date))] as [string, TimelineItem[]])
     .sort((a, b) => b[0].localeCompare(a[0]))
  );

</script>

<div>
  <!-- Spotify-style filter bar (only when expanded) -->
  {#if expanded}
  <div class="filter-bar" transition:slide={{ duration: 200 }}>
    {#each sortedTagKeys as key (key)}
      {@const isActive = key === 'all' ? !hasActive : activeTags.has(key)}
      <button
        type="button"
        class="tag-pill {isActive ? 'active' : 'inactive'}"
        class:snug={key !== 'all' && activeTags.has(key) && hasActive}
        style={pillStyle(key, isActive)}
        aria-pressed={isActive}
        onclick={() => key === 'all' ? clearAll() : toggleTag(key)}
        animate:flip={{ duration: 350, easing: cubicOut }}
      >
        {key === 'all' ? 'All' : tags[key]}
      </button>
    {/each}
  </div>
  {/if}

  <!-- Count -->
  {#if hasActive}
    <p class="count" transition:slide={{ duration: 150 }}>
      {filtered.length} / {items.length}
    </p>
  {/if}

  <!-- Timeline -->
  <div class="relative">
    <div class="absolute left-[13px] top-0 bottom-0 w-px bg-gray-200"></div>

    {#each grouped as [year, yearItems], yi (year)}
      <div>
        <div class="relative flex items-center mb-3 {yi > 0 ? 'mt-1' : ''}">
          <div class="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold z-1 flex-shrink-0">
            {yearCounts[year]}
          </div>
          <span class="ml-3 text-lg font-bold text-gray-900">{year}</span>
        </div>

        {#each yearItems as item (item.title + item.date)}
          {@const colors = tagColors[item.tags[0]]}
          <div class="relative flex items-start ml-[13px] pl-7 pb-3" transition:slide={{ duration: 200 }}>
            <div class="absolute left-0 top-3 w-[7px] h-[7px] rounded-full {colors.dot} -translate-x-1/2 ring-2 ring-white"></div>

            {#snippet titleBlock()}
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-semibold text-gray-900 text-sm leading-snug {item.url ? 'group-hover:text-blue-600 transition-colors' : ''}">{item.title}</span>
                {#if item.ongoing}
                  <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 leading-none">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    now
                  </span>
                {/if}
              </div>
              <p class="text-gray-500 text-sm mt-0.5 leading-snug">{item.sub}</p>
            {/snippet}

            <div class="flex-1 rounded-lg p-3 -mx-2 transition-colors duration-150 {item.url ? 'group hover:bg-gray-50' : ''}">
              <div class="flex items-start gap-2 w-full">
                <div class="flex-1 min-w-0">
                  {#if item.url}
                    <a href={item.url} class="block no-underline text-inherit">
                      {@render titleBlock()}
                    </a>
                  {:else}
                    <div>
                      {@render titleBlock()}
                    </div>
                  {/if}
                  <div class="flex flex-wrap gap-1 mt-1.5">
                    {#each item.tags as tag}
                      {@const tc = tagColors[tag]}
                      <button
                        type="button"
                        class="inline-tag {activeTags.has(tag) ? `${tc.active} text-white` : `${tc.bg} ${tc.text}`}"
                        onclick={() => toggleTag(tag)}
                      >{tags[tag]}</button>
                    {/each}
                  </div>
                </div>
                <span class="text-gray-400 text-xs flex-shrink-0 mt-0.5">{formatDateRange(item.date, item.dateEnd)}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/each}

    <div class="relative flex items-center mt-1">
      <div class="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center z-1 flex-shrink-0">
        <div class="w-2 h-2 rounded-full bg-gray-400"></div>
      </div>
    </div>
  </div>

  <button class="expand-btn" onclick={() => expanded = !expanded} aria-expanded={expanded}>
    {expanded ? '折りたたむ' : `すべて表示（${items.length}件）`}
    <svg class="expand-icon" class:flipped={expanded} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
</div>

<style>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-bottom: 1.5rem;
  }

  .tag-pill {
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    border: 1.5px solid #e5e7eb;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease,
      border-radius 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      margin 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .tag-pill.inactive {
    background: white;
    margin-left: 0;
  }

  .tag-pill.active {
    color: white;
    border-color: transparent;
  }

  /* Water-droplet merge: active pills lose border-radius on touching edges */
  .tag-pill.active.snug {
    border-radius: 9999px;
    margin-left: -1px;
    border-left: none;
  }
  .tag-pill.active.snug:first-of-type {
    border-radius: 9999px;
    margin-left: 0;
    border-left: 1.5px solid transparent;
  }
  /* Remove rounded corners between adjacent active pills */
  .tag-pill.active.snug + .tag-pill.active.snug {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    margin-left: -2px;
  }
  .tag-pill.active.snug:has(+ .tag-pill.active.snug) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  /* Single active (no adjacent active sibling) keeps full pill shape */
  .tag-pill.active.snug:first-of-type:last-of-type {
    border-radius: 9999px;
  }

  .inline-tag {
    font: inherit;
    padding: 2px 6px;
    border: none;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .inline-tag:hover {
    opacity: 0.8;
  }

  .count {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 1rem;
  }

  .expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    padding: 10px;
    margin-top: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    color: #6b7280;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .expand-btn:hover {
    color: #111;
    border-color: #9ca3af;
  }

  .expand-icon {
    transition: transform 0.25s ease;
  }
  .expand-icon.flipped {
    transform: rotate(180deg);
  }
</style>
