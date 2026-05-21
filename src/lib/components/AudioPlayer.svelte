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
      {isPlaying ? '❚❚' : '▶'}
    </button>
    <span class="audio-label">Música</span>
    {#if isPlaying}
      <div class="equalizer" aria-hidden="true">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    {/if}
    <a class="download-link" href={audioSrc} download>⬇ descargar</a>
  {/if}
  <audio bind:this={audioElement} src={audioSrc} preload="auto" oncanplaythrough={handleReady} onerror={handleError} onended={() => isPlaying = false}></audio>
</div>

<style>
  .audio-player {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 1rem;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 50px;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }

  .play-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #83109c;
    color: white;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(131, 16, 156, 0.3);
    transition: transform 0.2s ease, background 0.2s ease;
    flex-shrink: 0;
  }

  .play-btn:hover {
    transform: scale(1.05);
    background: #9a1cb8;
  }

  .play-btn:active {
    transform: scale(0.95);
  }

  .audio-label {
    font-family: var(--font-display, system-ui, -apple-system, sans-serif);
    color: var(--color-text, #2d0a3d);
    font-weight: 600;
    font-size: 1rem;
    white-space: nowrap;
  }

  .equalizer {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 20px;
  }

  .equalizer .bar {
    width: 4px;
    background: #83109c;
    border-radius: 2px;
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
      height: 4px;
    }
    100% {
      height: 16px;
    }
  }

  .download-link {
    margin-left: auto;
    color: var(--color-text-secondary, #5a3d6e);
    text-decoration: none;
    font-size: 0.85rem;
    opacity: 0.8;
    transition: opacity 0.2s ease;
    white-space: nowrap;
  }

  .download-link:hover {
    opacity: 1;
  }

  .error-text {
    color: #b00020;
    font-weight: 500;
    font-size: 0.9rem;
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
      padding: 0.5rem 0.75rem;
      gap: 0.5rem;
      bottom: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
      border-radius: 25px;
    }

    .play-btn {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .audio-label {
      font-size: 0.9rem;
    }

    .equalizer {
      height: 16px;
    }

    .equalizer .bar {
      width: 3px;
    }

    @keyframes equalize {
      0% {
        height: 3px;
      }
      100% {
        height: 12px;
      }
    }

    .download-link {
      font-size: 0.75rem;
    }

    .error-text {
      font-size: 0.8rem;
    }
  }
</style>
