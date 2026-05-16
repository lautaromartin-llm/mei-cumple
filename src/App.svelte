<script>
  import HeroSection from './lib/components/HeroSection.svelte';
  import Gallery from './lib/components/Gallery.svelte';
  import Footer from './lib/components/Footer.svelte';
  import './lib/styles/global.css';
</script>

<main>
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
</style>
