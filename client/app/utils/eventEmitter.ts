/**
 * Simple event emitter for cross-component communication
 */
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(...args));
  }
}

// Global event emitter instance
export const globalEvents = new EventEmitter();

// Event types
export const EVENTS = {
  TECHNOLOGY_UPDATED: 'technology:updated',
  TECHNOLOGY_CREATED: 'technology:created',
  TECHNOLOGY_DELETED: 'technology:deleted',
  TECHNOLOGIES_REFRESH: 'technologies:refresh'
} as const;
