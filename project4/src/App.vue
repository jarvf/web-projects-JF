<template>
  <div id="app" class="app-shell">
    <header>
      <h1 class="rainbow-text">Cyb3rDr34m 2000™</h1>
      <p class="blink">TH3 FU7UR3 1S N0W!</p>
    </header>

    <main>
      <RetroAd />

      <p style="margin-top: 1.5rem;">
      </p>
    </main>
  </div>
</template>

<script>
import RetroAd from './components/RetroAd.vue'

export default {
  name: 'AppShell',
  components: { RetroAd }
}
</script>
