/* ==========================================================================
   📡 EVENT BUS - QUẢN LÝ SỰ KIỆN TOÀN CỤC
   ========================================================================== */

class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error(`Error in listener for event ${event}:`, err);
      }
    });
  }
}

export const events = new EventBus();
