<script>
  import { isScrolling } from '../stores/appState.js';
</script>

{#if $isScrolling}
  <footer class="footer">
    <div class="footer-content">
      <p class="footer-credits">Hecho con 💜 para Mei</p>
    </div>
  </footer>
{/if}

<style>
  .footer {
    width: 100%;
    padding: var(--spacing-lg) var(--spacing-md);
    margin-top: auto;
    background: transparent;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-top: 1px solid var(--glass-border);
  }

  .footer-content {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-credits {
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-primary-darker);
    text-align: center;
    margin: 0;
    opacity: 0.8;
    letter-spacing: 0.02em;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .footer {
      padding: var(--spacing-md) var(--spacing-sm);
    }

    .footer-credits {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 360px) {
    .footer-credits {
      font-size: 0.75rem;
    }
  }
</style>
