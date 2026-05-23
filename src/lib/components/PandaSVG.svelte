<script>
  let { pose = 'eating', size = 200 } = $props();
  const mediaBase = `${import.meta.env.BASE_URL}media/`;

  // Mapeo de poses a archivos PNG
  const poseToPng = {
    'eating': `${mediaBase}PandaSentadoComiendoBambu.webp`,
    'looking': `${mediaBase}PandaFelizMirandoHaciaLaDerechaYHaciaArriba.webp`,
    'side': `${mediaBase}PandaFelizAlzandoLasManosMirandoALaDerechayHaciaArriba.webp`,
    'worried': `${mediaBase}PandaAgobiadoSentado.webp`
  };

  // Descripciones accesibles
  const poseDescriptions = {
    'eating': 'comiendo bambú',
    'looking': 'mirando hacia arriba y a la derecha',
    'side': 'mirando de costado',
    'worried': 'preocupado'
  };

  // Obtener el src del PNG según la pose
  function getPngSrc() {
    return poseToPng[pose] || poseToPng['eating'];
  }

  // Obtener descripción accesible
  function getAriaLabel() {
    return `Panda kawaii ${poseDescriptions[pose] || 'comiendo bambú'}`;
  }
</script>

<div 
  class="panda-wrapper"
  style="width: {size}px;"
  role="img"
  aria-label={getAriaLabel()}
>
  <img 
    class="panda-img"
    src={getPngSrc()}
    alt={getAriaLabel()}
    style="width: 100%; height: auto;"
    draggable="false"
    loading="eager"
  />
</div>

<style>
  .panda-wrapper {
    position: relative;
    display: inline-block;
    /* Animación de respiración en el contenedor */
    transform-origin: bottom center;
    will-change: transform;
    animation: breathe 4s ease-in-out infinite;
    transition: width 0.5s ease, height 0.5s ease;
  }

  .panda-img {
    display: block;
    user-select: none;
    -webkit-user-drag: none;
  }

  /* ========== RESPUESTA CÍCLICA (BREATHE) ========== */
  @keyframes breathe {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.025); }
  }

  /* ========== ACCESIBILIDAD: prefers-reduced-motion ========== */
  @media (prefers-reduced-motion: reduce) {
    .panda-wrapper {
      animation: none !important;
    }
  }
</style>
