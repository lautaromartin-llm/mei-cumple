<script>
  import HeroSection from './lib/components/HeroSection.svelte';
  import Gallery from './lib/components/Gallery.svelte';
  import Footer from './lib/components/Footer.svelte';
  import CherryPetals from './lib/components/CherryPetals.svelte';
  import AudioPlayer from './lib/components/AudioPlayer.svelte';
  import './lib/styles/global.css';
</script>

<main aria-label="Cumpleaños de Mei">
  <div class="global-petals" aria-hidden="true">
    <CherryPetals />
  </div>
  <AudioPlayer volume={0.4} autoPlay={true} />
  <HeroSection />
  <Gallery />
  <Footer />
</main>

<style>
  main {
    position: relative;
    width: 100%;
    min-height: 100vh;
  }

  .global-petals {
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
  }
</style>
