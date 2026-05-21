<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import PandaSVG from './PandaSVG.svelte';
  import DialogueBubble from './DialogueBubble.svelte';
  import { appPhase, dialogueStep, isScrolling } from '../stores/appState.js';

  // Array de diálogos del panda
  const dialogues = [
    {
      text: "Soy un panda, yo debería estar comiendo y durmiendo, pero me obligaron a estar acá.",
      pose: 'worried'
    },
    {
      text: "No entiendo de fechas, no uso el calendario. Pero me estudié lo que tengo que decir.",
      pose: 'eating'
    },
    {
      text: "Que alguien muy especial cumple años hoy",
      pose: 'looking'
    }
  ];

  // Estados locales
  let currentDialogueIndex = $state(0);
  let showContinueHint = $state(false);
  let isTransitioning = $state(false);
  let bubbleVisible = $state(true);
  let isTypingLocal = $state(true);
  
  // Referencia al DialogueBubble para poder hacer skip
  let dialogueBubbleRef = $state();

  // IDs de timers para limpieza
  let revealTimeout = $state();
  let celebrationTimeout = $state();
  let galleryTimeout = $state();
  let fadeTimeout = $state();

  // Determinar la pose actual del panda según la fase
  let currentPose = $derived(
    $appPhase === 'intro' ? (dialogues[currentDialogueIndex]?.pose || 'eating') :
    $appPhase === 'reveal' ? 'looking' :
    $appPhase === 'celebration' ? 'side' :
    $appPhase === 'gallery' ? 'side' : 'eating'
  );

  // Viewport width para cálculos responsivos
  let viewportWidth = $state(1024);

  // Tamaño del panda derivado según fase y viewport
  let pandaSize = $derived(
    $appPhase === 'gallery'
      ? (viewportWidth >= 768 ? 160 : 110)
      : (viewportWidth >= 768 ? 300 : 180)
  );
  
  // Configurar listener de resize para reactividad
  onMount(() => {
    const updateSize = () => { viewportWidth = window.innerWidth; };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  });

  // Cleanup de timers al desmontar
  onDestroy(() => {
    clearTimeout(revealTimeout);
    clearTimeout(celebrationTimeout);
    clearTimeout(galleryTimeout);
    clearTimeout(fadeTimeout);
  });

  // Manejar cuando el typewriter termina de escribir
  function handleDialogueComplete() {
    isTypingLocal = false;
    if ($appPhase === 'intro') {
      showContinueHint = true;
    }
  }

  // Manejar click en la hero (skip o avanzar)
  function handleHeroClick() {
    if ($appPhase === 'intro') {
      // Si el typewriter está escribiendo, hacer skip
      if (isTypingLocal && dialogueBubbleRef) {
        dialogueBubbleRef.skip();
        isTypingLocal = false;
        showContinueHint = true;
        return;
      }
      
      // Si ya terminó de escribir, avanzar al siguiente diálogo
      if (showContinueHint && !isTransitioning) {
        advanceDialogue();
      }
    }
  }

  // Avanzar al siguiente diálogo o fase
  function advanceDialogue() {
    isTransitioning = true;
    showContinueHint = false;
    isTypingLocal = true;
    
    // Limpiar timeouts anteriores
    clearTimeout(revealTimeout);
    clearTimeout(celebrationTimeout);
    clearTimeout(galleryTimeout);
    clearTimeout(fadeTimeout);
    
    // Fade out de la burbuja actual
    bubbleVisible = false;
    
    fadeTimeout = setTimeout(() => {
      if (currentDialogueIndex < dialogues.length - 1) {
        // Avanzar al siguiente diálogo
        currentDialogueIndex++;
        dialogueStep.set(currentDialogueIndex);
        
        // Fade in de la nueva burbuja
        bubbleVisible = true;
        isTransitioning = false;
      } else {
        // Era el último diálogo, transición a reveal
        appPhase.set('reveal');
        bubbleVisible = true;
        isTransitioning = false;
        
        // Auto-transición a celebration después de 1.5-2 segundos
        revealTimeout = setTimeout(() => {
          if ($appPhase === 'reveal') {
            appPhase.set('celebration');
            
            // Auto-transición a gallery después de ~3 segundos
            celebrationTimeout = setTimeout(() => {
              if ($appPhase === 'celebration') {
                transitionToGallery();
              }
            }, 3000);
          }
        }, 1800);
      }
    }, 300); // Esperar a que termine el fade out
  }

  // Transición a la galería
  function transitionToGallery() {
    appPhase.set('gallery');
    isScrolling.set(true);
    bubbleVisible = false;

    // Auto-scroll a la galería
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const gallery = document.querySelector('.gallery');
        if (gallery) {
          gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Determinar las clases CSS según la fase
  let heroClasses = $derived(
    `hero phase-${$appPhase} ${($appPhase === 'intro' || $appPhase === 'reveal') ? 'clickable' : ''}`
  );
</script>

<div class={heroClasses}>
  {#if $appPhase === 'intro'}
    <button
      class="hero-hitarea"
      type="button"
      onclick={handleHeroClick}
      aria-label="Sección principal con panda interactivo. Haz click para continuar la conversación."
    ></button>
  {/if}

  <div class="hero-shell">
    <div class="panda-column">
      <div class="panda-container">
        <div class="panda-motion">
          <PandaSVG 
            pose={currentPose} 
            size={pandaSize}
          />
        </div>
      </div>
    </div>

    <div class="dialogue-column">
      <div class="dialogue-panel" class:special-panel={$appPhase === 'reveal' || $appPhase === 'celebration'}>
        <p class="eyebrow">Para Mei, con cariño</p>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div class="dialogue-container" tabindex="0" role="region" aria-label="Diálogos del panda">
          {#if $appPhase === 'intro'}
            {#key currentDialogueIndex}
              {#if bubbleVisible}
                <div transition:fade={{ duration: 300 }}>
                  <DialogueBubble
                    bind:this={dialogueBubbleRef}
                    text={dialogues[currentDialogueIndex].text}
                    speed={50}
                    visible={bubbleVisible}
                    position="left"
                    showHint={showContinueHint}
                    onComplete={handleDialogueComplete}
                  />
                </div>
              {/if}
            {/key}
            

          {:else if $appPhase === 'reveal' || $appPhase === 'celebration'}
            {#if bubbleVisible}
              <div transition:fade={{ duration: 300 }}>
                <DialogueBubble
                  text="¡Feliz cumpleaños, Mei! 💜"
                  speed={70}
                  visible={bubbleVisible}
                  position="left"
                  special={true}
                  onComplete={() => {}}
                />
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Hint de scroll en fase gallery -->
  {#if $appPhase === 'gallery'}
    <div class="scroll-hint" aria-hidden="true">
      <span class="scroll-arrow">↓</span>
      <span class="scroll-text">Seguí explorando la galería</span>
      <span class="scroll-arrow">↓</span>
    </div>
  {/if}
</div>

<style>
  .hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 20px;
    box-sizing: border-box;
    transition: all 0.5s ease-out;
  }

  .hero-shell {
    width: min(1180px, 100%);
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: clamp(12px, 2vw, 32px);
    position: relative;
    z-index: 1;
  }

  .hero-hitarea {
    position: absolute;
    inset: 0;
    z-index: 3;
    border: none;
    background: transparent;
  }

  /* Mobile: layout vertical */
  @media (max-width: 767px) {
    .hero-shell {
      gap: 20px;
    }
    
    .panda-column {
      order: 2;
    }
  }

  /* Fases intro, reveal, celebration: hero absolute y fixed */
  .hero.phase-intro,
  .hero.phase-reveal,
  .hero.phase-celebration {
    position: absolute;
    inset: 0;
    z-index: 10;
    overflow: hidden;
  }

  /* Fase gallery: hero vuelve al flujo normal */
  .hero.phase-gallery {
    position: relative;
    z-index: 1;
    min-height: auto;
    padding: 0;
  }

  .hero.phase-gallery .dialogue-column {
    display: none;
  }

  /* Cursor pointer en fases clickables */
  .hero.clickable {
    cursor: pointer;
  }

  .panda-column,
  .dialogue-column {
    position: relative;
  }

  .panda-column {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
  }

  .dialogue-column {
    flex: 0 1 auto;
    max-width: 640px;
  }

  /* Contenedor del diálogo */
  .dialogue-container {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 120px;
  }

  .dialogue-panel {
    position: relative;
    padding: clamp(20px, 4vw, 44px);
    border-radius: 40px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06)),
      radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 48%);
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 24px 60px rgba(72, 16, 119, 0.16);
    backdrop-filter: blur(2px);
  }

  .dialogue-panel.special-panel {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.17), rgba(255,255,255,0.08)),
      radial-gradient(circle at top right, rgba(249,168,212,0.28), transparent 45%);
  }

  .eyebrow {
    margin: 0 0 16px;
    color: rgba(255,255,255,0.92);
    font-family: var(--font-accent);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  /* Contenedor del panda */
  .panda-container {
    position: fixed;
    left: clamp(18px, 5vw, 80px);
    bottom: clamp(18px, 5vh, 52px);
    z-index: 4;
    flex-shrink: 0;
    pointer-events: none;
    transition: left 0.6s ease, right 0.6s ease, bottom 0.6s ease, transform 0.6s ease;
  }

  .panda-motion {
    animation: pandaFloat 3s ease-in-out infinite;
  }

  @keyframes pandaFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }



  /* Keyframes reutilizables */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(4px); }
  }

  /* Hint de scroll */
  .scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    animation: fadeInUp 0.5s ease-out, pulse 2s ease-in-out infinite;
  }

  .scroll-text {
    font-family: var(--font-body, 'Quicksand', sans-serif);
    font-size: 0.9rem;
    color: var(--color-white, #ffffff);
    opacity: 0.9;
    text-align: center;
  }

  .scroll-arrow {
    font-size: 1rem;
    color: var(--color-white, #ffffff);
    animation: bounce 1.5s ease-in-out infinite;
  }

  /* Desktop: posicionamiento del panda según fase */
  @media (min-width: 768px) {
    .hero-shell {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: clamp(12px, 2vw, 32px);
    }

    .panda-column {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex: 0 0 auto;
    }

    .dialogue-column {
      flex: 0 1 auto;
      max-width: 640px;
    }

    .dialogue-container {
      min-height: 150px;
    }

    .scroll-hint {
      bottom: 60px;
    }

    /* Fases intro, reveal, celebration: panda fixed centrado verticalmente */
    .hero.phase-intro .panda-container,
    .hero.phase-reveal .panda-container,
    .hero.phase-celebration .panda-container {
      position: fixed;
      left: clamp(18px, 5vw, 80px);
      top: 50%;
      transform: translateY(-50%);
      bottom: auto;
      right: auto;
    }

    /* Fase gallery: panda fixed en bottom-left */
    .hero.phase-gallery .panda-container {
      position: fixed;
      left: 24px;
      bottom: 24px;
      right: auto;
      transform: none;
    }

    /* Ajustes para evitar solapamiento entre diálogo y panda en desktop */
    /* El panda está fixed en bottom-left con left: clamp(24px, 6vw, 80px) y width: 300px */
    /* Necesitamos suficiente margin-left en la dialogue-column para que no se superpongan */
    .hero.phase-intro .dialogue-column,
    .hero.phase-reveal .dialogue-column,
    .hero.phase-celebration .dialogue-column {
      margin-left: clamp(340px, 6vw + 320px, 400px);
    }

    /* Para pantallas medianas, ajustar el margen */
    @media (min-width: 768px) and (max-width: 1024px) {
      .hero.phase-intro .dialogue-column,
      .hero.phase-reveal .dialogue-column,
      .hero.phase-celebration .dialogue-column {
        margin-left: clamp(280px, 40vw, 340px);
      }
    }
  }

  /* Mobile: posicionamiento del panda según fase */
  @media (max-width: 767px) {
    .hero {
      padding-top: 28px;
      padding-bottom: 120px;
    }

    .hero-shell {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: clamp(20px, 4vh, 32px);
      min-height: 50vh;
      padding-top: 5vh;
    }

    .panda-column {
      order: 2;
      width: 100%;
      justify-content: center;
    }

    .dialogue-column {
      width: 100%;
      max-width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .dialogue-panel {
      border-radius: 28px;
      padding: 22px 18px;
    }

    .dialogue-container {
      min-height: 104px;
      max-height: 50vh;
      overflow-y: auto;
      scrollbar-gutter: stable;
    }

    .eyebrow {
      margin-bottom: 12px;
      font-size: 0.72rem;
      letter-spacing: 0.18em;
    }

    .hero.phase-gallery .hero-shell {
      gap: 10px;
    }

    /* Fases intro, reveal, celebration: panda fixed centrado horizontal, por encima del footer */
    .hero.phase-intro .panda-container,
    .hero.phase-reveal .panda-container,
    .hero.phase-celebration .panda-container {
      position: fixed;
      left: 50%;
      bottom: clamp(100px, 15vh, 140px);
      transform: translateX(-50%);
      right: auto;
      top: auto;
    }

    /* Fase gallery: panda fixed en bottom-left */
    .hero.phase-gallery .panda-container {
      position: fixed;
      left: 12px;
      bottom: 12px;
      transform: none;
    }

    /* Fase gallery: colapsar altura para eliminar zona muerta en mobile */
    .hero.phase-gallery {
      min-height: auto;
      padding-bottom: 140px; /* espacio para el panda fixed + scroll-hint */
    }

    .hero.phase-gallery .hero-shell {
      min-height: auto;
      padding-bottom: 0;
    }

    .hero.phase-gallery .scroll-hint {
      bottom: clamp(140px, 20vh, 180px);
    }
  }

  /* Ajustes para pantallas pequeñas (480px y 360px) */
  @media (max-width: 480px) {
    .hero {
      padding-bottom: 100px;
    }
  }

  @media (max-width: 360px) {
    .hero {
      padding-bottom: 90px;
    }
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    .hero,
    .panda-container,
    .scroll-hint {
      animation: none !important;
    }
    
    .scroll-arrow {
      animation: none !important;
    }
  }
</style>
