<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import PandaSVG from './PandaSVG.svelte';
  import DialogueBubble from './DialogueBubble.svelte';
  import { appPhase, dialogueStep, isScrolling } from '../stores/appState.js';

  // Array de diálogos del panda
  const dialogues = [
    {
      text: "Soy un panda,\nyo debería estar comiendo y durmiendo, pero me obligaron a estar acá.",
      pose: 'worried'
    },
    {
      text: "No entiendo de fechas,\nno uso el calendario. Pero me estudié lo que tengo que decir.",
      pose: 'eating'
    },
    {
      text: "Que alguien muy especial\nestá celebrando hoy",
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
      ? (viewportWidth >= 768 ? 140 : 100)
      : (viewportWidth >= 768 ? 260 : 200)
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

  <!-- Header superior -->
  {#if $appPhase !== 'gallery'}
    <header class="hero-header">
      <span class="hero-header-text">PARA MEI, CON CARIÑO</span>
      <span class="hero-header-sakura" aria-hidden="true">🌸</span>
    </header>
  {/if}

  <div class="hero-shell">
    <!-- Diálogo arriba -->
    <div class="dialogue-area">
      <div class="dialogue-container" role="region" aria-label="Diálogos del panda">
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

    <!-- Panda abajo -->
    <div class="panda-area">
      <div class="panda-container">
        <div class="panda-motion">
          <PandaSVG 
            pose={currentPose} 
            size={pandaSize}
          />
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
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.5s ease-out;
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

  /* Fase gallery: hero vuelve al flujo normal y colapsa */
  .hero.phase-gallery {
    position: relative;
    z-index: 1;
    min-height: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
  }

  .hero.phase-gallery .hero-shell {
    height: 0;
    min-height: 0;
    overflow: hidden;
  }

  .hero.phase-gallery .dialogue-area {
    height: 0;
    min-height: 0;
    overflow: hidden;
  }

  .hero.phase-gallery .panda-area {
    height: 0;
    min-height: 0;
    overflow: hidden;
  }

  .hero.phase-gallery .scroll-hint {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  /* Cursor pointer en fases clickables */
  .hero.clickable {
    cursor: pointer;
  }

  .hero-hitarea {
    position: absolute;
    inset: 0;
    z-index: 3;
    border: none;
    background: transparent;
  }

  .hero-hitarea:focus-visible {
    outline: 2px solid var(--color-primary-light);
    outline-offset: -2px;
  }

  /* Header superior */
  .hero-header {
    position: absolute;
    top: clamp(16px, 4vh, 40px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .hero-header-text {
    font-family: var(--font-accent);
    font-size: clamp(0.65rem, 1.5vw, 0.8rem);
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(61, 38, 89, 0.5);
  }

  .hero-header-sakura {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    opacity: 0.7;
  }

  /* Shell principal - layout vertical centrado */
  .hero-shell {
    height: 100dvh;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    z-index: 1;
  }

  /* Área de diálogo */
  .dialogue-area {
    height: 50%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .dialogue-container {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 120px;
    width: 100%;
    max-width: 480px;
  }

  /* Área del panda */
  .panda-area {
    height: 50%;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: env(safe-area-inset-bottom, 0);
    box-sizing: border-box;
  }

  .panda-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    transition: transform 0.6s ease;
  }

  /* En desktop, limitar tamaño del panda */
  @media (min-width: 768px) {
    .panda-container {
      max-width: 300px;
    }
  }

  .panda-motion {
    animation: pandaFloat 4s ease-in-out infinite;
  }

  @keyframes pandaFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
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
    color: var(--color-ink-strong, #2d0a3d);
    opacity: 0.7;
    text-align: center;
  }

  .scroll-arrow {
    font-size: 1rem;
    color: var(--color-ink-strong, #2d0a3d);
    opacity: 0.6;
    animation: bounce 1.5s ease-in-out infinite;
  }

  /* Desktop: ajustes */
  @media (min-width: 768px) {
    .hero-shell {
      height: 100dvh;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
      z-index: 1;
    }

    .dialogue-area {
      position: fixed;
      right: 60px;
      top: 50%;
      transform: translateY(-50%);
      max-width: 45%;
      width: auto;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      order: unset;
      flex: unset;
    }

    .panda-area {
      position: fixed;
      left: 60px;
      top: 50%;
      transform: translateY(-50%);
      width: auto;
      height: auto;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 0;
      order: unset;
      flex: unset;
      flex-direction: column;
    }

    .dialogue-container {
      min-height: 150px;
      max-width: 700px;
    }

    .hero-header {
      top: clamp(24px, 5vh, 56px);
    }

    .hero-header-text {
      font-size: clamp(0.8rem, 1.2vw, 1rem);
    }

    .hero-header-sakura {
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
    }

    .panda-container {
      max-width: 380px;
    }

    .scroll-hint {
      bottom: 60px;
    }

    /* Fase gallery: panda fixed en bottom-left */
    .hero.phase-gallery .panda-container {
      position: fixed;
      left: 24px;
      bottom: 24px;
      transform: none;
      z-index: 10;
    }
  }

  /* Mobile: posicionamiento */
  @media (max-width: 767px) {
    .hero {
      padding-top: 16px;
      padding-bottom: 120px;
    }

    .panda-area {
      height: 50%;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: env(safe-area-inset-bottom, 0);
      box-sizing: border-box;
    }

    .panda-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      transition: transform 0.6s ease;
    }

    .dialogue-area {
      padding: 0 16px;
    }

    .dialogue-container {
      min-height: 100px;
      max-height: 40vh;
    }

    /* Fase gallery: panda fixed en bottom-left */
    .hero.phase-gallery .panda-container {
      position: fixed;
      left: 12px;
      bottom: 100px;
      transform: none;
      z-index: 10;
    }

    .hero.phase-gallery .scroll-hint {
      bottom: clamp(120px, 20vh, 160px);
    }
  }

  /* Ajustes para pantallas pequeñas */
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
    .panda-motion,
    .scroll-hint {
      animation: none !important;
    }
    
    .scroll-arrow {
      animation: none !important;
    }
  }
</style>
