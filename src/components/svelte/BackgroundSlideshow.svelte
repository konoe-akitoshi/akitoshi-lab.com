<script>
  import { onMount } from 'svelte';

  /** @type {{ images: Array<{ src: string, width: number, height: number }> }} */
  const { images = [] } = $props();

  let current = $state(0);
  let next = $state(1);
  let transitioning = $state(false);

  const duration = 10000; // 10秒
  const transitionDuration = 2000; // 2秒

  onMount(() => {
    if (images.length <= 1) return;

    // 次の画像をプリロード
    function preloadImage(index) {
      const img = new Image();
      img.src = images[index]?.src || '';
    }

    // 初期プリロード
    preloadImage(1);

    const interval = setInterval(() => {
      transitioning = true;

      // トランジション完了後に状態更新
      setTimeout(() => {
        current = next;
        next = (next + 1) % images.length;
        transitioning = false;

        // 次の次の画像をプリロード
        preloadImage((next + 1) % images.length);
      }, transitionDuration);
    }, duration);

    return () => clearInterval(interval);
  });
</script>

<div class="slideshow">
  {#each images as image, i}
    <img
      src={image.src}
      alt=""
      width={image.width}
      height={image.height}
      class="slide"
      class:active={i === current}
      class:next={i === next && transitioning}
      loading={i === 0 ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={i === 0 ? "high" : "auto"}
    />
  {/each}

  <!-- インジケーター -->
  <div class="indicator">
    {#each images as _, i}
      <div class="bar" class:active={i === current}>
        {#if i === current}
          <span
            class="progress"
            style="animation-duration: {duration}ms;"
          ></span>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .slideshow {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
  }

  .slide {
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    opacity: 0;
    transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  .slide.active {
    opacity: 1;
    z-index: 1;
  }

  .slide.next {
    opacity: 1;
    z-index: 2;
  }

  .indicator {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 10;
    pointer-events: none;
  }

  .bar {
    width: 24px;
    height: 2px;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 1px;
    overflow: hidden;
    position: relative;
    transition: background 0.3s;
  }

  .bar.active {
    background: rgba(255, 255, 255, 0.45);
  }

  .progress {
    display: block;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 1px;
    animation: progress-fill linear forwards;
  }

  @keyframes progress-fill {
    from { width: 0%; }
    to { width: 100%; }
  }
</style>
