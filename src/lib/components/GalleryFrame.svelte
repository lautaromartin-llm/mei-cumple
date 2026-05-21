<script>
  let { imageUrl = '', type = 'photo', alt = '' } = $props();
  
  let showLightbox = $state(false);
  let closeButtonRef = $state();
  let previouslyFocusedElement = $state(null);
  
  function openLightbox() {
    previouslyFocusedElement = document.activeElement;
    showLightbox = true;
    document.body.style.overflow = 'hidden';
    // Auto-focus al botón de cerrar después de renderizar
    setTimeout(() => closeButtonRef?.focus(), 10);
  }
  
  function closeLightbox() {
    showLightbox = false;
    document.body.style.overflow = '';
    // Restaurar foco al elemento anterior
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
  
  function handleKeydown(e) {
    if (e.key === 'Escape' && showLightbox) {
      e.preventDefault();
      closeLightbox();
      return;
    }
    
    // Focus trap: solo el botón de cerrar es focusable en el lightbox
    if (e.key === 'Tab') {
      e.preventDefault();
      // Mantener el foco en el botón de cerrar (único elemento focusable)
      closeButtonRef?.focus();
    }
  }
  
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  }
</script>

<!-- Marco Kawaii Individual -->
<button
  class="gallery-frame"
  onclick={openLightbox}
  type="button"
  aria-label={`Abrir ${type === 'video' ? 'video' : 'imagen'}: ${alt}`}
