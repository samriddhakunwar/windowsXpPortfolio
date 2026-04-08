export type EventCallback = (data?: any) => void;

export class EventBus {
  private static listeners: Map<string, EventCallback[]> = new Map();

  static on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  static emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }

  static off(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  static clear(event?: string) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// Define desktop event constants
export const DESKTOP_EVENTS = {
  APP_LAUNCHED: "app:launched",
  APP_CLOSED: "app:closed",
  WINDOW_FOCUSED: "window:focused",
  WINDOW_MINIMIZED: "window:minimized",
  WINDOW_MAXIMIZED: "window:maximized",
  TASKBAR_UPDATED: "taskbar:updated",
} as const;
