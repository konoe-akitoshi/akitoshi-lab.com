<script>
  /** @type {Array<{thumb: string, full: string, alt: string, title: string}>} */
  const { images = [] } = $props();

  // リアクティブな状態
  let currentIndex = $state(0);
  let isModalOpen = $state(false);
  let modalImage = $state({ src: '', alt: '', title: '' });
  let imageLoaded = $state(false);

  // 画像をクリックしたときの処理
  function openModal(index) {
    currentIndex = index;
    modalImage = images[currentIndex];
    isModalOpen = true;
    imageLoaded = false;
    document.body.style.overflow = 'hidden';
  }

  // モーダルを閉じる処理
  function closeModal() {
    isModalOpen = false;
    document.body.style.overflow = '';
  }

  // モーダル内のクリックを処理する関数
  function handleModalClick(e) {
    // クリックされた要素が画像コンテナまたは閉じるボタンの子孫でない場合にモーダルを閉じる
    const isImageClick = e.target.closest('.modal-image-container') !== null;
    const isCloseButtonClick = e.target.closest('.close-button') !== null;
    
    if (!isImageClick && !isCloseButtonClick) {
      closeModal();
    }
  }
</script>

<section class="gallery-container">
  <div class="gallery-grid">
    {#each images as image, index}
      <div 
        class="gallery-item" 
        role="button"
        tabindex="0"
        onclick={() => openModal(index)}
        onkeydown={(e) => e.key === 'Enter' && openModal(index)}
        aria-label={`View ${image.title}`}
      >
        <div class="gallery-image-container">
          <img
            src={image.thumb}
            alt={image.alt}
            class="gallery-image"
            loading="lazy"
          />
        </div>
      </div>
    {/each}
  </div>
</section>

{#if isModalOpen}
  <div 
    class="gallery-modal active"
    onclick={handleModalClick}
    onkeydown={(e) => e.key === 'Escape' && closeModal()}
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Image gallery modal"
  >
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <button class="close-button" onclick={closeModal} aria-label="Close modal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="modal-image-container">
        <img 
          src={modalImage.full}
          alt={modalImage.alt} 
          class="modal-image" 
          class:loaded={imageLoaded}
          onload={() => imageLoaded = true}
        />
        <div class="modal-caption">
          <p>{modalImage.title}</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    overflow-x: hidden;
  }
  
  .gallery-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 80px 60px;
    padding: 2rem 0;
  }

  @media (min-width: 640px) {
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 100px 80px;
    }
  }

  @media (min-width: 768px) {
    .gallery-container {
      width: 90%;
      padding: 0 2rem;
    }
    
    .gallery-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 40px 40px;
      padding: 3rem 0;
    }
  }

  .gallery-item {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: opacity 0.3s ease;
    animation: fadeIn 0.8s ease forwards;
    opacity: 0;
  }

  .gallery-item:hover {
    opacity: 0.9;
  }

  .gallery-image-container {
    width: 100%;
    position: relative;
    overflow: hidden;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    max-width: 100%;
  }

  .gallery-modal {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    max-width: 100vw;
    justify-content: center;
    align-items: center;
  }

  .gallery-modal.active {
    opacity: 1;
  }

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    cursor: pointer;
  }

  .modal-content {
    position: relative;
    width: 90%;
    max-width: 95vw;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: modalFadeIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
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
    opacity: 0.7;
    transition: all 0.3s ease;
  }

  .close-button:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
    transform: scale(1.05);
  }

  .modal-image-container {
    position: relative;
    max-width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-image {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    opacity: 0;
    transition: opacity 0.5s ease;
    width: auto;
  }

  .modal-image.loaded {
    opacity: 1;
  }

  .modal-caption {
    margin-top: 16px;
    color: white;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 0.05em;
    opacity: 0.8;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalFadeIn {
    from { 
      opacity: 0;
      transform: scale(0.98);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
