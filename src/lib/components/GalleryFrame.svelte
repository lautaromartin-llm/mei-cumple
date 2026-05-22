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

<!-- Marco Polaroid Individual -->
<button
  class="gallery-frame"
  onclick={openLightbox}
  type="button"
  aria-label={`Abrir ${type === 'video' ? 'video' : 'imagen'}: ${alt}`}
>
  <!-- Contenedor de la imagen con passe-partout -->
  <div class="image-container">
    {#if type === 'video'}
      <!-- Overlay de video -->
      <div class="video-overlay" aria-hidden="true">
        <svg class="play-icon" viewBox="0 0 64 64" width="48" height="48">
          <circle cx="32" cy="32" r="30" fill="rgba(124, 92, 156, 0.9)" />
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
  
  <!-- Caption debajo de la foto -->
  <span class="frame-caption">{alt}</span>
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
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    background: #ffffff;
    border-radius: 12px;
    padding: 10px 10px 14px 10px;
    border: 1px solid rgba(61, 38, 89, 0.08);
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(61, 38, 89, 0.08);
    transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
    text-align: left;
    overflow: hidden;
    align-self: flex-start;
  }
  
  .gallery-frame:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 32px rgba(61, 38, 89, 0.12);
  }
  
  .gallery-frame:focus-visible {
    outline: 3px solid var(--color-primary-light);
    outline-offset: 2px;
  }
  
  .image-container {
    position: relative;
    width: 100%;
    height: auto;
    background: transparent;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
  }
  
  .image-container img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 6px;
    transition: transform 0.4s ease-out;
  }
  
  .gallery-frame:hover .image-container img {
    transform: scale(1.03);
  }
  
  /* Caption debajo de la foto */
  .frame-caption {
    display: block;
    margin-top: 10px;
    font-family: var(--font-body, 'Quicksand', sans-serif);
    font-size: 0.8rem;
    color: var(--color-caption, #7c5c9c);
    text-align: center;
    line-height: 1.4;
    padding: 0 4px;
    font-weight: 500;
  }
  
  /* Overlay de video */
  .video-overlay {
    position: absolute;
    inset: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(124, 92, 156, 0.1);
    border-radius: 4px;
    z-index: 1;
    transition: background 0.3s ease;
  }
  
  .gallery-frame:hover .video-overlay {
    background: rgba(124, 92, 156, 0.15);
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
    border-radius: 12px;
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
  
  /* Desktop */
  @media (min-width: 768px) {
    .gallery-frame {
      max-width: 420px;
      align-self: center;
      padding: 8px 8px 12px 8px;
    }

    .frame-caption {
      font-size: 0.8rem;
      margin-top: 8px;
    }
  }

  /* Responsive */
  @media (max-width: 480px) {
    .gallery-frame {
      padding: 8px 8px 12px 8px;
    }
    
    .frame-caption {
      font-size: 0.75rem;
      margin-top: 8px;
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
