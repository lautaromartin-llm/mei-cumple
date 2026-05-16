import { writable } from 'svelte/store';

// Estados del flujo interactivo:
// 'intro' → panda hablando, diálogo inicial
// 'reveal' → transición al mensaje "Feliz cumpleaños"
// 'celebration' → pétalos de cerezo + mensaje revelado
// 'gallery' → scroll habilitado, galería visible

export const appPhase = writable('intro');
export const dialogueStep = writable(0);
export const isScrolling = writable(false);
