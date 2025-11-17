<template>
  <div class="retro-container" :class="{ glitching: isGlitching }">
    <!-- usertracker -->
    <UserTracker
      :showTracker="interactionCount > 8"
      @activity="handleTrackerActivity"
    />

    <!--creepypop -->
    <CreepyPopup
      @popup-shown="handlePopupShown"
      @user-data="collectUserData"
      @user-typing="handleUserTyping"
    />

    <!-- eye -->
    <WatchingEye :visible="stage >= 2" />

    <!-- DISABLED FOR PERFORMANCE -->
    <MouseCorruption :active="false" />
    <!-- stage1 -->
    <div v-if="stage === 1" class="stage-one">
      <div class="stars"></div>
      <marquee class="top-banner" behavior="scroll" direction="left">
        🌟 4M4Z1NG 0FF3R!!! 🌟 L1M1T3D 71ME!!! 🌟 D0N'T M1SS 0UT!!! 🌟
      </marquee>

      <div class="main-content">
        <h1 class="rainbow-text title">
          <GlitchText :text="'CyberDream 2000™'" :intensity="glitchIntensity" />
        </h1>
        <h2 class="subtitle blink">TH3 FU7UR3 1S N0W!</h2>

        <div class="product-box">
          <img
            src="https://coin-images.coingecko.com/coins/images/34391/large/NJy34Zwd_400x400.jpg?1704783819"
            class="product-image"
            alt="product"
          />
          <div class="product-text">
            <p class="cyber-text">🚀 3NH4NC3 Y0UR D1G174L L1F3! 🚀</p>
            <p class="price blink">0NLY $99.99</p>
            <p class="discount">W4S <s>$999.99</s> - SAVE 90%!!!</p>
          </div>
        </div>

        <div class="form-container">
          <h3 class="form-title">CL4IM3R1NG Y0UR FUTURE'S T0D4Y!</h3>
          <form @submit.prevent="handleSubmit">
            <input 
              v-model="userInfo.name" 
              type="text" 
              placeholder="YOUR NAME" 
              class="retro-input"
              @input="handleInteraction"
            />
            <input 
              v-model="userInfo.email" 
              type="email" 
              placeholder="YOUR EMAIL" 
              class="retro-input"
              @input="handleInteraction"
            />
            <button type="submit" class="retro-button">
              💾 DOWNLOAD NOW 💾
            </button>
          </form>

        </div>

        <div class="visitor-counter">Visitor #{{ visitorCount }}</div>
      </div>
    </div>

    <!-- Stage 2 -->
    <div v-else-if="stage === 2" class="stage-two">
      <div class="glitch-overlay"></div>
      <div class="corrupted-text">
        <p v-for="i in 10" :key="i" class="glitch-line">
          {{ getGlitchText() }}
        </p>
      </div>
    </div>

    <!-- Stage 3 -->
    <div v-else-if="stage === 3" class="stage-three">
      <div class="dark-container">
        <h1 class="reveal-title">C0NGR47UM4L47I0NS</h1>
        <p class="reveal-text">Pr0duc7 ID: {{ generateProductId() }}</p>
        <p class="reveal-text">Status: 5UCC3SSFULLY C4T4L0GU3D</p>
        <div class="user-data">
          <p>Name: {{ userInfo.name || "ANONYMOUS_USER" }}</p>
          <p>Email: {{ userInfo.email || "DATA_COLLECTED" }}</p>
          <p>Int3r4ct10n P0in7s: {{ interactionCount }}</p>
          <p>B3hav10r4l Pr0fil3: C0MPL37ION3D</p>
        </div>
        <p class="final-message">{{ finalMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import GlitchText from "./GlitchText.vue";
import UserTracker from "./UserTracker.vue";
import CreepyPopup from "./CreepyPopup.vue";
import WatchingEye from "./WatchingEye.vue";
import MouseCorruption from "./MouseCorruption.vue";

export default {
  name: "RetroAd",
  components: {
    GlitchText,
    UserTracker,
    CreepyPopup,
    WatchingEye,
    MouseCorruption,
  },
  data() {
    return {
      stage: 1,
      isGlitching: false,
      userInfo: {
        name: "",
        email: "",
      },
      interactionCount: 0,
      visitorCount: Math.floor(Math.random() * 99999) + 10000,
      glitchChars: "!@#$%^&*()_+-=[]{}|;:,.<>?/~`",
      finalMessage: "Y0U 4R3 TH3 PR0DUC7",
      glitchIntensity: 0.1,
    };
  },
methods: {
  handleInteraction() {
    this.interactionCount++

    this.glitchIntensity = Math.min(0.9, this.interactionCount * 0.06)

    // typing interaction glitches
    if (this.interactionCount > 5) {
      this.triggerGlitch()
    }
  },

  handleSubmit() {
    // If they haven't filled and clicked, fire glitches
    if (!this.userInfo.name || !this.userInfo.email) {
      this.finalMessage = 'INCOMPLETE CREDENTIALS. PROFILE INTAKE PENDING.'
      this.triggerGlitch()
      return
    }

    // Full data, k process
    if (this.stage === 1) {
      this.stage = 2
      setTimeout(() => {
        this.stage = 3
        this.downloadUserTXT()
      }, 3000) 
    }
  },

    triggerGlitch() {
      this.isGlitching = true;
      setTimeout(() => {
        this.isGlitching = false;
      }, 200);
    },

    getGlitchText() {
      const phrases = [
        "U5ER D4TA PR0CE55ING...",
        "B3HAVI0RAL 4N4LYSIS C0MPL3T3",
        "PR0FIL3 G3N3RA7ION IN PR0GR3SS",
        "Y0U 4RE TH3 PR0DUC7",
        "S3LLING Y0UR A77EN710N",
        "D4T4 H4RVES7ED SUCCE55FULLY",
      ];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      return this.corruptText(phrase);
    },

    corruptText(text) {
      return text
        .split("")
        .map((char) => {
          if (Math.random() > 0.7) {
            return this.glitchChars[
              Math.floor(Math.random() * this.glitchChars.length)
            ];
          }
          return char;
        })
        .join("");
    },

    generateProductId() {
      return (
        "USR-" +
        Date.now() +
        "-" +
        Math.random().toString(36).substr(2, 9).toUpperCase()
      );
    },

    handleTrackerActivity(event) {
      // processes the data from the tracker
      if (event.data.CLICKS > 10) {
        this.finalMessage = "Y0UR 3NGAG3MENT H45 B33N M0NETIZ3D xD";
      }
      if (event.data.TIME_SPENT > 60) {
        this.finalMessage = "A77ENTI0N H4RV3ST3D r0fl. PROFILE COMPLETIONED l0l.";
      }
    },

    handlePopupShown(message) {
      console.log("Popup displayed:", message);
      this.triggerGlitch();
    },

    collectUserData(data) {
      console.log("User data collected:", data);
      // store data for final reveal
      if (data.type === "fear") {
        this.finalMessage = `Y0UR F34R: "${data.value}" H4S B33N C4TAL0GUED`;
      }
    },

    handleUserTyping(text) {
      if (text.length % 5 === 0) {
        this.triggerGlitch();
      }
    },

    downloadUserTXT() {
      // NOT MALWARE l0l
      const text = `
=== CYBERDREAM DATA EXTRACTION COMPLETE ===

Product ID: ${this.generateProductId()}
Name: ${this.userInfo.name || "UNKNOWN"}
Email: ${this.userInfo.email || "UNKNOWN"}

Interaction Points: ${this.interactionCount}

Final Message: ${this.finalMessage}

Timestamp: ${new Date().toLocaleString()}
`;

      const file = new Blob([text], { type: "text/plain" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "USER_EXPORT.txt";

      // download trigger
      link.click();
      URL.revokeObjectURL(link.href);
    },
  },
};

</script>

<style scoped>
.retro-container {
  min-height: 100vh;
  position: relative;
  background: #000;
}

/* Stage 1 Styles */
.stage-one {
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, white, transparent),
    radial-gradient(1px 1px at 50px 50px, white, transparent);
  background-size: 200px 200px;
  animation: move-stars 20s linear infinite;
}

@keyframes move-stars {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-200px);
  }
}

.top-banner {
  background: yellow;
  color: red;
  font-size: 24px;
  font-weight: bold;
  padding: 10px;
  border: 3px solid red;
}

.main-content {
  padding: 40px;
  text-align: center;
}

.title {
  font-size: 72px;
  font-weight: bold;
  text-transform: uppercase;
  margin: 20px 0;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 36px;
  color: yellow;
  text-shadow: 2px 2px 0px rgba(255, 0, 0, 0.8);
  margin: 20px 0;
}

.product-box {
  background: rgba(255, 255, 255, 0.9);
  border: 5px solid #ff00ff;
  border-radius: 20px;
  padding: 20px;
  margin: 40px auto;
  max-width: 600px;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.3);
}

