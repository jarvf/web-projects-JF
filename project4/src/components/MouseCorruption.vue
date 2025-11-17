<template>
  <div v-if="active" class="corruption-container">
    <div
      v-for="(trail, index) in trails"
      :key="index"
      class="trail-dot"
      :style="{
        left: trail.x + 'px',
        top: trail.y + 'px',
        opacity: trail.opacity,
        transform: `scale(${trail.scale}) rotate(${trail.rotation}deg)`,
      }"
    >
      {{ trail.char }}
    </div>
  </div>
</template>

<script>
export default {
  name: "MouseCorruption",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      trails: [],
      corruptChars: [
        "×",
        "▓",
        "░",
        "▒",
        "█",
        "◊",
        "◈",
        "◉",
        "○",
        "●",
        "▪",
        "▫",
      ],
      maxTrails: 30,
    };
  },
  mounted() {
    if (this.active) {
      document.addEventListener("mousemove", this.handleMouseMove);
    }
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove);
  },
  watch: {
    active(newVal) {
      if (newVal) {
        document.addEventListener("mousemove", this.handleMouseMove);
      } else {
        document.removeEventListener("mousemove", this.handleMouseMove);
        this.trails = [];
      }
    },
  },
  methods: {
    handleMouseMove(event) {
      const trail = {
        x: event.clientX + (Math.random() - 0.5) * 20,
        y: event.clientY + (Math.random() - 0.5) * 20,
        opacity: 1,
        scale: Math.random() * 2 + 0.5,
        rotation: Math.random() * 360,
        char: this.corruptChars[
          Math.floor(Math.random() * this.corruptChars.length)
        ],
      };

      this.trails.push(trail);

      if (this.trails.length > this.maxTrails) {
        this.trails.shift();
      }

      this.fadeTrails();
    },

    fadeTrails() {
      this.trails = this.trails
        .map((trail) => ({
          ...trail,
          opacity: trail.opacity * 0.95,
        }))
        .filter((trail) => trail.opacity > 0.01);
    },
  },
};
</script>

<style scoped>
.corruption-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9997;
  mix-blend-mode: difference;
}

.trail-dot {
  position: fixed;
  color: #00ff00;
  font-size: 20px;
  font-family: monospace;
  transition: opacity 0.5s ease-out;
  animation: corrupt-pulse 0.3s infinite;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.8), 0 0 10px rgba(255, 0, 255, 0.6);
}

@keyframes corrupt-pulse {
  0% {
    filter: brightness(1) hue-rotate(0deg);
  }
  50% {
    filter: brightness(1.5) hue-rotate(180deg);
  }
  100% {
    filter: brightness(1) hue-rotate(360deg);
  }
}
</style>
