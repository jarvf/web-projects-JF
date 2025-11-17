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
  name: 'CreepyPopup',
  data() {
    return {
      visible: false,
      userInput: '',
      messageIndex: 0,
      messages: [
        {
          title: 'SPECIAL OFFER JUST FOR YOU',
          text: 'We noticed you\'ve been here for a while. Your dedication has been noted.',
          buttonText: 'ACCEPT',
          showInput: false
        },
        {
          title: 'VERIFY YOUR HUMANITY',
          text: 'Please tell us your deepest fear to continue:',
          inputPlaceholder: 'Type your fear here...',
          buttonText: 'SUBMIT',
          showInput: true
        },
        {
          title: 'THANK YOU FOR YOUR DATA',
          text: 'Your behavioral patterns have been successfully harvested.',
          buttonText: 'OK',
          showInput: false
        },
        {
          title: 'WE KNOW WHO YOU ARE',
          text: 'Your digital footprint has been analyzed. Profile confidence: 97.3%',
          buttonText: 'CONTINUE',
          showInput: false
        },
        {
          title: 'ATTENTION REQUIRED',
          text: 'You cannot leave. Not yet. We\'re not done with you.',
          buttonText: 'I UNDERSTAND',
          showInput: false
        }
      ],
      currentMessage: {}
    }
  },
  mounted() {
    this.startRandomPopups()
  },
  methods: {
    startRandomPopups() {
      // Show popup at random intervals
      setTimeout(() => {
        this.showPopup()
        setInterval(() => {
          if (Math.random() > 0.7) {
            this.showPopup()
          }
        }, 15000)
      }, 8000)
    },
    
    showPopup() {
      if (!this.visible) {
        this.currentMessage = this.messages[this.messageIndex % this.messages.length]
        this.visible = true
        this.messageIndex++
        this.$emit('popup-shown', this.currentMessage)
      }
    },
    
    close() {
      this.visible = false
      this.userInput = ''
      
      // Sometimes prevent closing
      if (Math.random() > 0.8) {
        setTimeout(() => {
          this.visible = true
          this.currentMessage = {
            title: 'ERROR',
            text: 'You cannot dismiss this message.',
            buttonText: 'TRY AGAIN',
            showInput: false
          }
        }, 500)
      }
    },
    
    handleAction() {
      if (this.currentMessage.showInput && this.userInput) {
        this.$emit('user-data', {
          type: 'fear',
          value: this.userInput
        })
      }
      this.close()
    },
    
    onInput() {
      this.$emit('user-typing', this.userInput)
    }
  }
}
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
  0% { background: rgba(0, 0, 0, 0.8); }
  50% { background: rgba(0, 0, 0, 0.85); }
  100% { background: rgba(0, 0, 0, 0.8); }
}

.popup-content {
  background: linear-gradient(135deg, #1e1e1e 0%, #2a0845 100%);
  border: 3px solid #00FF00;
  border-radius: 0;
  width: 90%;
  max-width: 500px;
  box-shadow: 
    0 0 50px rgba(0, 255, 0, 0.5),
    inset 0 0 50px rgba(255, 0, 255, 0.1);
  animation: glitch-box 0.3s infinite;
}

@keyframes glitch-box {
  0%, 100% { 
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
  border-bottom: 2px solid #FF0000;
}

.popup-title {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  color: #00FF00;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.close-btn {
  background: none;
  border: 2px solid #FF0000;
  color: #FF0000;
  font-size: 24px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #FF0000;
  color: #000;
  transform: rotate(90deg);
}

.popup-body {
  padding: 30px;
  min-height: 150px;
}

.popup-text {
  font-family: 'Courier New', monospace;
  color: #00FF00;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
  animation: type-text 2s steps(50, end);
}

@keyframes type-text {
  from { width: 0; }
  to { width: 100%; }
}

.creepy-input {
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #00FF00;
  color: #00FF00;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  outline: none;
}

.creepy-input:focus {
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  animation: pulse-border 1s infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: #00FF00; }
  50% { border-color: #FF00FF; }
}

.popup-footer {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  text-align: center;
}

.popup-button {
  background: linear-gradient(90deg, #00FF00 0%, #FF00FF 100%);
  color: #000;
  border: none;
  padding: 15px 40px;
  font-family: 'Courier New', monospace;
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

/* Transition animations */
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
