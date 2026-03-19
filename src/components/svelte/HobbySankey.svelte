<script>
  const connections = [
    { verb: '歩く', items: ['旅行', 'バックパック', '登山', '雪山', '温泉', '徒歩宿', '野宿'] },
    { verb: '乗る', items: ['電車', '自転車', '飛行機', 'フェリー', '車', '旅行'] },
    { verb: '泊まる', items: ['徒歩宿', '野宿', '温泉', '旅行'] },
    { verb: '創る', items: ['ロボット', '電子工作', '金属加工', 'デザイン', 'ソフトウェア開発', 'マイコン', '自宅サーバー'] },
    { verb: '遊ぶ', items: ['自宅サーバー', 'コンピュータ', 'マイコン', 'ソフトウェア開発', '旅行'] },
    { verb: '撮る', items: ['写真', '旅行', '登山', '雪山'] },
    { verb: '聴く', items: ['関西フォーク'] },
    { verb: '知る', items: ['民族紛争', '世界史', '国際政治', '旅行', 'コンピュータ', '電子工作'] },
    { verb: '感じる', items: ['関西フォーク', '温泉', '旅行', '雪山', '野宿'] },
    { verb: '食べる', items: ['旅行', '温泉'] },
    { verb: '表現する', items: ['デザイン', '写真', 'ソフトウェア開発', 'ロボット'] },
  ];

  // Collect unique items preserving first-appearance order, grouped by primary verb
  const seen = new Set();
  const uniqueItems = [];
  for (const c of connections) {
    for (const item of c.items) {
      if (!seen.has(item)) {
        seen.add(item);
        uniqueItems.push(item);
      }
    }
  }

  // Which verbs connect to each item
  const itemVerbs = new Map();
  for (const c of connections) {
    for (const item of c.items) {
      if (!itemVerbs.has(item)) itemVerbs.set(item, []);
      itemVerbs.get(item).push(c.verb);
    }
  }

  // Layout
  const verbX = 50;
  const itemX = 310;
  const lineH = 22;
  const verbStartY = 14;
  const itemStartY = 14;

  const verbPositions = connections.map((c, i) => ({
    ...c,
    y: verbStartY + i * lineH * (uniqueItems.length / connections.length),
  }));

  // Distribute items evenly
  const itemPositions = uniqueItems.map((item, i) => ({
    label: item,
    y: itemStartY + i * lineH,
  }));

  // Recompute verb Y to be centered on their connected items
  const verbYMap = new Map();
  for (const c of connections) {
    const ys = c.items.map(item => itemPositions.find(p => p.label === item)?.y ?? 0);
    const avgY = ys.reduce((a, b) => a + b, 0) / ys.length;
    verbYMap.set(c.verb, avgY);
  }

  // Build path data
  const paths = [];
  for (const c of connections) {
    const vy = verbYMap.get(c.verb);
    for (const item of c.items) {
      const iy = itemPositions.find(p => p.label === item)?.y ?? 0;
      paths.push({
        verb: c.verb,
        item,
        d: `M ${verbX + 4} ${vy} C ${verbX + 80} ${vy}, ${itemX - 80} ${iy}, ${itemX - 4} ${iy}`,
      });
    }
  }

  const svgHeight = Math.max(
    (verbYMap.size > 0 ? Math.max(...verbYMap.values()) : 0),
    itemPositions.length > 0 ? itemPositions[itemPositions.length - 1].y : 0
  ) + 20;

  let hoverVerb = $state(null);
  let hoverItem = $state(null);

  function isActive(path) {
    if (hoverVerb) return path.verb === hoverVerb;
    if (hoverItem) return path.item === hoverItem;
    return true;
  }

  function isVerbActive(verb) {
    if (hoverVerb) return verb === hoverVerb;
    if (hoverItem) return itemVerbs.get(hoverItem)?.includes(verb);
    return true;
  }

  function isItemActive(item) {
    if (hoverItem) return item === hoverItem;
    if (hoverVerb) return connections.find(c => c.verb === hoverVerb)?.items.includes(item);
    return true;
  }
</script>

<svg
  viewBox={`0 0 440 ${svgHeight}`}
  class="hobby-sankey"
  role="img"
  aria-label="趣味のつながり図"
>
  <!-- Paths -->
  {#each paths as path}
    <path
      d={path.d}
      fill="none"
      stroke="#9ca3af"
      stroke-width="1.5"
      opacity={isActive(path) ? 0.4 : 0.06}
      class="flow"
    />
  {/each}

  <!-- Verb labels (left) -->
  {#each connections as conn}
    {@const y = verbYMap.get(conn.verb)}
    <text
      x={verbX}
      y={y}
      text-anchor="end"
      dominant-baseline="middle"
      class="label verb-label"
      opacity={isVerbActive(conn.verb) ? 1 : 0.2}
      onmouseenter={() => hoverVerb = conn.verb}
      onmouseleave={() => hoverVerb = null}
    >{conn.verb}</text>
  {/each}

  <!-- Item labels (right) -->
  {#each itemPositions as pos}
    {@const shared = itemVerbs.get(pos.label)?.length > 1}
    <text
      x={itemX}
      y={pos.y}
      dominant-baseline="middle"
      class="label item-label"
      class:shared
      opacity={isItemActive(pos.label) ? 1 : 0.2}
      onmouseenter={() => hoverItem = pos.label}
      onmouseleave={() => hoverItem = null}
    >{pos.label}</text>
  {/each}
</svg>

<style>
  .hobby-sankey {
    width: 100%;
    max-width: 480px;
  }

  .label {
    font-size: 12px;
    fill: #6b7280;
    cursor: default;
    transition: opacity 0.15s ease;
  }

  .verb-label {
    fill: #374151;
  }

  .flow {
    transition: opacity 0.15s ease;
  }
</style>
