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
    max-width: min(480px, calc(100vw - 48px));
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    font-family: var(--font-body, 'Quicksand', 'Nunito', sans-serif);
    color: var(--color-ink-strong, #3d2659);
    line-height: 1.6;
    letter-spacing: -0.01em;
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

  .typewriter-text {
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: clamp(1.2rem, 3.5vw, 1.8rem);
    font-weight: 500;
    line-height: 1.6;
    color: var(--color-ink-strong, #3d2659);
  }

  /* Cursor parpadeante */
  .cursor {
    display: inline-block;
    color: rgba(61, 38, 89, 0.4);
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

  /* Responsive: max-width más grande en pantallas grandes */
  @media (min-width: 768px) {
    .dialogue-bubble {
      max-width: 560px;
    }

    .typewriter-text {
      font-size: clamp(1.2rem, 3.5vw, 1.8rem);
      font-weight: 500;
      line-height: 1.6;
    }

    .bubble-hint {
      font-size: 0.85rem;
      margin-top: 20px;
    }
  }

  /* Estilos especiales para el mensaje de felicitación */
  .dialogue-bubble.special .bubble-content {
    font-family: var(--font-display, 'Klee One', cursive);
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 500;
    color: var(--color-ink-strong, #3d2659);
    text-align: center;
    line-height: 1.3;
    text-shadow: none;
  }

  @media (min-width: 768px) {
    .dialogue-bubble.special {
      max-width: 560px;
    }
  }

  @media (max-width: 767px) {
    .dialogue-bubble {
      max-width: min(460px, calc(100vw - 40px));
    }

    .typewriter-text {
      font-size: clamp(1.2rem, 3.5vw, 1.8rem);
      font-weight: 500;
      line-height: 1.6;
    }

    .dialogue-bubble.special .bubble-content {
      font-size: clamp(1.6rem, 7vw, 2.4rem);
    }
  }

  /* Hint para continuar */
  .bubble-hint {
    display: block;
    margin-top: 16px;
    font-size: 0.75rem;
    color: rgba(61, 38, 89, 0.35);
    pointer-events: none;
    z-index: 2;
    font-family: var(--font-body, 'Quicksand', 'Nunito', sans-serif);
    letter-spacing: 0.05em;
    text-align: right;
  }

  /* Responsive: ajustes en mobile */
  @media (max-width: 767px) {
    .bubble-hint {
      margin-top: 12px;
      font-size: 0.7rem;
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
