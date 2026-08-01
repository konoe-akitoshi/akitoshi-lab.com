<script lang="ts">
  import { items, getYear } from '../../data/timeline';

  interface Props {
    onSelectYear?: (year: string) => void;
  }
  let { onSelectYear }: Props = $props();

  // 月ごとの件数（年×月のグリッド）
  const byMonth = new Map<string, { count: number; titles: string[] }>();
  for (const item of items) {
    const key = item.date.slice(0, 7); // YYYY-MM
    const cur = byMonth.get(key) ?? { count: 0, titles: [] };
    cur.count += 1;
    cur.titles.push(item.title);
    byMonth.set(key, cur);
  }

  const yearNums = items.map((i) => parseInt(getYear(i.date), 10));
  const minYear = Math.min(...yearNums);
  const maxYear = Math.max(...yearNums);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  function cellData(year: number, month: number) {
    return byMonth.get(`${year}-${String(month).padStart(2, '0')}`);
  }

  // 件数→色: シーケンシャル単色（青 明→暗）。0件はニュートラル。
  const SCALE = ['#f4f4f5', '#bfdbfe', '#60a5fa', '#1d4ed8'];
  function fillFor(count: number): string {
    if (count <= 0) return SCALE[0];
    if (count === 1) return SCALE[1];
    if (count === 2) return SCALE[2];
    return SCALE[3];
  }

  function cellLabel(year: number, month: number): string {
    const d = cellData(year, month);
    if (!d) return `${year}年${month}月: 活動なし`;
    return `${year}年${month}月 (${d.count}件): ${d.titles.join('、')}`;
  }
</script>

<div class="heatmap-wrap">
  <div class="heatmap" style={`--cols: ${years.length}`}>
    <!-- 年ラベル行（2年ごと） -->
    <div class="corner"></div>
    {#each years as y (y)}
      <div class="year-label">{y % 2 === 0 ? `'${String(y).slice(2)}` : ''}</div>
    {/each}

    {#each months as m (m)}
      <div class="month-label">{m === 1 || m === 4 || m === 7 || m === 10 ? `${m}月` : ''}</div>
      {#each years as y (y + '-' + m)}
        {@const d = cellData(y, m)}
        <button
          type="button"
          class="cell"
          style={`background:${fillFor(d?.count ?? 0)}`}
          title={cellLabel(y, m)}
          aria-label={cellLabel(y, m)}
          onclick={() => onSelectYear?.(String(y))}
        ></button>
      {/each}
    {/each}
  </div>

  <div class="scale-row">
    <span class="scale-label">少</span>
    {#each SCALE as c (c)}
      <span class="scale-cell" style={`background:${c}`}></span>
    {/each}
    <span class="scale-label">多</span>
    <span class="scale-hint">セルをクリックでその年へ</span>
  </div>
</div>

<style>
  .heatmap-wrap {
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }

  .heatmap {
    display: grid;
    grid-template-columns: auto repeat(var(--cols), 14px);
    gap: 2px;
    width: max-content;
  }

  .corner {
    width: 26px;
  }

  .year-label {
    font-size: 9px;
    color: #9ca3af;
    text-align: center;
    line-height: 1;
    padding-bottom: 2px;
    white-space: nowrap;
  }

  .month-label {
    font-size: 9px;
    color: #9ca3af;
    line-height: 14px;
    padding-right: 4px;
    text-align: right;
    width: 26px;
  }

  .cell {
    width: 14px;
    height: 14px;
    border: none;
    border-radius: 3px;
    padding: 0;
    cursor: pointer;
    transition: transform 0.1s ease;
  }
  .cell:hover {
    transform: scale(1.25);
    outline: 1px solid #9ca3af;
  }

  .scale-row {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-top: 8px;
  }

  .scale-label {
    font-size: 10px;
    color: #9ca3af;
  }

  .scale-cell {
    width: 11px;
    height: 11px;
    border-radius: 2px;
  }

  .scale-hint {
    font-size: 10px;
    color: #9ca3af;
    margin-left: 12px;
  }
</style>
