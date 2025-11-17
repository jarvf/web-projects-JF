<template>
  <transition name="popup">
    <div v-if="visible" class="popup-overlay" @click="close">
      <div class="popup-content" @click.stop>
        <div class="popup-header">
          <span class="popup-title">{{ currentMessage.title }}</span>
          <button class="close-btn" @click="close">×</button>
        </div>
        <div class="popup-body">
          <p class="popup-text">{{ currentMessage.text }}</p>
          <div v-if="currentMessage.showInput" class="popup-input">
            <input
              v-model="userInput"
              :placeholder="currentMessage.inputPlaceholder"
              class="creepy-input"
              @input="onInput"
            />
          </div>
        </div>
        <div class="popup-footer">
          <button class="popup-button" @click="handleAction">
            {{ currentMessage.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
  forceFear: {
    type: Boolean,
    default: false
  }
},

  name: "CreepyPopup",
  data() {
    return {
      visible: false,
      userInput: "",
      messageIndex: 0,
      fearShown: false,
      messages: [
        {
          title: "SP3CI4L 0FFER JUS7 F0R Y0U",
          text: "We n0t1ce3d y0u've b33n h3r3 for 4 wh1l3. Your d3d1cat1on h4s b33n n0t3d.",
          buttonText: "4CC3PT",
          showInput: false,
        },
        {
          title: "V3RI1Y Y0UR HUM4NI7Y PL0X",
          text: "Pl34se t3ll3r1ng us 4ll y0ur d33pest f34r1ngs to pr0c33d:",
          inputPlaceholder: "Typ3 y0ur f34r h3r3...",
          buttonText: "SUBMISSIONEDS",
          showInput: true,
        },
        {
          title: "7H4NK Y0U F0R Y0UR D4T4",
          text: "Y0ur b3hav10ral pa773rns h4v3 b33n succ3ssfu11y h4rv3st3d.",
          buttonText: "YER",
          showInput: false,
        },
        {
          title: "W3 KN0W WH0 Y0U 4Re",
          text: "Y0ur d1g17al f00tpr1n7 h45 b33n 4n4lyz3d. Pr0fil3 c0nf1d3nce: 97.3%",
          buttonText: "C0N7INU3",
          showInput: false,
        },
        {
          title: "A773NTION R3QU1R3D",
          text: "Y0u c4nn07 l34ve. N0t y3ts. W3'r3 n0t d0n3s w1th y0u.",
          buttonText: "I UND3RST4ND",
          showInput: false,
        },
      ],
      currentMessage: {},
    };
  },
  watch: {
  forceFear(newVal) {
    if (newVal && !this.visible && !this.fearShown) {
      this.showFearPopup()
    }
  }
},

  mounted() {
    this.startRandomPopups();
  },
  methods: {
    startRandomPopups() {
      // random popups
      setTimeout(() => {
        this.showPopup();
        setInterval(() => {
          if (Math.random() > 0.7) {
            this.showPopup();
          }
        }, 15000);
      }, 8000);
    },
    showFearPopup() {
  // find verify humanity message
  const fearIndex = this.messages.findIndex(
    (m) => m.title && m.title.toUpperCase().includes('V3RI1Y Y0UR HUM4NI7Y PL0X')
  )

  if (fearIndex !== -1) {
    this.currentMessage = this.messages[fearIndex]
  } else {
    // fallbacks
    this.currentMessage = this.messages[1] || this.messages[0]
  }

  this.visible = true
  this.fearShown = true
  this.$emit('popup-shown', this.currentMessage.title)
},

    showPopup() {
      if (!this.visible) {
        this.currentMessage =
          this.messages[this.messageIndex % this.messages.length];
        this.visible = true;
        this.messageIndex++;
        this.$emit("popup-shown", this.currentMessage);
      }
    },

    close() {
      this.visible = false;
      this.userInput = "";

      // Close prevented
      if (Math.random() > 0.8) {
        setTimeout(() => {
          this.visible = true;
          this.currentMessage = {
            title: "ERROR",
            text: "You cannot dismiss this message.",
            buttonText: "TRY AGAIN",
            showInput: false,
          };
        }, 500);
      }
    },

    handleAction() {
      if (this.currentMessage.showInput && this.userInput) {
        this.$emit("user-data", {
          type: "fear",
          value: this.userInput,
        });
      }
      this.close();
    },

    onInput() {
      this.$emit("user-typing", this.userInput);
    },
  },
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: static 0.1s infinite;
}

@keyframes static {
  0% {
    background: rgba(0, 0, 0, 0.8);
  }
  50% {
    background: rgba(0, 0, 0, 0.85);
  }
  100% {
    background: rgba(0, 0, 0, 0.8);
  }
}

.popup-content {
  background: linear-gradient(135deg, #1e1e1e 0%, #2a0845 100%);
  border: 3px solid #00ff00;
  border-radius: 0;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 50px rgba(0, 255, 0, 0.5),
    inset 0 0 50px rgba(255, 0, 255, 0.1);
  animation: glitch-box 0.3s infinite;
}

@keyframes glitch-box {
  0%,
  100% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  20% {
    transform: translate(-2px, 2px);
    filter: hue-rotate(90deg);
  }
  40% {
    transform: translate(-2px, -2px);
    filter: hue-rotate(180deg);
  }
  60% {
    transform: translate(2px, 2px);
    filter: hue-rotate(270deg);
  }
  80% {
    transform: translate(2px, -2px);
    filter: hue-rotate(360deg);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 0, 0, 0.1);
  border-bottom: 2px solid #ff0000;
}

.popup-title {
  font-family: "Courier New", monospace;
  font-size: 18px;
  font-weight: bold;
  color: #00ff00;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.close-btn {
  background: none;
  border: 2px solid #ff0000;
  color: #ff0000;
  font-size: 24px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #ff0000;
  color: #000;
  transform: rotate(90deg);
}

.popup-body {
  padding: 30px;
  min-height: 150px;
}

.popup-text {
  font-family: "Courier New", monospace;
  color: #00ff00;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
  animation: type-text 2s steps(50, end);
}

@keyframes type-text {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.creepy-input {
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #00ff00;
  color: #00ff00;
  font-family: "Courier New", monospace;
  font-size: 14px;
  outline: none;
}

.creepy-input:focus {
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  animation: pulse-border 1s infinite;
}

@keyframes pulse-border {
  0%,
  100% {
    border-color: #00ff00;
  }
  50% {
    border-color: #ff00ff;
  }
}

.popup-footer {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  text-align: center;
}

.popup-button {
  background: linear-gradient(90deg, #00ff00 0%, #ff00ff 100%);
  color: #000;
  border: none;
  padding: 15px 40px;
  font-family: "Courier New", monospace;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  animation: pulse 2s infinite;
}

.popup-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.8);
}

/*animationtransitions */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

.popup-leave-to {
  opacity: 0;
  transform: scale(2) rotate(-180deg);
}
</style>
