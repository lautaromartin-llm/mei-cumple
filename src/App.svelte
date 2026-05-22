<script>
  import HeroSection from './lib/components/HeroSection.svelte';
  import Gallery from './lib/components/Gallery.svelte';
  import Footer from './lib/components/Footer.svelte';
  import CherryPetals from './lib/components/CherryPetals.svelte';
  import AudioPlayer from './lib/components/AudioPlayer.svelte';
  import { appPhase } from './lib/stores/appState.js';
  import './lib/styles/global.css';

  const baseUrl = import.meta.env.BASE_URL;
</script>

<main 
  class="app-main"
  class:bg-panda={$appPhase === 'intro' || $appPhase === 'reveal' || $appPhase === 'celebration'}
  class:bg-gallery={$appPhase === 'gallery'}
  aria-label="Cumpleaños de Mei"
  style="--bg-panda: url('{baseUrl}media/backgrounds/panda-background.png'); --bg-gallery: url('{baseUrl}media/backgrounds/galery-background.png');"
>
  <div class="global-petals" aria-hidden="true">
    <CherryPetals />
  </div>
  <AudioPlayer volume={0.4} autoPlay={true} />
  <HeroSection />
  <Gallery />
  <Footer />
</main>

<style>
  .app-main {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-image 0.8s ease-in-out;
  }

  .app-main.bg-panda {
    background-image: var(--bg-panda);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  .app-main.bg-gallery {
    background-image: var(--bg-gallery);
    background-repeat: repeat;
    background-size: auto;
    background-position: top left;
    background-attachment: scroll;
  }

  .global-petals {
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
  }

  @media (min-width: 768px) {
    .app-main.bg-panda {
      background-position: bottom;
    }
  }
</style>
