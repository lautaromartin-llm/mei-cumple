<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  
  // Props usando Svelte 5 runes
  let { 
    text = '', 
    speed = 50, 
    visible = true, 
    position = 'top',
    special = false,
    showHint = false,
    onComplete = () => {}
  } = $props();

  // Estados reactivos
  let displayedText = $state('');
  let isTyping = $state(false);
  let showCursor = $state(false);
  
  // Exponer getters para el componente padre
  export function getDisplayedText() { return displayedText; }
  export function getIsTyping() { return isTyping; }

  // Referencias para limpiar timers
  let typingInterval;
  let cursorTimeout;

  /**
   * Salta el typewriter y muestra el texto completo instantáneamente
   */
  export function skip() {
    if (isTyping) {
      clearInterval(typingInterval);
      clearTimeout(cursorTimeout);
      displayedText = text;
      isTyping = false;
      showCursor = false;
      // Llamar onComplete inmediatamente (sincrónicamente)
      onComplete();
    }
  }

  /**
   * Escapa HTML para prevenir XSS, permitiendo solo saltos de línea
   */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Inicia el efecto typewriter
   */
  function startTyping() {
    // Limpiar timers anteriores
    clearInterval(typingInterval);
    clearTimeout(cursorTimeout);
    
    // Reiniciar estados
    displayedText = '';
    isTyping = true;
    showCursor = true;
    
    let i = 0;
    
    typingInterval = setInterval(() => {
      if (i < text.length) {
        displayedText += text[i];
        i++;
      } else {
        // Terminó de escribir
        clearInterval(typingInterval);
        isTyping = false;
        
        // Llamar onComplete inmediatamente
        onComplete();
        
        // Ocultar cursor después de 1 segundo
        cursorTimeout = setTimeout(() => {
          showCursor = false;
        }, 1000);
      }
    }, speed);
  }

  onMount(() => {
    if (visible) {
      startTyping();
    }
  });

  onDestroy(() => {
    clearInterval(typingInterval);
    clearTimeout(cursorTimeout);
  });
</script>

{#if visible}
  <div 
    class="dialogue-bubble"
    class:position-bottom={position === 'bottom'}
    class:position-left={position === 'left'}
    class:special
    role="status"
    aria-live="polite"
    aria-label="Diálogo"
    out:fade={{ duration: 300 }}
  >
    <div class="bubble-content">
      <span class="typewriter-text">
        {#if displayedText.includes('\n')}
          {@html escapeHtml(displayedText).replace(/\n/g, '<br>')}
        {:else}
          {displayedText}
        {/if}
      </span>
      {#if showCursor}
        <span class="cursor">|</span>
      {/if}
    </div>
    <div class="bubble-tail"></div>
    {#if showHint}
      <span class="bubble-hint" aria-hidden="true">Click para continuar</span>
    {/if}
  </div>
{/if}

<style>
  /* Contenedor principal de la burbuja */
  .dialogue-bubble {
    position: relative;
    box-sizing: border-box;
    max-width: min(520px, calc(100vw - 32px));
    padding: 8px 0 8px 22px;
    background: transparent;
    border: none;
    box-shadow: none;
    font-family: var(--font-body, 'Quicksand', 'Nunito', sans-serif);
    font-size: clamp(1.8rem, 4.4vw, 3.35rem);
    color: var(--color-ink-strong, #161124);
    line-height: 1.22;
    letter-spacing: -0.03em;
    animation: bubbleIn 0.3s ease-out forwards;
  }

  /* Animación de entrada */
  @keyframes bubbleIn {
    from { 
      opacity: 0; 
      transform: translateY(10px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }

  /* Contenido del texto */
  .bubble-content {
    position: relative;
    z-index: 1;
    text-wrap: balance;
  }

  /* Texto del typewriter */
  .typewriter-text {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  /* Cursor parpadeante */
  .cursor {
    display: inline-block;
    color: rgba(22, 17, 36, 0.55);
    font-weight: 300;
    animation: cursorBlink 0.8s infinite;
    margin-left: 2px;
  }

  @keyframes cursorBlink {
    0%, 100% { 
      opacity: 1; 
    }
    50% { 
      opacity: 0; 
    }
  }

  /* Cola de la burbuja (por defecto apunta hacia abajo - position: top) */
  .bubble-tail {
    display: none;
  }

  /* Cola interior para efecto sólido */
  .dialogue-bubble::before {
    content: '✦';
    position: absolute;
    left: 0;
    top: 0.22em;
    color: var(--color-hero-accent, #ffe47a);
    font-size: 0.58em;
    line-height: 1;
  }

  /* Responsive: max-width más grande en pantallas grandes */
  @media (min-width: 768px) {
    .dialogue-bubble {
      max-width: 640px;
    }
  }

  /* Estilos especiales para el mensaje de felicitación */
  .dialogue-bubble.special {
    max-width: min(560px, calc(100vw - 32px));
  }

  .dialogue-bubble.special .bubble-content {
    font-family: var(--font-display, 'Klee One', cursive);
    font-size: clamp(2.1rem, 5vw, 3.9rem);
    color: var(--color-white, #ffffff);
    text-shadow: 0 4px 18px rgba(72, 16, 119, 0.34);
  }

  @media (min-width: 768px) {
    .dialogue-bubble.special {
      max-width: 640px;
    }
  }

  @media (max-width: 767px) {
    .dialogue-bubble {
      padding: 8px 0 8px 16px;
      font-size: clamp(1.35rem, 7.2vw, 2rem);
      line-height: 1.28;
    }

    .dialogue-bubble.special .bubble-content {
      font-size: clamp(1.65rem, 7.8vw, 2.35rem);
    }
  }

  /* Hint para continuar */
  .bubble-hint {
    position: absolute;
    bottom: 8px;
    right: 16px;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
    z-index: 2;
    font-family: var(--font-body, 'Quicksand', 'Nunito', sans-serif);
    letter-spacing: 0.02em;
  }

  /* Responsive: ajustes en mobile */
  @media (max-width: 767px) {
    .bubble-hint {
      bottom: 6px;
      right: 12px;
    }
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    .cursor {
      animation: none;
      opacity: 1;
    }
    .dialogue-bubble {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
