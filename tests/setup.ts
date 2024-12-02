global.console = {
    ...console,
    // log: jest.fn(),
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
};

class MockCustomEvent {
    constructor(type: string, options?: any) {
        return {
            type,
            detail: options?.detail
        };
    }
}

class MockEventTarget {
    listeners: { [key: string]: Function[] } = {};

    addEventListener(type: string, listener: Function) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
    }

    removeEventListener(type: string, listener: Function) {
        if (!this.listeners[type]) return;
        this.listeners[type] = this.listeners[type].filter(l => l !== listener);
    }

    dispatchEvent(event: any) {
        if (!this.listeners[event.type]) return;
        this.listeners[event.type].forEach(listener => listener(event));
        return true;
    }
}

global.CustomEvent = MockCustomEvent as any;
global.EventTarget = MockEventTarget as any;

if (typeof window === 'undefined') {
    (global as any).window = new MockEventTarget();
}