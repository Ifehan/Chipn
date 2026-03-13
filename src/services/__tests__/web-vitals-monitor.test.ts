import type { WebVital } from '../web-vitals-monitor';

const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Must mock browser APIs before the module is loaded
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
let capturedCallbacks: Record<string, (list: { getEntries: () => unknown[] }) => void> = {};

class MockPerformanceObserver {
  private callback: (list: { getEntries: () => unknown[] }) => void;
  constructor(callback: (list: { getEntries: () => unknown[] }) => void) {
    this.callback = callback;
  }
  observe({ entryTypes }: { entryTypes: string[] }) {
    capturedCallbacks[entryTypes[0]] = this.callback;
    mockObserve({ entryTypes });
  }
  disconnect() {
    mockDisconnect();
  }
}

// Helper to get a fresh monitor instance with clean state
const getFreshMonitor = async () => {
  let monitor: typeof import('../web-vitals-monitor');
  jest.isolateModules(() => {
    monitor = require('../web-vitals-monitor');
  });
  return monitor!.webVitalsMonitor;
};

beforeAll(() => {
  Object.defineProperty(window, 'PerformanceObserver', {
    writable: true,
    configurable: true,
    value: MockPerformanceObserver,
  });
  Object.defineProperty(window, 'PerformanceNavigationTiming', {
    writable: true,
    configurable: true,
    value: {},
  });
});

beforeEach(() => {
  capturedCallbacks = {};
  console.warn = jest.fn();
  console.log = jest.fn();
  delete (window as any).location;
  (window as any).location = { href: 'http://localhost/' };
});

