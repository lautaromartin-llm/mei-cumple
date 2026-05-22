<script>
  import { onMount } from 'svelte';

  let { audioSrc = `${import.meta.env.BASE_URL}media/music/Water_Over_Stone.mp3`, autoPlay = false, volume = 0.7 } = $props();

  let audioElement;
  let isPlaying = $state(false);
  let audioError = $state(false);
  let autoPlayArmed = $state(false);

  function handleReady() {
    if (audioElement) {
      audioElement.volume = volume;
    }

    if (autoPlay && !autoPlayArmed) {
      attemptAutoPlay();
    }
  }

  $effect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  });

  function handleError() {
    console.warn('Error al cargar audio:', audioSrc);
    audioError = true;
  }

  async function attemptAutoPlay() {
    if (!audioElement || audioError || autoPlayArmed) return;
    autoPlayArmed = true;

    try {
      if (audioElement.readyState < 2) {
        audioElement.load();
      }
      await audioElement.play();
      isPlaying = true;
    } catch (err) {
      console.warn('Autoplay bloqueado o falló:', err);
      autoPlayArmed = false;
    }
  }

  async function togglePlay() {
    if (!audioElement || audioError) return;

    try {
      if (isPlaying) {
        await audioElement.pause();
        isPlaying = false;
      } else {
        await audioElement.play();
        isPlaying = true;
      }
    } catch (err) {
      console.warn('Error al toggle play:', err);
      audioError = true;
    }
  }

  onMount(() => {
    if (!autoPlay) return;

    const startOnInteraction = () => {
      attemptAutoPlay();
    };

    window.addEventListener('pointerdown', startOnInteraction, { once: true });
    window.addEventListener('keydown', startOnInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', startOnInteraction);
      window.removeEventListener('keydown', startOnInteraction);
    };
  });
</script>

<div class="audio-player" class:playing={isPlaying} class:error={audioError}>
  {#if audioError}
    <span class="error-text">🎵 Música no disponible</span>
    <a class="download-link" href={audioSrc} download>⬇ descargar</a>
  {:else}
    <button class="play-btn" onclick={togglePlay} type="button" aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
      {#if isPlaying}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      {/if}
    </button>
    
    <div class="audio-info">
      <span class="audio-label">Música</span>
      <span class="audio-subtitle">Para ti, Mei ♡</span>
    </div>
    
    {#if isPlaying}
      <div class="equalizer" aria-hidden="true">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    {/if}
    

  {/if}
  <audio bind:this={audioElement} src={audioSrc} preload="auto" oncanplaythrough={handleReady} onerror={handleError} onended={() => isPlaying = false}></audio>
</div>

<style>
  .audio-player {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1.25rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 50px;
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    box-shadow: 0 8px 24px rgba(61, 38, 89, 0.1);
    min-width: 280px;
    max-width: 90vw;
  }

  .play-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-primary, #8b6db5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(124, 92, 156, 0.25);
    transition: transform 0.2s ease, background 0.2s ease;
    flex-shrink: 0;
  }

  .play-btn:hover {
    transform: scale(1.05);
    background: var(--color-primary-dark, #6b4f8a);
  }

  .play-btn:active {
    transform: scale(0.95);
  }

  .audio-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  .audio-label {
    font-family: var(--font-body, 'Quicksand', sans-serif);
    color: var(--color-ink-strong, #3d2659);
    font-weight: 600;
    font-size: 0.95rem;
    white-space: nowrap;
  }

  .audio-subtitle {
    font-family: var(--font-body, 'Quicksand', sans-serif);
    color: var(--color-primary-light, #b8a0d1);
    font-weight: 400;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .equalizer {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 20px;
    flex-shrink: 0;
  }

  .equalizer .bar {
    width: 4px;
    height: 16px;
    background: var(--color-primary, #8b6db5);
    border-radius: 2px;
    transform-origin: bottom;
    animation: equalize 0.8s ease-in-out infinite alternate;
  }

  .equalizer .bar:nth-child(1) {
    animation-delay: 0s;
  }

  .equalizer .bar:nth-child(2) {
    animation-delay: 0.2s;
  }

  .equalizer .bar:nth-child(3) {
    animation-delay: 0.4s;
  }

  .equalizer .bar:nth-child(4) {
    animation-delay: 0.1s;
  }

  @keyframes equalize {
    0% {
      transform: scaleY(0.25);
    }
    100% {
      transform: scaleY(1);
    }
  }



  .error-text {
    color: #b00020;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .download-link {
    margin-left: auto;
    color: var(--color-primary, #8b6db5);
    text-decoration: none;
    font-size: 0.85rem;
    opacity: 0.8;
    transition: opacity 0.2s ease;
    white-space: nowrap;
  }

  .download-link:hover {
    opacity: 1;
  }

  .audio-player.error {
    background: #fff0f3;
    border-color: rgba(176, 0, 32, 0.3);
  }

  audio {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    .audio-player {
      padding: 0.5rem 1rem;
      gap: 0.6rem;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      transform: none;
      border-radius: 40px;
      min-width: 0;
      width: calc(100% - 2rem);
    }

    .play-btn {
      width: 44px;
      height: 44px;
    }

    .audio-label {
      font-size: 0.9rem;
    }

    .audio-subtitle {
      font-size: 0.75rem;
    }

    .equalizer {
      height: 16px;
    }

    .equalizer .bar {
      width: 3px;
    }

    @keyframes equalize {
      0% {
        transform: scaleY(0.25);
      }
      100% {
        transform: scaleY(1);
      }
    }

    .download-link {
      font-size: 0.75rem;
    }

    .error-text {
      font-size: 0.8rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .equalizer .bar {
      animation: none !important;
    }
  }
</style>
