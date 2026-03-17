<script>
  /**
   * Progressive AVIF Gallery
   * @type {{ images: Array<{ src: string, title: string }> }}
   */
  let { images = [] } = $props();

  let currentIndex = $state(0);
  let isModalOpen = $state(false);

  function openModal(index) {
    console.log('openModal called', index);
    currentIndex = index;
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    isModalOpen = false;
    document.body.style.overflow = '';
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (!isModalOpen) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }}
/>

<section class="gallery-container">
  <div class="gallery-grid">
    {#each images as image, index}
      <button
        type="button"
        class="gallery-item"
        onclick={() => openModal(index)}
      >
        <div class="gallery-image-container">
          <img
            src={image.src}
            alt={image.title}
            class="gallery-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="gallery-title">{image.title}</div>
      </button>
    {/each}
  </div>
</section>

{#if isModalOpen}
  <div class="gallery-modal" onclick={(e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  }}>
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <button class="close-button" onclick={closeModal}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      {#if images.length > 1}
        <button class="nav-button prev" onclick={prevImage}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="nav-button next" onclick={nextImage}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      {/if}

      <div class="modal-image-container">
        <img
          src={images[currentIndex]?.src}
          alt={images[currentIndex]?.title}
          class="modal-image"
          decoding="async"
        />
        <div class="modal-caption">
          <p>{images[currentIndex]?.title}</p>
          <span class="image-counter">{currentIndex + 1} / {images.length}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .gallery-container {
    width: 100%;
    max-width: 100vw;
    margin: 0 auto;
    padding: 0 0.5rem;
    box-sizing: border-box;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 24px;
    padding: 1rem 0;
  }

  @media (min-width: 640px) {
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
    }
  }

  @media (min-width: 768px) {
    .gallery-container {
      width: 90%;
      max-width: 1200px;
      padding: 0 2rem;
    }
    .gallery-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      padding: 3rem 0;
    }
  }

  .gallery-item {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    text-align: left;
    cursor: pointer;
    width: 100%;
    transition: transform 0.3s ease;
  }

  .gallery-item:hover {
    transform: translateY(-4px);
  }

  .gallery-image-container {
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    background-color: #e8e8e8;
    border-radius: 8px;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .gallery-item:hover .gallery-image {
    transform: scale(1.02);
  }

  .gallery-title {
    margin-top: 8px;
    font-size: 0.85rem;
    color: #666;
    text-align: center;
  }

  /* Modal */
  .gallery-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
  }

  .modal-content {
    position: relative;
    width: 90%;
    max-width: 95vw;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .close-button {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 1010;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }

  .close-button:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1010;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }

  .nav-button:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .nav-button.prev { left: 16px; }
  .nav-button.next { right: 16px; }

  .modal-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 4px;
  }

  .modal-caption {
    margin-top: 16px;
    color: white;
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .modal-caption p {
    margin: 0 0 4px 0;
  }

  .image-counter {
    font-size: 0.75rem;
    opacity: 0.6;
  }
</style>