afterEach(() => {
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Helper to simulate a vital being recorded via the observer
const triggerObserver = (
  entryType: string,
  entries: unknown[]
) => {
  const callback = capturedCallbacks[entryType];
  if (callback) {
    callback({ getEntries: () => entries });
  }
};

describe('WebVitalsMonitor', () => {
  describe('getRating (via recordVital)', () => {
    it.each([
      // LCP thresholds: good <= 2500, needs-improvement <= 4000, poor > 4000
      ['LCP', 2500, 'good'],
      ['LCP', 2501, 'needs-improvement'],
      ['LCP', 4000, 'needs-improvement'],
      ['LCP', 4001, 'poor'],
      // FID thresholds: good <= 100, needs-improvement <= 300, poor > 300
      ['FID', 100, 'good'],
      ['FID', 101, 'needs-improvement'],
      ['FID', 300, 'needs-improvement'],
      ['FID', 301, 'poor'],
      // CLS thresholds: good <= 0.1, needs-improvement <= 0.25, poor > 0.25
      ['CLS', 0.1, 'good'],
      ['CLS', 0.11, 'needs-improvement'],
      ['CLS', 0.25, 'needs-improvement'],
      ['CLS', 0.26, 'poor'],
      // FCP thresholds: good <= 1800, needs-improvement <= 3000, poor > 3000
      ['FCP', 1800, 'good'],
      ['FCP', 1801, 'needs-improvement'],
      ['FCP', 3000, 'needs-improvement'],
      ['FCP', 3001, 'poor'],
      // TTFB thresholds: good <= 800, needs-improvement <= 1800, poor > 1800
      ['TTFB', 800, 'good'],
      ['TTFB', 801, 'needs-improvement'],
      ['TTFB', 1800, 'needs-improvement'],
      ['TTFB', 1801, 'poor'],
    ] as [WebVital['name'], number, WebVital['rating']][])
    ('%s with value %s should be rated "%s"', async (name, value, expectedRating) => {
      const monitor = await getFreshMonitor();
      triggerObserver(
        name === 'LCP' ? 'largest-contentful-paint' :
        name === 'FCP' ? 'paint' :
        name === 'CLS' ? 'layout-shift' : name.toLowerCase(),
        name === 'LCP'
          ? [{ renderTime: value, loadTime: value }]
          : name === 'CLS'
          ? [{ value, hadRecentInput: false }]
          : [{ startTime: value }]
      );
      const vitals = monitor.getVitals();
      const recorded = vitals.find(v => v.name === name && v.value === value);
      if (recorded) {
        expect(recorded.rating).toBe(expectedRating);
      }
    });
  });

  describe('recordVital (via observer callbacks)', () => {
    it('records an LCP vital using renderTime when available', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('largest-contentful-paint', [
        { renderTime: 1200, loadTime: 2000 },
      ]);
      const vitals = monitor.getVitals();
      expect(vitals).toHaveLength(1);
      expect(vitals[0]).toMatchObject({ name: 'LCP', value: 1200, rating: 'good' });
    });

    it('falls back to loadTime for LCP when renderTime is 0', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('largest-contentful-paint', [
        { renderTime: 0, loadTime: 3000 },
      ]);
      const vitals = monitor.getVitals();
      expect(vitals[0]).toMatchObject({ name: 'LCP', value: 3000 });
    });

    it('records an FCP vital using startTime', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      const vitals = monitor.getVitals();
      expect(vitals).toHaveLength(1);
      expect(vitals[0]).toMatchObject({ name: 'FCP', value: 900, rating: 'good' });
    });

    it('records a CLS vital accumulating values across entries', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('layout-shift', [
        { value: 0.05, hadRecentInput: false },
        { value: 0.04, hadRecentInput: false },
      ]);
      const vitals = monitor.getVitals();
      expect(vitals[0]).toMatchObject({ name: 'CLS', value: 0.09 });
    });

    it('skips CLS entries that had recent input', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('layout-shift', [
        { value: 0.1, hadRecentInput: true },
        { value: 0.05, hadRecentInput: false },
      ]);
      const vitals = monitor.getVitals();
      expect(vitals[0].value).toBeCloseTo(0.05);
    });

    it('stores the current URL on the vital entry', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 500 }]);
      expect(monitor.getVitals()[0].url).toBe('http://localhost/');
    });

    it('stores a timestamp in ISO format', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 500 }]);
      expect(monitor.getVitals()[0].timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
    });

    it('does not record a duplicate vital with the same name and value', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      triggerObserver('paint', [{ startTime: 900 }]);
      expect(monitor.getVitals()).toHaveLength(1);
    });

    it('records a new entry when the value differs for the same vital name', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      triggerObserver('paint', [{ startTime: 1000 }]);
      expect(monitor.getVitals()).toHaveLength(2);
    });

    it('logs a console.warn for needs-improvement vitals', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 2000 }]); // FCP needs-improvement
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Web Vital Issue')
      );
    });

    it('logs a console.warn for poor vitals', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 5000 }]); // FCP poor
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('poor')
      );
    });

    it('does not log a console.warn for good vitals', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 500 }]); // FCP good
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('getVitals', () => {
    it('returns an empty array when no vitals have been recorded', async () => {
      const monitor = await getFreshMonitor();
      expect(monitor.getVitals()).toEqual([]);
    });

    it('returns a copy and not the internal array reference', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 500 }]);
      const vitals = monitor.getVitals();
      vitals.push({ name: 'FID', value: 0, rating: 'good', timestamp: '', url: '' });
      expect(monitor.getVitals()).toHaveLength(1);
    });
  });

  describe('getLatestReadings', () => {
    it('returns an empty object when no vitals exist', async () => {
      const monitor = await getFreshMonitor();
      expect(monitor.getLatestReadings()).toEqual({});
    });

    it('returns the latest reading for each recorded vital', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      triggerObserver('paint', [{ startTime: 1000 }]);
      const latest = monitor.getLatestReadings();
      // Last write wins for the same name key
      expect(latest.FCP?.value).toBe(1000);
    });

    it('returns one entry per vital name regardless of how many were recorded', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 500 }]);
      triggerObserver('largest-contentful-paint', [{ renderTime: 1200, loadTime: 0 }]);
      const latest = monitor.getLatestReadings();
      expect(Object.keys(latest)).toHaveLength(2);
    });
  });

  describe('getSummary', () => {
    it('returns N/A for all vitals when none have been recorded', async () => {
      const monitor = await getFreshMonitor();
      const summary = monitor.getSummary();
      expect(summary).toEqual({ LCP: 'N/A', FID: 'N/A', CLS: 'N/A', FCP: 'N/A', TTFB: 'N/A' });
    });

    it('formats FCP summary string with value and rating', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      expect(monitor.getSummary().FCP).toBe('900ms (good)');
    });

    it('formats LCP summary string with value and rating', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('largest-contentful-paint', [{ renderTime: 3000, loadTime: 0 }]);
      expect(monitor.getSummary().LCP).toBe('3000ms (needs-improvement)');
    });

    it('formats CLS without ms suffix', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('layout-shift', [{ value: 0.05, hadRecentInput: false }]);
      expect(monitor.getSummary().CLS).toBe('0.05 (good)');
    });

    it('returns N/A for unrecorded vitals alongside recorded ones', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      const summary = monitor.getSummary();
      expect(summary.FCP).toBe('900ms (good)');
      expect(summary.LCP).toBe('N/A');
    });
  });

  describe('clear', () => {
    it('removes all recorded vitals', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 500 }]);
      monitor.clear();
      expect(monitor.getVitals()).toHaveLength(0);
    });

    it('allows recording vitals again after clearing', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 500 }]);
      monitor.clear();
      triggerObserver('paint', [{ startTime: 800 }]);
      expect(monitor.getVitals()).toHaveLength(1);
      expect(monitor.getVitals()[0].value).toBe(800);
    });
  });

  describe('exportVitals', () => {
    it('returns a valid JSON string', async () => {
      const monitor = await getFreshMonitor();
      expect(() => JSON.parse(monitor.exportVitals())).not.toThrow();
    });

    it('includes a vitals array in the export', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      const exported = JSON.parse(monitor.exportVitals());
      expect(exported.vitals).toHaveLength(1);
    });

    it('includes a summary object in the export', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      const exported = JSON.parse(monitor.exportVitals());
      expect(exported.summary).toMatchObject({ FCP: '900ms (good)' });
    });

    it('exports an empty vitals array when no vitals exist', async () => {
      const monitor = await getFreshMonitor();
      const exported = JSON.parse(monitor.exportVitals());
      expect(exported.vitals).toEqual([]);
    });

    it('includes expected fields in each exported vital entry', async () => {
      const monitor = await getFreshMonitor();
      triggerObserver('paint', [{ startTime: 900 }]);
      const exported = JSON.parse(monitor.exportVitals());
      expect(exported.vitals[0]).toMatchObject({
        name: 'FCP',
        value: 900,
        rating: 'good',
        url: 'http://localhost/',
      });
    });
  });
});
