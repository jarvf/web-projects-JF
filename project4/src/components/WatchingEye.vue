<template>
  <div v-if="visible" class="eye-container">
    <div class="eye">
      <div class="iris" :style="irisStyle">
        <div class="pupil"></div>
      </div>
    </div>
    <p class="eye-text">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "WatchingEye",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      eyeX: 0,
      eyeY: 0,
      message: "WATCHING",
      messages: [
        "HELO",
        "I LOOK THE YOU ",
        "DON'T LOOKERING AWAYS",
        "YOU CAN'T THE HIDES",
        "STILL WATCHERING",
        "ALWAYS WATCHERING",
      ],
    };
  },
  computed: {
    irisStyle() {
      const angle = Math.atan2(
        this.mouseY - this.eyeY,
        this.mouseX - this.eyeX
      );
      const distance = Math.min(
        20,
        Math.sqrt(
          Math.pow(this.mouseX - this.eyeX, 2) +
            Math.pow(this.mouseY - this.eyeY, 2)
        ) / 10
      );

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      return {
        transform: `translate(${x}px, ${y}px)`,
      };
    },
  },
  mounted() {
    document.addEventListener("mousemove", this.handleMouseMove);
    this.updateEyePosition();
    this.startMessageCycle();
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove);
  },
  methods: {
    handleMouseMove(event) {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    },

    updateEyePosition() {
      const eye = document.querySelector(".eye");
      if (eye) {
        const rect = eye.getBoundingClientRect();
        this.eyeX = rect.left + rect.width / 2;
        this.eyeY = rect.top + rect.height / 2;
      }
    },

    startMessageCycle() {
      setInterval(() => {
        this.message =
          this.messages[Math.floor(Math.random() * this.messages.length)];
      }, 3000);
    },
  },
};
</script>

<style scoped>
.eye-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9998;
  animation: fade-in 2s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.eye {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50% 0;
  transform: rotate(45deg);
  position: relative;
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.2);
  animation: eye-pulse 3s infinite;
}

@keyframes eye-pulse {
  0%,
  100% {
    box-shadow: 0 0 30px rgba(255, 0, 0, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 0, 0, 0.8), inset 0 0 30px rgba(0, 0, 0, 0.4);
  }
}

.iris {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #8b0000, #ff0000);
  border-radius: 50%;
  position: absolute;
  top: 25px;
  left: 25px;
  transform: rotate(-45deg);
  transition: transform 0.1s ease;
}

.pupil {
  width: 20px;
  height: 20px;
  background: black;
  border-radius: 50%;
  position: absolute;
  top: 15px;
  left: 15px;
  animation: pupil-dilate 4s infinite;
}

@keyframes pupil-dilate {
  0%,
  100% {
    width: 20px;
    height: 20px;
  }
  50% {
    width: 30px;
    height: 30px;
    top: 10px;
    left: 10px;
  }
}

.eye-text {
  font-family: "Courier New", monospace;
  color: #ff0000;
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  animation: text-glitch 0.5s infinite;
}

@keyframes text-glitch {
  0%,
  100% {
    text-shadow: 2px 2px 0 rgba(255, 0, 0, 0.5),
      -2px -2px 0 rgba(0, 255, 255, 0.5);
  }
  25% {
    text-shadow: -2px 2px 0 rgba(255, 0, 0, 0.5),
      2px -2px 0 rgba(0, 255, 255, 0.5);
  }
  50% {
    text-shadow: 2px -2px 0 rgba(255, 0, 0, 0.5),
      -2px 2px 0 rgba(0, 255, 255, 0.5);
  }
  75% {
    text-shadow: -2px -2px 0 rgba(255, 0, 0, 0.5),
      2px 2px 0 rgba(0, 255, 255, 0.5);
  }
}
</style>
