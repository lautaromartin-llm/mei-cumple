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
      alt: 'Foto de un momento especial capturado',
      aspectRatio: '776 / 350',
      rotate: '-1.5deg',
      translateY: '4px'
    },
    {
      id: 2,
      imageUrl: `${galleryBase}2.jpeg`,
      type: 'photo',
      alt: 'Foto de sonrisas felices compartidas',
      aspectRatio: '480 / 853',
      rotate: '1deg',
      translateY: '-3px'
    },
    {
      id: 3,
      imageUrl: `${galleryBase}3.jpeg`,
      type: 'photo',
      alt: 'Un recuerdo inolvidable para siempre',
      aspectRatio: '450 / 1000',
      rotate: '-1deg',
      translateY: '5px'
    },
    {
      id: 4,
      imageUrl: `${galleryBase}4.jpeg`,
      type: 'photo',
      alt: 'Celebración del día especial',
      aspectRatio: '1080 / 608',
      rotate: '1.5deg',
      translateY: '-2px'
    },
    {
      id: 5,
      imageUrl: `${galleryBase}5.jpeg`,
      type: 'photo',
      alt: 'Momento de amistad verdadera',
      aspectRatio: '486 / 1080',
      rotate: '-0.5deg',
      translateY: '3px'
    },
    {
      id: 6,
      imageUrl: `${galleryBase}6.jpeg`,
      type: 'photo',
      alt: 'Risas y diversión sin fin',
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
      <div class="gallery-shell">
        <div class="gallery-main">
          <header class="gallery-header">
            <p class="gallery-kicker">Tus recuerdos van acá</p>
            <h2 class="gallery-title">Galería</h2>
          </header>
          
          <div class="gallery-grid" role="list">
            {#each galleryItems as item, index (item.id)}
              <div 
                class="gallery-item"
                role="listitem" 
                style="--item-index:{index + 1}; --item-rotate:{item.rotate}; --item-translateY:{item.translateY};"
              >
                <GalleryFrame
                  imageUrl={item.imageUrl}
                  type={item.type}
                  alt={item.alt}
                  aspectRatio={item.aspectRatio}
                />
              </div>
            {/each}
          </div>
        </div>
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
    padding: clamp(32px, 5vw, 64px) var(--spacing-md) var(--spacing-xl);
    box-sizing: border-box;
  }
  
  .gallery-container {
    max-width: 1220px;
    margin: 0 auto;
    width: 100%;
  }

  .gallery-shell {
    display: block;
  }
  
  /* Encabezado */
  .gallery-header {
    text-align: left;
    margin-bottom: clamp(24px, 4vw, 42px);
    padding: 0 var(--spacing-sm);
  }

  .gallery-kicker {
    margin: 0 0 10px;
    color: rgba(255, 255, 255, 0.84);
    text-transform: uppercase;
    letter-spacing: 0.22em;
    font-size: 0.78rem;
    font-weight: 700;
  }
  
  .gallery-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    color: var(--color-white);
    margin: 0 0 8px 0;
    text-shadow: 0 8px 18px rgba(72, 16, 119, 0.24);
    letter-spacing: -0.03em;
  }
  
  /* Mobile y Tablet: CSS Columns masonry de 2 columnas */
  .gallery-grid {
    display: block;
    columns: 2;
    column-gap: 16px;
    gap: 0;
    padding: var(--spacing-md) var(--spacing-sm);
    box-sizing: border-box;
  }

  .gallery-item {
    width: 100%;
    height: auto;
    display: block;
    break-inside: avoid;
    margin-bottom: 16px;
    padding: clamp(6px, 1vw, 12px);
    box-sizing: border-box;
    animation: slideUpFade 0.6s ease-out both;
    animation-delay: calc(var(--item-index) * 0.06s);
  }
  
  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(28px) rotate(var(--item-rotate, 0deg)) translateY(var(--item-translateY, 0px)) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) rotate(var(--item-rotate, 0deg)) translateY(var(--item-translateY, 0px)) scale(1);
    }
  }

  /* Desktop: CSS Columns (masonry) de 3 columnas */
  @media (min-width: 1024px) {
    .gallery-grid {
      columns: 3;
      column-gap: clamp(24px, 3vw, 40px);
      padding: var(--spacing-md) var(--spacing-sm);
    }

    .gallery-item {
      break-inside: avoid;
      margin-bottom: clamp(20px, 3vh, 32px);
      width: 100%;
      padding: clamp(8px, 1.2vw, 14px);
    }
  }

  @media (max-width: 1023px) {
    .gallery-header {
      text-align: center;
    }
  }

  @media (max-width: 520px) {
    .gallery-grid {
      columns: 1;
    }
    .gallery-item {
      margin-bottom: 12px;
      padding: clamp(4px, 1.5vw, 8px);
    }
  }
  
  /* prefers-reduced-motion: anular animaciones y transforms */
  @media (prefers-reduced-motion: reduce) {
    .gallery-item {
      animation: none !important;
      transform: none !important;
      --item-rotate: 0deg;
      --item-translateY: 0px;
    }
  }
</style>
