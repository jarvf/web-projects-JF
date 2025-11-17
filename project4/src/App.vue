<template>
  <div id="app" class="app-shell">
    <header>
      <h1 class="rainbow-text">CyberDream 2000™</h1>
      <p class="blink">THE FUTURE IS NOW!</p>
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
