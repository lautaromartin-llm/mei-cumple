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
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-primary-dark, #6b4f8a);
    text-align: center;
    margin: 0;
    opacity: 0.6;
    letter-spacing: 0.03em;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .footer {
      padding: var(--spacing-md) var(--spacing-sm);
    }

    .footer-credits {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 360px) {
    .footer-credits {
      font-size: 0.8rem;
    }
  }
</style>
