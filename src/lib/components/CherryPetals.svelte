<script>
  /**
   * CherryPetals Component
   * Animación de pétalos de cerezo (sakura) flotando de izquierda a derecha
   * - ~15 pétalos con diferentes velocidades y tamaños
   * - Movimiento orgánico con oscilación vertical y rotación
   * - Respeto a prefers-reduced-motion
   * - No interfiere con interactividad (pointer-events: none)
   */

  // Generar configuración de pétalos con variaciones aleatorias
  const petals = Array.from({ length: 15 }, (_, i) => {
    const size = 12 + Math.random() * 12; // Entre 12px y 24px
    const duration = 6 + Math.random() * 6; // Entre 6s y 12s
    const delay = Math.random() * 10; // Retardo inicial 0-10s
    const top = Math.random() * 100; // Posición vertical 0-100%
    const opacity = 0.3 + Math.random() * 0.5; // Opacidad 0.3-0.8
    const rotateStart = Math.random() * 360;
    const rotateEnd = rotateStart + 180 + Math.random() * 360; // Rotación continua
    const verticalAmplitude = 20 + Math.random() * 40; // Amplitud de oscilación vertical
    
    // Algunos pétalos con gradiente para variedad visual
    const hasGradient = Math.random() > 0.6;
    
    return {
      id: i,
      size,
      duration,
      delay,
      top,
      opacity,
      rotateStart,
      rotateEnd,
      verticalAmplitude,
      hasGradient
    };
  });
</script>

<div class="cherry-petals" aria-hidden="true">
  {#each petals as petal (petal.id)}
    <div
      class="petal-wrapper"
      style="
        --petal-size: {petal.size}px;
        --petal-duration: {petal.duration}s;
        --petal-delay: -{petal.delay}s;
        --petal-top: {petal.top}%;
        --petal-opacity: {petal.opacity};
        --petal-rotate-start: {petal.rotateStart}deg;
        --petal-rotate-end: {petal.rotateEnd}deg;
        --petal-vertical: {petal.verticalAmplitude}px;
      "
    >
      <div class="petal-svg">
        {#if petal.hasGradient}
          <svg
            viewBox="0 0 16 24"
            width={petal.size}
            height={petal.size * 1.5}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sakuraGradient-{petal.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color: var(--color-sakura-light); stop-opacity: 0.9" />
                <stop offset="100%" style="stop-color: var(--color-sakura); stop-opacity: 0.7" />
              </linearGradient>
            </defs>
            <ellipse
              cx="8"
              cy="14"
              rx="6"
              ry="10"
              fill="url(#sakuraGradient-{petal.id})"
            />
            <path
              d="M8 4 L4.5 14 L8 11 L11.5 14Z"
              fill="var(--color-sakura-light)"
              opacity="0.6"
            />
            <!-- Sutil detalle de la hendidura -->
            <path
              d="M8 4 L7.5 6 L8 7 L8.5 6Z"
              fill="var(--color-sakura)"
              opacity="0.4"
            />
          </svg>
        {:else}
          <svg
            viewBox="0 0 16 24"
            width={petal.size}
            height={petal.size * 1.5}
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="8"
              cy="14"
              rx="6"
              ry="10"
              fill="var(--color-sakura)"
              opacity="0.75"
            />
            <path
              d="M8 4 L4.5 14 L8 11 L11.5 14Z"
              fill="var(--color-sakura-light)"
              opacity="0.5"
            />
            <!-- Sutil detalle de la hendidura -->
            <path
              d="M8 4 L7.5 6 L8 7 L8.5 6Z"
              fill="var(--color-sakura)"
              opacity="0.4"
            />
          </svg>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  /* Contenedor principal */
  .cherry-petals {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 5;
  }

  /* Cada pétalo individual */
  .petal-wrapper {
    position: absolute;
    left: -60px; /* Empieza fuera de pantalla por la izquierda */
    top: var(--petal-top);
    will-change: transform;
    opacity: var(--petal-opacity);
    animation: petalFloat var(--petal-duration) linear infinite;
    animation-delay: var(--petal-delay);
  }

  /* SVG del pétalo */
  .petal-svg {
    transform-origin: center center;
    filter: drop-shadow(0 2px 4px rgba(249, 168, 212, 0.2));
  }

  @keyframes petalFloat {
    0% {
      transform: 
        translateX(-60px) 
        translateY(0) 
        rotate(var(--petal-rotate-start));
    }
    25% {
      transform: 
        translateX(25vw) 
        translateY(calc(var(--petal-vertical) * -0.6)) 
        rotate(calc(var(--petal-rotate-start) + (var(--petal-rotate-end) - var(--petal-rotate-start)) * 0.25));
    }
    50% {
      transform: 
        translateX(50vw) 
        translateY(calc(var(--petal-vertical) * 0.4)) 
        rotate(calc(var(--petal-rotate-start) + (var(--petal-rotate-end) - var(--petal-rotate-start)) * 0.5));
    }
    75% {
      transform: 
        translateX(75vw) 
        translateY(calc(var(--petal-vertical) * -0.7)) 
        rotate(calc(var(--petal-rotate-start) + (var(--petal-rotate-end) - var(--petal-rotate-start)) * 0.75));
    }
    100% {
      transform: 
        translateX(calc(100vw + 60px)) 
        translateY(calc(var(--petal-vertical) * -0.2)) 
        rotate(var(--petal-rotate-end));
    }
  }

  /* Respect prefers-reduced-motion: pétalos estáticos o sin animación */
  @media (prefers-reduced-motion: reduce) {
    .cherry-petals {
      display: none;
    }
  }

  /* Ajuste para pantallas grandes */
  @media (min-width: 1200px) {
    .petal-wrapper {
      left: -80px;
    }
  }

  /* Ajuste para pantallas muy anchas */
  @media (min-width: 1920px) {
    .petal-wrapper {
      left: -100px;
    }
  }
</style>
