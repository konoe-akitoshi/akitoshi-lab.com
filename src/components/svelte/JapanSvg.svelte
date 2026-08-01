<script lang="ts">
  import type { Snippet } from 'svelte';
  import { prefGeos, MAP_VIEWBOX, MAP_OUTER_TRANSFORM, MAP_INNER_TRANSFORM } from '../../data/japan-geo';

  interface Props {
    getFill?: (code: number) => string;
    getStroke?: (code: number) => string;
    onPrefEnter?: (code: number, e: MouseEvent) => void;
    onPrefMove?: (e: MouseEvent) => void;
    onPrefLeave?: () => void;
    /** 都道府県と同じ座標空間に描画されるオーバーレイ（ドット等） */
    overlay?: Snippet;
    label?: string;
    interactive?: boolean;
  }

  let {
    getFill = () => '#f5f5f4',
    getStroke = () => '#a8a29e',
    onPrefEnter,
    onPrefMove,
    onPrefLeave,
    overlay,
    label = '日本地図',
    interactive = true,
  }: Props = $props();
</script>

<svg viewBox={MAP_VIEWBOX} xmlns="http://www.w3.org/2000/svg" class="w-full h-auto" role="img" aria-label={label}>
  <g transform={MAP_OUTER_TRANSFORM}>
    <g transform={MAP_INNER_TRANSFORM}>
      {#each prefGeos as p (p.code)}
        <g
          data-code={p.code}
          transform={`translate(${p.tx}, ${p.ty})`}
          fill={getFill(p.code)}
          stroke={getStroke(p.code)}
          stroke-width="1.0"
          stroke-linejoin="round"
          fill-rule="nonzero"
          class="pref"
          class:interactive
          role="presentation"
          onmouseenter={(e) => onPrefEnter?.(p.code, e)}
          onmousemove={(e) => onPrefMove?.(e)}
          onmouseleave={() => onPrefLeave?.()}
        >
          {#each p.shapes as s}
            {#if s.type === 'polygon'}
              <polygon points={s.data} />
            {:else}
              <path d={s.data} />
            {/if}
          {/each}
        </g>
      {/each}
      {#if overlay}{@render overlay()}{/if}
    </g>
  </g>
</svg>

<style>
  .pref {
    transition: fill 0.15s ease;
  }
  .pref.interactive {
    cursor: pointer;
  }
</style>
