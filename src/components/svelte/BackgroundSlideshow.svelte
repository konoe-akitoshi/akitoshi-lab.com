<script>
  import { onMount } from 'svelte';

  /** @type {{ images: string[] }} */
  let { images = [] } = $props();

  // 初期値をローカル配列にコピー（Svelte 5警告回避 + 不変性保証）
  const initialImages = [...images];
  const imageCount = initialImages.length;

  // 2スロット交互方式：表示中の画像のsrcを変更しない
  let slotA = $state(initialImages[0] ?? '');
  let slotB = $state(initialImages[1] ?? initialImages[0] ?? '');
  let activeSlot = $state('A');
  let transitioning = $state(false);
  let nextIndex = $state(2 % (imageCount || 1));

  const duration = 10000;
  const transitionDuration = 2000;

  // インジケーター用
  const currentIndex = $derived(
    initialImages.indexOf(activeSlot === 'A' ? slotA : slotB)
  );

  onMount(() => {
    if (imageCount <= 1) return;

    let timerId = null;
    let active = true;

    const preload = (i) => { new Image().src = initialImages[i] ?? ''; };
    preload(nextIndex);

    const next = () => {
      if (!active) return;
      timerId = setTimeout(() => {
        if (!active) return;
        transitioning = true;

        timerId = setTimeout(() => {
          if (!active) return;
          activeSlot = activeSlot === 'A' ? 'B' : 'A';
          transitioning = false;

          requestAnimationFrame(() => {
            if (!active) return;
            if (activeSlot === 'A') slotB = initialImages[nextIndex];
            else slotA = initialImages[nextIndex];
            nextIndex = (nextIndex + 1) % imageCount;
            preload(nextIndex);
            next();
          });
        }, transitionDuration);
      }, duration);
    };

    next();
    return () => { active = false; clearTimeout(timerId); };
  });
</script>

{#if initialImages.length > 0}
  <div class="slideshow" style="--t:{transitionDuration}ms;--d:{duration}ms">
    <img
      src={slotA}
      alt=""
      class="slide"
      class:visible={activeSlot === 'A'}
      class:fading={activeSlot === 'B' && transitioning}
      loading="eager"
      decoding="async"
    />
    <img
      src={slotB}
      alt=""
      class="slide"
      class:visible={activeSlot === 'B'}
      class:fading={activeSlot === 'A' && transitioning}
      decoding="async"
    />
    <div class="dots">
      {#each initialImages as _, i}
        <div class="dot" class:active={i === currentIndex}>
          {#if i === currentIndex && !transitioning}<span></span>{/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .slideshow { position: fixed; inset: 0; z-index: -1; overflow: hidden; }
  .slide {
    position: absolute; inset: 0; width: 100vw; height: 100vh;
    object-fit: cover; opacity: 0; z-index: 1; pointer-events: none;
  }
  .slide.visible { opacity: 1; z-index: 2; }
  .slide.fading {
    z-index: 3; will-change: opacity;
    animation: fade var(--t) ease-out forwards;
  }
  @keyframes fade { from { opacity: 0 } to { opacity: 1 } }

  .dots {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 12px; z-index: 10; pointer-events: none;
  }
  .dot {
    width: 24px; height: 2px; background: rgba(255,255,255,.18);
    border-radius: 1px; overflow: hidden; position: relative;
  }
  .dot.active { background: rgba(255,255,255,.45); }
  .dot span {
    display: block; height: 100%; background: rgba(255,255,255,.7);
    animation: progress var(--d) linear forwards;
  }
  @keyframes progress { from { width: 0 } to { width: 100% } }
</style>
