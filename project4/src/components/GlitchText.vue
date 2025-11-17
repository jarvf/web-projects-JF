<template>
  <span class="glitch-text" :data-text="text">
    {{ displayText }}
  </span>
</template>

<script>
export default {
  name: 'GlitchText',
  props: {
    text: {
      type: String,
      required: true
    },
    intensity: {
      type: Number,
      default: 0.1
    }
  },
  data() {
    return {
      displayText: this.text,
      glitchChars: '!@#$%^&*()_+-=[]{}|;:,.<>?/',
      intervalId: null
    }
  },
  mounted() {
    this.startGlitch()
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    startGlitch() {
      this.intervalId = setInterval(() => {
        if (Math.random() < this.intensity) {
          this.displayText = this.corruptText(this.text)
          setTimeout(() => {
            this.displayText = this.text
          }, 100)
        }
      }, 2000)
    },
    corruptText(text) {
      return text.split('').map(char => {
        if (Math.random() < 0.3) {
          return this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)]
        }
        return char
      }).join('')
    }
  }
}
</script>

<style scoped>
.glitch-text {
  position: relative;
  color: inherit;
  font-weight: bold;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  animation: glitch-1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
  color: #00ffff;
  z-index: -1;
}

.glitch-text::after {
  animation: glitch-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
  color: #ff00ff;
  z-index: -2;
}

@keyframes glitch-1 {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes glitch-2 {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(2px, -2px);
  }
  40% {
    transform: translate(2px, 2px);
  }
  60% {
    transform: translate(-2px, -2px);
  }
  80% {
    transform: translate(-2px, 2px);
  }
  100% {
    transform: translate(0);
  }
}
</style>
