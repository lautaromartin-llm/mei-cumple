<script>
  import { fade } from 'svelte/transition';
  import GalleryFrame from './GalleryFrame.svelte';
  import { isScrolling } from '../stores/appState.js';
  const galleryBase = `${import.meta.env.BASE_URL}media/galery/`;
  
  // Datos de la galería con fotos reales y aspect-ratio variado
  let galleryItems = $state([
    {
      id: 1,
      imageUrl: `${galleryBase}1.jpeg`,
      type: 'photo',
      alt: '¡Soy ese!',
      aspectRatio: '776 / 350',
      rotate: '-1.5deg',
      translateY: '4px'
    },
    {
      id: 2,
      imageUrl: `${galleryBase}2.jpeg`,
      type: 'photo',
      alt: 'Toda una experiencia comer con palillos',
      aspectRatio: '480 / 853',
      rotate: '1deg',
      translateY: '-3px'
    },
    {
      id: 3,
      imageUrl: `${galleryBase}3.jpeg`,
      type: 'photo',
      alt: 'Si algún día te piso, prometo ir a tu funeral.',
      aspectRatio: '450 / 1000',
      rotate: '-1deg',
      translateY: '5px'
    },
    {
      id: 4,
      imageUrl: `${galleryBase}4.jpeg`,
      type: 'photo',
      alt: 'No recomiendo hacer pierna un día antes de jugar ping-pong.',
      aspectRatio: '1080 / 608',
      rotate: '1.5deg',
      translateY: '-2px'
    },
    {
      id: 5,
      imageUrl: `${galleryBase}5.jpeg`,
      type: 'photo',
      alt: 'Bazar que vemos, bazar al que nos metemos.',
      aspectRatio: '486 / 1080',
      rotate: '-0.5deg',
      translateY: '3px'
    },
    {
      id: 6,
      imageUrl: `${galleryBase}6.jpeg`,
      type: 'photo',
      alt: 'Cuenta la leyenda que Mei sigue empalagada.',
      aspectRatio: '1080 / 486',
      rotate: '1deg',
      translateY: '-4px'
    }
  ]);
</script>

{#if $isScrolling}
  <section 
    class="gallery"
    transition:fade={{ duration: 800 }}
    aria-label="Galería de momentos especiales"
  >
    <div class="gallery-container">
      <!-- Header de la galería -->
      <header class="gallery-header">
        <div class="gallery-header-content">
          <p class="gallery-kicker">思い出のギャラリー</p>
          <h2 class="gallery-title">Galería</h2>
        </div>
      </header>
      
      <!-- Grid de fotos -->
      <div class="gallery-photos" role="list">
        {#each galleryItems as item, index (item.id)}
          <div class="gallery-row" role="presentation">
            <div 
              class="gallery-item"
              role="listitem"
              aria-label={item.alt}
              style="--item-index:{index + 1};"
            >
              <GalleryFrame
                imageUrl={item.imageUrl}
                type={item.type}
                alt={item.alt}
                aspectRatio={item.aspectRatio}
              />
            </div>
          </div>
        {/each}
      </div>
      
    </div>
  </section>
{/if}

<style>
  .gallery {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: transparent;
    padding: clamp(40px, 6vw, 80px) var(--spacing-md) var(--spacing-xl);
    box-sizing: border-box;
  }
  
  .gallery-container {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
    position: relative;
  }

  /* Encabezado */
  .gallery-header {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: clamp(40px, 6vw, 64px);
    padding: 0 var(--spacing-sm);
  }

  .gallery-header-content {
    text-align: center;
  }

  .gallery-kicker {
    margin: 0 0 8px;
    color: var(--color-primary-light, #b8a0d1);
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.15em;
  }
  
  .gallery-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 6vw, 3.5rem);
    color: var(--color-ink-strong, #3d2659);
    margin: 0;
    letter-spacing: -0.03em;
    position: relative;
  }

  .gallery-title::after {
    content: '';
    display: block;
    width: 48px;
    height: 3px;
    background: var(--color-primary-light, #b8a0d1);
    margin: 12px auto 0;
    border-radius: 2px;
  }
  
  /* Fotos: mobile vertical */
  .gallery-photos {
    display: flex;
    flex-direction: column;
    gap: clamp(24px, 5vh, 40px);
    width: 100%;
  }

  .gallery-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .gallery-item {
    width: 100%;
    animation: slideUpFade 0.6s ease-out both;
    animation-delay: calc(var(--item-index) * 0.1s);
  }
  
  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Desktop: masonry real con columns */
  @media (min-width: 768px) {
    .gallery-container {
      max-width: 900px;
    }

    .gallery-header {
      margin-bottom: clamp(48px, 6vw, 72px);
    }

    .gallery-kicker {
      font-size: 0.95rem;
    }

    .gallery-title {
      font-size: clamp(2.2rem, 5vw, 4rem);
      letter-spacing: -0.02em;
    }

    .gallery-photos {
      display: block;
      columns: 2;
      column-gap: clamp(20px, 3vw, 32px);
    }

    .gallery-row {
      break-inside: avoid;
      margin-bottom: clamp(20px, 3vw, 32px);
      gap: clamp(16px, 3vw, 32px);
    }

    .gallery-item {
      max-width: 420px;
      margin: 0 auto;
    }
  }
  
  /* prefers-reduced-motion: anular animaciones y transforms */
  @media (prefers-reduced-motion: reduce) {
    .gallery-item {
      animation: none !important;
      transform: none !important;
    }
  }
</style>
