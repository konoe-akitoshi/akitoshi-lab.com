<script>
  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';
  import { cubicOut, elasticOut } from 'svelte/easing';

  const tags = {
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

  const tagColors = {
    education: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500', active: 'bg-violet-600', ring: 'ring-violet-300' },
    work: { bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500', active: 'bg-sky-600', ring: 'ring-sky-300' },
    internship: { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500', active: 'bg-teal-600', ring: 'ring-teal-300' },
    award: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', active: 'bg-amber-600', ring: 'ring-amber-300' },
    event: { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500', active: 'bg-rose-600', ring: 'ring-rose-300' },
    speaking: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', active: 'bg-emerald-600', ring: 'ring-emerald-300' },
    contest: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', active: 'bg-red-600', ring: 'ring-red-300' },
    noc: { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500', active: 'bg-cyan-600', ring: 'ring-cyan-300' },
    staff: { bg: 'bg-lime-100', text: 'text-lime-700', dot: 'bg-lime-500', active: 'bg-lime-600', ring: 'ring-lime-300' },
    robotics: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', active: 'bg-orange-600', ring: 'ring-orange-300' },
    network: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', active: 'bg-blue-600', ring: 'ring-blue-300' },
    research: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', active: 'bg-indigo-600', ring: 'ring-indigo-300' },
    ai: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', dot: 'bg-fuchsia-500', active: 'bg-fuchsia-600', ring: 'ring-fuchsia-300' },
  };

  const items = [
    { title: '電気通信大学', sub: '入学', date: '2022-04', year: '2022', tags: ['education'], ongoing: true },
    { title: '私立東山高等学校', sub: '卒業', date: '2022-03', year: '2022', tags: ['education'] },
    { title: '私立東山高等学校', sub: '入学', date: '2019-04', year: '2019', tags: ['education'] },
    { title: '京都市立近衛中学校', sub: '卒業', date: '2019-03', year: '2019', tags: ['education'] },
    { title: '京都市立近衛中学校', sub: '入学', date: '2016-04', year: '2016', tags: ['education'] },
    { title: '京都市立錦林小学校', sub: '卒業', date: '2016-03', year: '2016', tags: ['education'] },
    { title: '京都市立錦林小学校', sub: '入学', date: '2010-04', year: '2010', tags: ['education'] },
    { title: '電気通信大学 共創進化スマート社会実現機構', sub: '技術支援員', date: '2024-07', year: '2024', tags: ['work', 'network'], ongoing: true },
    { title: '株式会社インフォクラフト', sub: 'アルバイト勤務 サーバー管理業務', date: '2023-04', year: '2023', tags: ['work', 'network'], ongoing: true },
    { title: '株式会社サイバーエージェント', sub: 'インターン', date: '2025-07', year: '2025', tags: ['internship'] },
    { title: 'シスコシステムズ合同会社', sub: 'インターン', date: '2024-08', year: '2024', tags: ['internship', 'network'] },
    { title: '株式会社Turing', sub: 'インターン', date: '2023-08', year: '2023', tags: ['internship', 'ai'] },
    { title: 'JAWS DAYS 2026', sub: 'NOC', date: '2026-03', year: '2026', tags: ['event', 'staff', 'noc', 'network'], pickup: true },
    { title: 'JANOG57', sub: 'NOC backboneチーム', date: '2026-02', year: '2026', tags: ['event', 'staff', 'noc', 'network'] },
    { title: 'OisixのSREチームとの交流会 お野菜を添えて', sub: '登壇', date: '2025-07', year: '2025', tags: ['speaking', 'network'] },
    { title: 'MCP Ops LT大会！！！', sub: '登壇', date: '2025-06', year: '2025', tags: ['speaking', 'ai'] },
    { title: 'RoboCupper Online Meeting by Scramble #2', sub: '登壇', date: '2022-11', year: '2022', tags: ['speaking', 'robotics'] },
    { title: 'ICTSC 2025', sub: '1st Prize', date: '2026-03', year: '2026', tags: ['award', 'contest', 'network'], pickup: true },
    { title: 'ICTSC 2024', sub: '4th', date: '2025-03', year: '2025', tags: ['award', 'contest', 'network'], url: '/awards/ictsc-2024', pickup: true },
    { title: 'RobocupJuniorJapanOpen', sub: 'ロボット学会賞, デザイン賞', date: '2023-03', year: '2023', tags: ['award', 'contest', 'robotics'] },
    { title: 'Robocup Asia-Pacific (Junior Soccer Open)', sub: '2nd', date: '2021-11', year: '2021', tags: ['award', 'contest', 'robotics'], pickup: true },
    { title: 'サイエンスキャッスル研究費 THK賞', sub: '採択「感情を汲み取る自立走行型配膳ロボットの開発」', date: '2021-06', year: '2021', tags: ['award', 'research', 'robotics'], url: '/awards/science-castle-thk-2021' },
    { title: 'FIRST Robotics Competition Infinite ReCharge', sub: 'Rookie Game Changer Award', date: '2021-05', year: '2021', tags: ['award', 'contest', 'robotics'] },
    { title: 'RoboCup World Wide (Junior Soccer Open)', sub: 'Best Team Description Paper Award, Individual 4th', date: '2021-04', year: '2021', tags: ['award', 'contest', 'robotics'], pickup: true },
    { title: 'RobocupJuniorJapanOpen', sub: 'Open 2位', date: '2021-03', year: '2021', tags: ['award', 'contest', 'robotics'] },
    { title: 'ロボカップジュニア・京滋奈ブロック大会', sub: 'Open 準優勝', date: '2021-01', year: '2021', tags: ['award', 'contest', 'robotics'] },
    { title: 'RoboMaster', sub: '2nd Prize', date: '2020-10', year: '2020', tags: ['award', 'contest', 'robotics'] },
    { title: 'RoboCupJunior Soccer Virtual Poster Session', sub: 'Most Popular Poster in Open', date: '2020-09', year: '2020', tags: ['award', 'contest', 'robotics'] },
    { title: '第64回日本学生科学賞', sub: '入選3等「自律走行システムの考案」', date: '2020-06', year: '2020', tags: ['award', 'contest', 'research', 'robotics'], url: '/awards/japan-student-science-prize-64th' },
    { title: 'ロボカップジュニア・京滋奈ブロック大会', sub: 'Open 優勝', date: '2020-01', year: '2020', tags: ['award', 'contest', 'robotics'] },
    { title: '関西オープン', sub: 'Open 準優勝', date: '2019-06', year: '2019', tags: ['award', 'contest', 'robotics'] },
    { title: 'BIWAKOオープン', sub: 'LightWeight 4位', date: '2018-09', year: '2018', tags: ['award', 'contest', 'robotics'] },
    { title: 'せとうちオープン', sub: 'LightWeight 4位, SuperTeam 優勝', date: '2018-07', year: '2018', tags: ['award', 'contest', 'robotics'] },
    { title: 'ロボカップジュニア・ジャパンオープン2018和歌山', sub: 'NIPPON League サッカー ビギナーズ 予選12位', date: '2018-04', year: '2018', tags: ['award', 'contest', 'robotics'] },
    { title: 'SRC@国際ロボット展', sub: 'Classic部門 優勝', date: '2017-11', year: '2017', tags: ['award', 'contest', 'robotics'] },
    { title: 'SRC13', sub: '全国予選 8位', date: '2016-06', year: '2016', tags: ['award', 'contest', 'robotics'] },
    { title: '第53回自然科学観察コンクール', sub: '2等賞「オクラに見つけた水玉の正体」', date: '2012-06', year: '2012', tags: ['award', 'contest', 'research'], url: '/awards/shizen-kagaku-kansatsu-concours-53rd', pickup: true },
  ];

  let expanded = $state(false);
  let activeTags = $state(new Set());

  function toggleTag(tag) {
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

  const allTagKeys = Object.keys(tags);
  const sortedTagKeys = $derived(
    ['all', ...[...allTagKeys].sort((a, b) => {
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
    items.reduce((acc, item) => {
      acc[item.year] = (acc[item.year] || 0) + 1;
      return acc;
    }, {})
  );

  const grouped = $derived(
    Object.entries(
      filtered.reduce((acc, item) => {
        if (!acc[item.year]) acc[item.year] = [];
        acc[item.year].push(item);
        return acc;
      }, {})
    ).sort((a, b) => b[0].localeCompare(a[0]))
  );

  function formatMonth(date) {
    return parseInt(date.split('-')[1]) + '月';
  }
</script>

<div>
  <!-- Spotify-style filter bar (only when expanded) -->
  {#if expanded}
  <div class="filter-bar" transition:slide={{ duration: 200 }}>
    {#each sortedTagKeys as key (key)}
      <button
        class="tag-pill {key === 'all' ? (hasActive ? 'inactive' : 'active') : (activeTags.has(key) ? 'active' : 'inactive')}"
        class:snug={key !== 'all' && activeTags.has(key) && hasActive}
        data-tag={key}
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

            {#snippet content()}
              <div class="flex items-start gap-2 w-full">
                <div class="flex-1 min-w-0">
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
                  <div class="flex flex-wrap gap-1 mt-1.5">
                    {#each item.tags as tag}
                      {@const tc = tagColors[tag]}
                      <span
                        class="inline-tag {activeTags.has(tag) ? `${tc.active} text-white` : `${tc.bg} ${tc.text}`}"
                        role="button"
                        tabindex="0"
                        onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTag(tag); }}
                        onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); toggleTag(tag); } }}
                      >{tags[tag]}</span>
                    {/each}
                  </div>
                </div>
                <span class="text-gray-400 text-xs flex-shrink-0 mt-0.5">{formatMonth(item.date)}</span>
              </div>
            {/snippet}

            {#if item.url}
              <a href={item.url} class="group flex-1 rounded-lg p-3 -mx-2 transition-colors duration-150 hover:bg-gray-50 no-underline block">
                {@render content()}
              </a>
            {:else}
              <div class="flex-1 p-3 -mx-2">
                {@render content()}
              </div>
            {/if}
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

  <button class="expand-btn" onclick={() => expanded = !expanded}>
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

  /* Tag-specific active colors */
  .tag-pill.active[data-tag="education"] { background: #7c3aed; }
  .tag-pill.active[data-tag="work"] { background: #0284c7; }
  .tag-pill.active[data-tag="internship"] { background: #0d9488; }
  .tag-pill.active[data-tag="award"] { background: #d97706; }
  .tag-pill.active[data-tag="event"] { background: #e11d48; }
  .tag-pill.active[data-tag="speaking"] { background: #059669; }
  .tag-pill.active[data-tag="contest"] { background: #dc2626; }
  .tag-pill.active[data-tag="noc"] { background: #0891b2; }
  .tag-pill.active[data-tag="staff"] { background: #65a30d; }
  .tag-pill.active[data-tag="robotics"] { background: #ea580c; }
  .tag-pill.active[data-tag="network"] { background: #2563eb; }
  .tag-pill.active[data-tag="research"] { background: #4f46e5; }
  .tag-pill.active[data-tag="ai"] { background: #c026d3; }
  .tag-pill.active[data-tag="all"] { background: #111; }

  /* Inactive tag colors */
  .tag-pill.inactive[data-tag="education"] { color: #6d28d9; }
  .tag-pill.inactive[data-tag="work"] { color: #0369a1; }
  .tag-pill.inactive[data-tag="internship"] { color: #0f766e; }
  .tag-pill.inactive[data-tag="award"] { color: #b45309; }
  .tag-pill.inactive[data-tag="event"] { color: #be123c; }
  .tag-pill.inactive[data-tag="speaking"] { color: #047857; }
  .tag-pill.inactive[data-tag="contest"] { color: #b91c1c; }
  .tag-pill.inactive[data-tag="noc"] { color: #0e7490; }
  .tag-pill.inactive[data-tag="staff"] { color: #4d7c0f; }
  .tag-pill.inactive[data-tag="robotics"] { color: #c2410c; }
  .tag-pill.inactive[data-tag="network"] { color: #1d4ed8; }
  .tag-pill.inactive[data-tag="research"] { color: #4338ca; }
  .tag-pill.inactive[data-tag="ai"] { color: #a21caf; }

  .inline-tag {
    padding: 2px 6px;
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
