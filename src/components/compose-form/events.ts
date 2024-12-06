type EventCallback = (data: any) => void;

class EventEmitter {
  events: { [key: string]: Array<EventCallback> };

  constructor() {
    this.events = {};
  }

  dispatch(event: string, data?: any) {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach((callback) => callback(data));
  }

  subscribe(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  remove(event?: string, callback?: EventCallback) {
    if (!event) {
      this.events = {};
    } else if (this.events[event]) {
      if (callback) {
        const index = this.events[event].indexOf(callback);
        if (index > -1) {
          this.events[event].splice(index, 1);
        }
      } else {
        this.events[event] = [];
      }
    }
  }
}

export default EventEmitter;