.product-image {
  border: 3px solid gold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.cyber-text {
  font-size: 24px;
  color: #ff00ff;
  margin: 20px 0;
  font-weight: bold;
}

.price {
  font-size: 48px;
  color: red;
  font-weight: bold;
}

.discount {
  font-size: 18px;
  color: green;
  margin: 10px 0;
}

.form-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  margin: 40px auto;
  max-width: 500px;
  border: 3px dashed yellow;
  border-radius: 15px;
}

.form-title {
  color: yellow;
  font-size: 28px;
  margin-bottom: 20px;
  animation: flash 1s infinite;
}

@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.retro-input {
  display: block;
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  font-size: 18px;
  font-family: "Courier New", monospace;
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid #00ff00;
  text-transform: uppercase;
}

.retro-button {
  background: linear-gradient(to right, #ff00ff, #00ffff);
  color: white;
  border: none;
  padding: 20px 40px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 50px;
  animation: glow 2s infinite;
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.8);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.8);
  }
}

.visitor-counter {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: black;
  color: #00ff00;
  padding: 10px 20px;
  font-family: "Courier New", monospace;
  border: 2px solid #00ff00;
}

/* glitch effect */
.glitching {
  animation: glitch 0.2s infinite;
}

@keyframes glitch {
  0% {
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
  100% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
}

/* Stage 2 Styles */
.stage-two {
  background: #000;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.glitch-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 0, 0.1),
    rgba(0, 255, 0, 0.1) 2px,
    transparent 2px,
    transparent 4px
  );
  animation: scan 8s linear infinite;
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(20px);
  }
}