>
  <!-- Decoración de esquinas - flores de cerezo -->
  <div class="corner-decoration top-left" aria-hidden="true">
    <svg viewBox="0 0 30 30" width="24" height="24">
      <g fill="var(--color-sakura)">
        <ellipse cx="15" cy="8" rx="4" ry="6" />
        <ellipse cx="8" cy="15" rx="6" ry="4" />
        <ellipse cx="22" cy="15" rx="6" ry="4" />
        <ellipse cx="15" cy="22" rx="4" ry="6" />
        <circle cx="15" cy="15" r="3" fill="var(--color-sakura-light)" />
      </g>
    </svg>
  </div>
  <div class="corner-decoration top-right" aria-hidden="true">
    <svg viewBox="0 0 30 30" width="24" height="24">
      <g fill="var(--color-sakura)">
        <ellipse cx="15" cy="8" rx="4" ry="6" />
        <ellipse cx="8" cy="15" rx="6" ry="4" />
        <ellipse cx="22" cy="15" rx="6" ry="4" />
        <ellipse cx="15" cy="22" rx="4" ry="6" />
        <circle cx="15" cy="15" r="3" fill="var(--color-sakura-light)" />
      </g>
    </svg>
  </div>
  <div class="corner-decoration bottom-left" aria-hidden="true">
    <svg viewBox="0 0 30 30" width="24" height="24">
      <g fill="var(--color-sakura)">
        <ellipse cx="15" cy="8" rx="4" ry="6" />
        <ellipse cx="8" cy="15" rx="6" ry="4" />
        <ellipse cx="22" cy="15" rx="6" ry="4" />
        <ellipse cx="15" cy="22" rx="4" ry="6" />
        <circle cx="15" cy="15" r="3" fill="var(--color-sakura-light)" />
      </g>
    </svg>
  </div>
  <div class="corner-decoration bottom-right" aria-hidden="true">
    <svg viewBox="0 0 30 30" width="24" height="24">
      <g fill="var(--color-sakura)">
        <ellipse cx="15" cy="8" rx="4" ry="6" />
        <ellipse cx="8" cy="15" rx="6" ry="4" />
        <ellipse cx="22" cy="15" rx="6" ry="4" />
        <ellipse cx="15" cy="22" rx="4" ry="6" />
        <circle cx="15" cy="15" r="3" fill="var(--color-sakura-light)" />
      </g>
    </svg>
  </div>
  
  <!-- Contenedor de la imagen con passe-partout -->
  <div class="image-container">
    {#if type === 'video'}
      <!-- Overlay de video -->
      <div class="video-overlay" aria-hidden="true">
        <svg class="play-icon" viewBox="0 0 64 64" width="48" height="48">
          <circle cx="32" cy="32" r="30" fill="rgba(131, 7, 156, 0.9)" />
          <polygon points="26,20 26,44 46,32" fill="white" />
        </svg>
      </div>
    {/if}
    <img 
      src={imageUrl} 
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  </div>
</button>

<!-- Lightbox Modal -->
{#if showLightbox}
  <div 
    class="lightbox-overlay"
    onclick={handleOverlayClick}
    onkeydown={handleKeydown}
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label={`${type === 'video' ? 'Video' : 'Imagen'} ampliada`}
  >
    <button 
      class="lightbox-close" 
      onclick={closeLightbox}
      aria-label="Cerrar lightbox"
      type="button"
      bind:this={closeButtonRef}
    >
      ×
    </button>
    
    <div class="lightbox-content">
      {#if type === 'video'}
        <div class="video-placeholder">
          <div class="video-placeholder-icon">🎬</div>
          <p class="video-placeholder-text">Video próximamente</p>
          <p class="video-placeholder-subtext">Estamos preparando algo especial para ti 💜</p>
        </div>
      {:else}
        <img 
          src={imageUrl} 
          alt={alt}
          class="lightbox-image"
        />
      {/if}
    </div>
  </div>
{/if}

<style>
  .gallery-frame {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.16)),
      var(--color-frame-floral);
    background-size: auto, 180px 180px;
    border-radius: 18px;
    padding: 14px;
    border: 1px solid rgba(49, 12, 68, 0.18);
    cursor: pointer;
    box-shadow: 0 16px 32px rgba(48, 16, 80, 0.2);
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
    text-align: left;
    overflow: visible;
    align-self: flex-start;
  }
  
  .gallery-frame:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 22px 40px rgba(48, 16, 80, 0.26);
  }
  
  .gallery-frame:focus-visible {
    outline: 3px solid var(--color-primary-light);
    outline-offset: 2px;
  }
  
  .corner-decoration {
    position: absolute;
    width: 56px;
    height: 56px;
    z-index: 3;
    pointer-events: none;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12));
  }
  
  .corner-decoration.top-left {
    top: -20px;
    left: -8px;
  }
  
  .corner-decoration.top-right {
    top: -20px;
    right: -8px;
  }
  
  .corner-decoration.bottom-left {
    bottom: -20px;
    left: -8px;
  }
  
  .corner-decoration.bottom-right {
    bottom: -20px;
    right: -8px;
  }

  .corner-decoration svg {
    width: 100%;
    height: 100%;
  }
  
  .image-container {
    position: relative;
    width: 100%;
    height: auto;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 6px solid rgba(255,255,255,0.65);
    box-shadow: inset 0 0 0 1px rgba(49, 12, 68, 0.12);
  }
  
  .image-container img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    transition: transform 0.3s ease-out;
  }
  
  .gallery-frame:hover .image-container img {
    transform: scale(1.03);
  }
  
  /* Overlay de video */
  .video-overlay {
    position: absolute;
    inset: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(131, 7, 156, 0.1);
    border-radius: 4px;
    z-index: 1;
    transition: background 0.3s ease;
  }
  
  .gallery-frame:hover .video-overlay {
    background: rgba(131, 7, 156, 0.15);
  }
  
  .play-icon {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease-out;
  }
  
  .gallery-frame:hover .play-icon {
    transform: scale(1.1);
  }
  
  /* Lightbox Overlay */
  .lightbox-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* Botón cerrar */
  .lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    color: white;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    z-index: 1001;
  }
  
  .lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  .lightbox-close:focus-visible {
    outline: 3px solid var(--color-primary-light);
    outline-offset: 2px;
  }
  
  /* Contenido del lightbox */
  .lightbox-content {
    max-width: 90vw;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: scaleIn 0.3s ease-out;
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.9);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .lightbox-image {
    max-width: 100%;
    max-height: 75vh;
    object-fit: contain;
    border-radius: var(--radius-md);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  /* Placeholder de video */
  .video-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    border-radius: var(--radius-lg);
    padding: 60px 40px;
    min-width: 300px;
    text-align: center;
  }
  
  .video-placeholder-icon {
    font-size: 4rem;
    margin-bottom: 16px;
  }
  
  .video-placeholder-text {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: white;
    margin: 0 0 8px 0;
  }
  
  .video-placeholder-subtext {
    font-family: var(--font-body);
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }
  
  /* Responsive */
  @media (max-width: 480px) {
    .gallery-frame {
      padding: 12px;
    }
    
    .corner-decoration {
      width: 48px;
      height: 48px;
    }
    
    .lightbox-close {
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      font-size: 24px;
    }
    
    .video-placeholder {
      padding: 40px 24px;
      min-width: 260px;
    }
    
    .video-placeholder-text {
      font-size: 1.25rem;
    }
  }
  
  /* prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    .gallery-frame,
    .gallery-frame:hover,
    .image-container img,
    .play-icon,
    .lightbox-close,
    .lightbox-overlay,
    .lightbox-content,
    .video-overlay {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
    
    .gallery-frame:hover {
      box-shadow: var(--shadow-medium);
    }
  }
</style>
