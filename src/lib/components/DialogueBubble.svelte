<script>
  // Props usando Svelte 5 runes
  let { 
    text = '', 
    speed = 50, 
    visible = true, 
    position = 'top' 
  } = $props();

  // Estados reactivos
  let displayedText = $state('');
  let isTyping = $state(false);
  let showCursor = $state(false);

  // Referencias para limpiar timers
  let typingInterval;
  let cursorTimeout;

  /**
   * Escapa HTML para prevenir XSS, permitiendo solo saltos de línea
   */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
        
        // Ocultar cursor después de 1 segundo
        cursorTimeout = setTimeout(() => {
          showCursor = false;
        }, 1000);
      }
    }, speed);
  }

  // Efecto: reiniciar typewriter cuando cambia text o visible
  $effect(() => {
    if (visible && text) {
      startTyping();
    }
    
    // Cleanup cuando el efecto se re-ejecuta o el componente se destruye
    return () => {
      clearInterval(typingInterval);
      clearTimeout(cursorTimeout);
    };
  });

</script>

{#if visible}
  <div 
    class="dialogue-bubble"
    class:position-bottom={position === 'bottom'}
    role="status"
    aria-live="polite"
    aria-label="Diálogo"
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
  </div>
{/if}

<style>
  /* Contenedor principal de la burbuja */
  .dialogue-bubble {
    position: relative;
    box-sizing: border-box;
    max-width: min(320px, calc(100vw - 32px));
    padding: 20px 24px;
    
    /* Glassmorphism */
    background: var(--glass-bg, rgba(255, 255, 255, 0.15));
    backdrop-filter: var(--glass-blur, blur(12px));
    -webkit-backdrop-filter: var(--glass-blur, blur(12px));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
    
    /* Bordes redondeados */
    border-radius: var(--radius-lg, 24px);
    
    /* Sombra */
    box-shadow: var(--shadow-soft, 0 4px 20px rgba(131, 7, 156, 0.08));
    
    /* Tipografía */
    font-family: var(--font-body, 'Quicksand', 'Nunito', sans-serif);
    font-size: 1.1rem;
    color: var(--color-primary-dark, #6b0483);
    line-height: 1.5;
    
    /* Animación de entrada */
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
  }

  /* Texto del typewriter */
  .typewriter-text {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  /* Cursor parpadeante */
  .cursor {
    display: inline-block;
    color: var(--color-primary, #83079c);
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
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 14px solid var(--glass-border, rgba(255, 255, 255, 0.3));
    z-index: 0;
  }

  /* Cola interior para efecto glass */
  .bubble-tail::after {
    content: '';
    position: absolute;
    top: -15px;
    left: -10px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 12px solid var(--glass-bg, rgba(255, 255, 255, 0.15));
  }

  /* Posición bottom: cola apunta hacia arriba */
  .position-bottom .bubble-tail {
    bottom: auto;
    top: -12px;
    border-top: none;
    border-bottom: 14px solid var(--glass-border, rgba(255, 255, 255, 0.3));
  }

  .position-bottom .bubble-tail::after {
    top: auto;
    bottom: -15px;
    border-top: none;
    border-bottom: 12px solid var(--glass-bg, rgba(255, 255, 255, 0.15));
  }

  /* Responsive: max-width más grande en pantallas grandes */
  @media (min-width: 768px) {
    .dialogue-bubble {
      max-width: 420px;
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