.corrupted-text {
  color: #00ff00;
  font-family: "Courier New", monospace;
  font-size: 20px;
  text-align: center;
}

.glitch-line {
  margin: 10px 0;
  opacity: 0.8;
  animation: flicker 0.1s infinite;
}

@keyframes flicker {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
}

/* Stage 3 Styles */
.stage-three {
  background: #000;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ff00;
  font-family: "Courier New", monospace;
}

.dark-container {
  text-align: center;
  padding: 40px;
  border: 1px solid #00ff00;
  background: rgba(0, 0, 0, 0.8);
}

.reveal-title {
  font-size: 48px;
  margin-bottom: 30px;
  animation: type 3s steps(40, end);
}

@keyframes type {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.reveal-text {
  font-size: 18px;
  margin: 15px 0;
  opacity: 0;
  animation: fade-in 1s forwards;
}

.reveal-text:nth-child(2) {
  animation-delay: 0.5s;
}
.reveal-text:nth-child(3) {
  animation-delay: 1s;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

.user-data {
  margin: 30px 0;
  padding: 20px;
  border: 1px dashed #00ff00;
}

.user-data p {
  margin: 10px 0;
  font-size: 16px;
}

.final-message {
  font-size: 32px;
  color: #ff0000;
  margin-top: 30px;
  font-weight: bold;
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0%,
  100% {
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
  }
  50% {
    text-shadow: 0 0 30px rgba(255, 0, 0, 1);
  }
}
.stars {
  pointer-events: none !important;
}

</style>
