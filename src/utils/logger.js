// src/utils/logger.js
const LOG_ENABLED = true; // 🔄 Toggle this flag to enable/disable logs

export const log = (...args) => {
  if (LOG_ENABLED) {
    console.log("📘 [LOG]:", ...args);
  }
};

export const warn = (...args) => {
  if (LOG_ENABLED) {
    console.warn("⚠️ [WARN]:", ...args);
  }
};

export const error = (...args) => {
  if (LOG_ENABLED) {
    console.error("❌ [ERROR]:", ...args);
  }
};
