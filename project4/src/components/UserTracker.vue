<template>
  <div class="tracker-container" :class="{ visible: showTracker }">
    <div class="tracker-header">
      <span class="tracker-title">USER MONITORING SYSTEM v2.0</span>
      <span class="status" :class="{ active: isTracking }">
        {{ isTracking ? "● RECORDING" : "○ STANDBY" }}
      </span>
    </div>

    <div class="tracker-data">
      <div class="data-row" v-for="(value, key) in trackedData" :key="key">
        <span class="data-label">{{ key }}:</span>
        <span class="data-value">{{ value }}</span>
      </div>
    </div>

    <div class="tracker-log">
      <div class="log-entry" v-for="(log, index) in activityLog" :key="index">
        [{{ log.time }}] {{ log.action }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserTracker",
  props: {
    showTracker: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isTracking: false,
      trackedData: {
        MOUSE_X: 0,
        MOUSE_Y: 0,
        CLICKS: 0,
        KEYPRESSES: 0,
        TIME_SPENT: 0,
        SCROLL_DEPTH: 0,
      },
      activityLog: [],
      startTime: Date.now(),
      mouseMovements: [],
    };
  },
  mounted() {
    this.startTracking();
  },
  beforeUnmount() {
    this.stopTracking();
  },
  methods: {
    startTracking() {
      this.isTracking = true;
      //all listeners to track user activity
      document.addEventListener("mousemove", this.handleMouseMove);

      document.addEventListener("click", this.handleClick);

      document.addEventListener("keypress", this.handleKeypress);

      window.addEventListener("scroll", this.handleScroll);

      setInterval(() => {
        this.trackedData.TIME_SPENT = Math.floor(
          (Date.now() - this.startTime) / 1000
        );
      }, 1000);

      this.logActivity("TRACKING INITIATED");
    },

    stopTracking() {
      this.isTracking = false;
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("click", this.handleClick);
      document.removeEventListener("keypress", this.handleKeypress);
      window.removeEventListener("scroll", this.handleScroll);
    },

    handleMouseMove(event) {
      this.trackedData.MOUSE_X = event.clientX;
      this.trackedData.MOUSE_Y = event.clientY;

      this.mouseMovements.push({
        x: event.clientX,
        y: event.clientY,
        time: Date.now(),
      });

      if (this.mouseMovements.length > 100) {
        this.analyzeMousePattern();
      }
    },

    handleClick() {
      this.trackedData.CLICKS++;
      this.logActivity("USER_CLICK_DETECTED");
    },

    handleKeypress() {
      this.trackedData.KEYPRESSES++;
      this.logActivity("KEYPRESS_CAPTURED");
    },

    handleScroll() {
      const scrollPercentage = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );
      this.trackedData.SCROLL_DEPTH = scrollPercentage;
    },

    analyzeMousePattern() {
      this.logActivity("BEHAVIORAL_PATTERN_ANALYZED");
      this.mouseMovements = [];
    },

    logActivity(action) {
      const time = new Date().toLocaleTimeString();
      this.activityLog.unshift({ time, action });

      if (this.activityLog.length > 5) {
        this.activityLog.pop();
      }

      this.$emit("activity", { action, data: this.trackedData });
    },
  },
};
</script>

<style scoped>
.tracker-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 350px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #00ff00;
  color: #00ff00;
  font-family: "Courier New", monospace;
  font-size: 12px;
  padding: 15px;
  z-index: 9999;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.tracker-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #00ff00;
}

.tracker-title {
  font-weight: bold;
  text-transform: uppercase;
}

.status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.status.active {
  color: #ff0000;
  animation: blink 1s infinite;
}

.tracker-data {
  margin-bottom: 15px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}

.data-label {
  color: #00ff00;
  opacity: 0.7;
}

.data-value {
  color: #00ffff;
  font-weight: bold;
}

.tracker-log {
  border-top: 1px solid #00ff00;
  padding-top: 10px;
  max-height: 100px;
  overflow-y: auto;
}

.log-entry {
  margin: 3px 0;
  font-size: 11px;
  opacity: 0.8;
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 0.8;
    transform: translateX(0);
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
