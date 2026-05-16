<script>
  import { onMount, onDestroy } from 'svelte';
  
  let { pose = 'eating', size = 200 } = $props();
  
  let blinking = $state(false);
  let previousPose = $state(pose);
  let blinkInterval = $state(null);

  // Blink al cambiar de pose
  $effect(() => {
    const currentPose = pose; // lectura reactiva snapshot
    if (currentPose !== previousPose) {
      blinking = true;
      previousPose = currentPose; // snapshot evita re-ejecución por write a sí mismo
      setTimeout(() => blinking = false, 300);
    }
  });

  // Blink aleatorio cada 3-6 segundos solo en pose 'looking'
  onMount(() => {
    blinkInterval = setInterval(() => {
      if (pose === 'looking') {
        blinking = true;
        setTimeout(() => blinking = false, 300);
      }
    }, 3000 + Math.random() * 4000);
  });

  onDestroy(() => {
    clearInterval(blinkInterval);
  });
</script>

<svg 
  class="panda-svg"
  width={size} 
  height={size} 
  viewBox="0 0 200 200"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label={`Panda kawaii ${pose === 'eating' ? 'comiendo bambú' : pose === 'side' ? 'mirando de costado' : 'mirando de frente'}`}
>
  <title>Panda kawaii — {pose === 'eating' ? 'comiendo bambú' : pose === 'side' ? 'mirando de costado' : 'mirando de frente'}</title>
  <desc>Un adorable panda estilo kawaii con proporciones chibi, ojos grandes y brillantes, mejillas rosadas y orejas redondas.</desc>
  
  <!-- DEFINICIONES: Gradientes y filtros -->
  <defs>
    <!-- Gradiente suave para las mejillas -->
    <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#f9a8d4;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#f9a8d4;stop-opacity:0" />
    </radialGradient>
    <!-- Gradiente para el bambú -->
    <linearGradient id="bambooGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#4ade80" />
      <stop offset="50%" style="stop-color:#86efac" />
      <stop offset="100%" style="stop-color:#4ade80" />
    </linearGradient>
  </defs>

  <!-- ========== CUERPO ========== -->
  <g class="panda-body-group">
    <!-- Piernas (detrás del cuerpo) -->
    <g class="panda-legs">
      <!-- Pierna izquierda -->
      <ellipse class="panda-leg-left" cx="75" cy="165" rx="18" ry="14" fill="#2d2d2d" />
      <!-- Pierna derecha -->
      <ellipse class="panda-leg-right" cx="125" cy="165" rx="18" ry="14" fill="#2d2d2d" />
    </g>

    <!-- Cuerpo principal (ovalado, blanco) -->
    <ellipse class="panda-body" cx="100" cy="140" rx="45" ry="38" fill="#ffffff" />
    
    <!-- Panza (más clara/blanca) -->
    <ellipse class="panda-belly" cx="100" cy="145" rx="28" ry="22" fill="#fefefe" />
  </g>

  <!-- ========== BRAZOS ========== -->
  <g class="panda-arms">
    <!-- Brazo izquierdo -->
    <ellipse 
      class="panda-arm-left" 
      cx="65" 
      cy="125" 
      rx="12" 
      ry="22" 
      fill="#2d2d2d"
      class:eating={pose === 'eating'}
    />
    <!-- Brazo derecho -->
    <ellipse 
      class="panda-arm-right" 
      cx="135" 
      cy="125" 
      rx="12" 
      ry="22" 
      fill="#2d2d2d"
      class:eating={pose === 'eating'}
    />
  </g>

  <!-- ========== CABEZA ========== -->
  <g class="panda-head-group" class:eating={pose === 'eating'}>
    <!-- Orejas -->
    <g class="panda-ears">
      <!-- Oreja izquierda -->
      <circle class="panda-ear-left" cx="55" cy="55" r="22" fill="#2d2d2d" />
      <!-- Oreja derecha -->
      <circle class="panda-ear-right" cx="145" cy="55" r="22" fill="#2d2d2d" />
    </g>

    <!-- Cabeza principal (círculo blanco grande - ~60% del tamaño) -->
    <circle class="panda-head" cx="100" cy="85" r="50" fill="#ffffff" />

    <!-- Cara (ojos, nariz, boca, mejillas) -->
    <g class="panda-face">
      <!-- Parches de ojos (negros) -->
      <g class="panda-eye-patches">
        <ellipse class="panda-eye-patch-left" cx="75" cy="80" rx="16" ry="18" fill="#2d2d2d" />
        <ellipse class="panda-eye-patch-right" cx="125" cy="80" rx="16" ry="18" fill="#2d2d2d" />
      </g>

      <!-- Ojos -->
      <g class="panda-eyes" class:blinking={blinking}>
        <!-- Ojo izquierdo -->
        <g class="panda-left-eye">
          <!-- Base del ojo (blanco) -->
          <circle class="panda-eye-white-left" cx="75" cy="80" r="10" fill="#ffffff" />
          <!-- Pupila -->
          <circle 
            class="panda-pupil-left" 
            cx="75" 
            cy="80" 
            r="6" 
            fill="#1a1a1a"
            class:side={pose === 'side'}
            class:eating={pose === 'eating'}
          />
          <!-- Catchlight (reflejo brillante) -->
          <circle 
            class="panda-catchlight-left" 
            cx="77" 
            cy="77" 
            r="2.5" 
            fill="#ffffff"
            class:side={pose === 'side'}
          />
          <circle 
            class="panda-catchlight-small-left" 
            cx="73" 
            cy="82" 
            r="1.2" 
            fill="#ffffff"
            opacity="0.6"
            class:side={pose === 'side'}
          />
        </g>

        <!-- Ojo derecho -->
        <g class="panda-right-eye">
          <!-- Base del ojo (blanco) -->
          <circle class="panda-eye-white-right" cx="125" cy="80" r="10" fill="#ffffff" />
          <!-- Pupila -->
          <circle 
            class="panda-pupil-right" 
            cx="125" 
            cy="80" 
            r="6" 
            fill="#1a1a1a"
            class:side={pose === 'side'}
            class:eating={pose === 'eating'}
          />
          <!-- Catchlight (reflejo brillante) -->
          <circle 
            class="panda-catchlight-right" 
            cx="127" 
            cy="77" 
            r="2.5" 
            fill="#ffffff"
            class:side={pose === 'side'}
          />
          <circle 
            class="panda-catchlight-small-right" 
            cx="123" 
            cy="82" 
            r="1.2" 
            fill="#ffffff"
            opacity="0.6"
            class:side={pose === 'side'}
          />
        </g>
      </g>

      <!-- Nariz -->
      <g class="panda-nose">
        <ellipse cx="100" cy="98" rx="5" ry="3.5" fill="#2d2d2d" />
      </g>

      <!-- Boca -->
      <g class="panda-mouth">
        {#if pose === 'eating'}
          <!-- Boca sonriente pequeña para 'eating' -->
          <path 
            d="M 96 104 Q 100 108 104 104" 
            stroke="#2d2d2d" 
            stroke-width="2" 
            fill="none" 
            stroke-linecap="round"
          />
        {:else}
          <!-- Boca tipo 'w' kawaii -->
          <path 
            d="M 95 103 Q 97 107 100 105 Q 103 107 105 103" 
            stroke="#2d2d2d" 
            stroke-width="1.8" 
            fill="none" 
            stroke-linecap="round"
          />
        {/if}
      </g>

      <!-- Mejillas (blush kawaii) -->
      <g class="panda-blush">
        <circle class="panda-blush-left" cx="55" cy="95" r="10" fill="url(#blushGradient)" opacity="0.7" />
        <circle class="panda-blush-right" cx="145" cy="95" r="10" fill="url(#blushGradient)" opacity="0.7" />
      </g>
    </g>
  </g>

  <!-- ========== BAMBÚ (solo visible en pose 'eating') ========== -->
  {#if pose === 'eating'}
    <g class="bamboo">
      <!-- Tallo principal -->
      <rect x="92" y="70" width="8" height="50" rx="2" fill="url(#bambooGradient)" transform="rotate(-15, 96, 95)" />
      <!-- Nudo del bambú -->
      <rect x="89" y="85" width="12" height="3" rx="1" fill="#22c55e" transform="rotate(-15, 96, 95)" />
      <!-- Hojas -->
      <g class="bamboo-leaves" transform="rotate(-15, 96, 95)">
        <!-- Hoja izquierda -->
        <path d="M 92 75 Q 75 70 72 60 Q 78 68 92 72" fill="#22c55e" />
        <!-- Hoja derecha -->
        <path d="M 100 78 Q 115 72 118 62 Q 112 70 100 76" fill="#22c55e" />
        <!-- Hoja superior -->
        <path d="M 96 70 Q 96 55 102 48 Q 98 58 96 68" fill="#4ade80" />
      </g>
    </g>
  {/if}
</svg>

<style>
  .panda-svg {
    display: block;
    /* Suaviza los bordes del SVG */
    shape-rendering: geometricPrecision;
  }

  /* ========== CONFIGURACIÓN DE TRANSFORM-ORIGIN ========== */
  .panda-arm-left {
    transform-origin: 65px 125px;
    transform: rotate(20deg);
    transition: transform 0.3s ease-out;
  }

  .panda-arm-right {
    transform-origin: 135px 125px;
    transform: rotate(-20deg);
    transition: transform 0.3s ease-out;
  }

  .panda-pupil-left,
  .panda-pupil-right {
    transform-origin: center;
    transition: transform 0.4s ease-out;
  }

  /* ========== TRANSICIONES SUAVES ========== */
  .panda-catchlight-left,
  .panda-catchlight-right,
  .panda-catchlight-small-left,
  .panda-catchlight-small-right {
    transition: transform 0.4s ease-out;
  }

  .bamboo {
    animation: bambooAppear 0.3s ease-out;
  }

  @keyframes bambooAppear {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ========== POSE: SIDE (mirando a la derecha) ========== */
  /* Desplazamos pupilas y catchlights hacia la derecha */
  .panda-pupil-left.side {
    transform: translateX(4px);
  }

  .panda-pupil-right.side {
    transform: translateX(4px);
  }

  .panda-catchlight-left.side {
    transform: translateX(4px);
  }

  .panda-catchlight-right.side {
    transform: translateX(4px);
  }

  .panda-catchlight-small-left.side {
    transform: translateX(4px);
  }

  .panda-catchlight-small-right.side {
    transform: translateX(4px);
  }

  /* ========== POSE: EATING ========== */
  /* Pupilas mirando hacia abajo/disfrutando - más expresivas */
  .panda-pupil-left.eating,
  .panda-pupil-right.eating {
    transform: translateY(3px) scale(0.83);
  }

  /* Brazos más levantados para agarrar bambú */
  .panda-arm-left.eating {
    transform: rotate(35deg);
  }

  .panda-arm-right.eating {
    transform: rotate(-35deg);
  }

  /* ========== RESPUESTA CÍCLICA (BREATHE) ========== */
  @keyframes breathe {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.025); }
  }

  .panda-head {
    transform-origin: 100px 85px;
    will-change: transform;
    animation: breathe 4s ease-in-out infinite;
  }

  .panda-body {
    transform-origin: 100px 140px;
    will-change: transform;
    animation: breathe 3.8s ease-in-out infinite 0.2s;
  }

  /* ========== ANIMACIÓN COMER BAMBÚ (solo en .eating) ========== */
  @keyframes eatArmLeft {
    0%, 100% { transform: rotate(35deg); }
    50% { transform: rotate(28deg); }
  }

  @keyframes eatArmRight {
    0%, 100% { transform: rotate(-35deg); }
    50% { transform: rotate(-28deg); }
  }

  @keyframes eatHeadBob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(2px); }
  }

  .panda-arm-left.eating {
    animation: eatArmLeft 2s ease-in-out infinite;
    will-change: transform;
  }

  .panda-arm-right.eating {
    animation: eatArmRight 2s ease-in-out infinite;
    will-change: transform;
  }

  .panda-head-group.eating {
    animation: eatHeadBob 2s ease-in-out infinite;
    will-change: transform;
    transform-origin: 100px 85px;
  }

  /* ========== BLINK (parpadeo) ========== */
  @keyframes blink {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.05); }
  }

  .panda-eyes {
    transform-origin: 100px 80px;
  }

  .panda-eyes.blinking {
    animation: blink 300ms ease-out;
    will-change: transform;
  }

  /* ========== ACCESIBILIDAD: prefers-reduced-motion ========== */
  @media (prefers-reduced-motion: reduce) {
    .panda-head,
    .panda-body,
    .panda-head-group.eating,
    .panda-arm-left.eating,
    .panda-arm-right.eating,
    .panda-eyes.blinking,
    .bamboo {
      animation: none !important;
    }
  }
</style>