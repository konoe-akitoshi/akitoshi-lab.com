<script>
  import { onMount } from 'svelte';

  /** @type {{ images: Array<{ src: string, width: number, height: number }> }} */
  const { images = [] } = $props();

  let currentIndex = $state(0);
  let nextIndex = $state(1);
  let showNext = $state(false);
  let imageError = $state(false);

  const duration = 10000; // 表示時間 10秒
  const transitionDuration = 2000; // トランジション 2秒

  // 現在と次の画像を取得
  let currentImage = $derived(images[currentIndex]);
  let nextImage = $derived(images[nextIndex]);

  // 画像読み込みエラー時のハンドラ
  function handleImageError() {
    imageError = true;
  }

  onMount(() => {
    if (images.length <= 1) return;

    const timers = { timeout: null, raf: null };

    // 次の画像をプリロード
    function preloadImage(index) {
      const img = new Image();
      img.src = images[index]?.src || '';
    }

    // 2枚目をプリロード
    preloadImage(nextIndex);

    const interval = setInterval(() => {
      // 次の画像を表示開始
      showNext = true;

      // トランジション完了後に状態を更新
      timers.timeout = setTimeout(() => {
        currentIndex = nextIndex;
        nextIndex = (nextIndex + 1) % images.length;

        // 1フレーム遅らせてnext画像を削除（ちらつき防止）
        timers.raf = requestAnimationFrame(() => {
          showNext = false;
        });

        // 次の画像をプリロード
        preloadImage(nextIndex);
      }, transitionDuration);
    }, duration);

    return () => {
      clearInterval(interval);
      if (timers.timeout) clearTimeout(timers.timeout);
      if (timers.raf) cancelAnimationFrame(timers.raf);
    };
  });
</script>

{#if images.length > 0 && !imageError}
  <div
    class="slideshow"
    style="--transition-duration: {transitionDuration}ms; --duration: {duration}ms;"
    role="presentation"
  >
    <!-- 現在の画像 (常に表示) -->
    <img
      src={currentImage.src}
      alt=""
      width={currentImage.width}
      height={currentImage.height}
      class="slide current"
      loading="eager"
      decoding="async"
      fetchpriority="high"
      role="presentation"
      onerror={handleImageError}
    />

    <!-- 次の画像 (トランジション中のみ表示) -->
    {#if showNext && nextImage}
      <img
        src={nextImage.src}
        alt=""
        width={nextImage.width}
        height={nextImage.height}
        class="slide next"
        decoding="async"
        role="presentation"
        onerror={handleImageError}
      />
    {/if}

    <!-- インジケーター -->
    <div class="indicator" role="presentation">
      {#each images as _, i}
        <div class="bar" class:active={i === currentIndex}>
          {#if i === currentIndex && !showNext}
            <span class="progress"></span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

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
    pointer-events: none;
  }

  .slide.current {
    z-index: 1;
  }

  .slide.next {
    z-index: 2;
    will-change: opacity;
    animation: fadeIn var(--transition-duration, 2000ms) cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
    animation: progressFill var(--duration, 10000ms) linear forwards;
  }

  @keyframes progressFill {
    from { width: 0%; }
    to { width: 100%; }
  }
</style>
