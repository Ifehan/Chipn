import { performanceMonitor } from '../performance-monitor';
import type { PerformanceMetric } from '../performance-monitor';

const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeEach(() => {
  performanceMonitor.clear();
  console.warn = vi.fn();
  console.log = vi.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Helper to record a metric with sensible defaults
const record = (overrides: Partial<PerformanceMetric> & { duration: number }) => {
  performanceMonitor.recordRequest(
    overrides.endpoint ?? '/api/test',
    overrides.method ?? 'GET',
    overrides.duration,
    overrides.status ?? 200,
    overrides.success ?? true
  );
};

describe('PerformanceMonitor Service', () => {
  describe('recordRequest', () => {
    it('adds a metric entry to the metrics list', () => {
      record({ duration: 100 });
      expect(performanceMonitor.getMetrics()).toHaveLength(1);
    });

    it('stores all provided fields correctly', () => {
      record({ endpoint: '/api/users', method: 'POST', duration: 200, status: 201, success: true });
      const metrics = performanceMonitor.getMetrics();
      expect(metrics[0]).toMatchObject({
        endpoint: '/api/users',
        method: 'POST',
        duration: 200,
        status: 201,
        success: true,
      });
    });

    it('stores a timestamp in ISO format', () => {
      record({ duration: 100 });
      expect(performanceMonitor.getMetrics()[0].timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
    });

    it('logs a warning for requests exceeding 3000ms', () => {
      record({ endpoint: '/api/slow', method: 'GET', duration: 3001 });
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Slow API Request')
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('3001ms')
      );
    });

    it('does not log a warning for requests at exactly 3000ms', () => {
      record({ duration: 3000 });
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('does not log a warning for requests under 3000ms', () => {
      record({ duration: 2999 });
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('accumulates multiple metrics', () => {
      record({ duration: 100 });
      record({ duration: 200 });
      record({ duration: 300 });
      expect(performanceMonitor.getMetrics()).toHaveLength(3);
    });

    it('retains only the most recent 1000 metrics when limit is exceeded', () => {
      for (let i = 0; i < 1010; i++) {
        record({ duration: i });
      }
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toHaveLength(1000);
      expect(metrics[0].duration).toBe(10);
      expect(metrics[999].duration).toBe(1009);
    });
  });

  describe('getMetrics', () => {
    it('returns an empty array when no metrics have been recorded', () => {
      expect(performanceMonitor.getMetrics()).toEqual([]);
    });

    it('returns a copy and not the internal array reference', () => {
      record({ duration: 100 });
      const metrics = performanceMonitor.getMetrics();
      metrics.push({ endpoint: '/injected', method: 'GET', duration: 0, status: 200, timestamp: '', success: true });
      expect(performanceMonitor.getMetrics()).toHaveLength(1);
    });

    it('returns all recorded metrics across methods', () => {
      record({ method: 'GET', duration: 100 });
      record({ method: 'POST', duration: 200 });
      record({ method: 'DELETE', duration: 300 });
      expect(performanceMonitor.getMetrics()).toHaveLength(3);
    });
  });

  describe('getAverageTime', () => {
    it('returns 0 when no metrics exist for the endpoint', () => {
      expect(performanceMonitor.getAverageTime('/api/unknown')).toBe(0);
    });

    it('returns the correct average duration for an endpoint', () => {
      record({ endpoint: '/api/users', duration: 100 });
      record({ endpoint: '/api/users', duration: 200 });
      record({ endpoint: '/api/users', duration: 300 });
      expect(performanceMonitor.getAverageTime('/api/users')).toBe(200);
    });

    it('rounds the average to the nearest integer', () => {
      record({ endpoint: '/api/items', duration: 100 });
      record({ endpoint: '/api/items', duration: 200 });
      record({ endpoint: '/api/items', duration: 150 });
      // average = 450/3 = 150 exactly, use uneven values:
      record({ endpoint: '/api/round', duration: 100 });
      record({ endpoint: '/api/round', duration: 101 });
      expect(performanceMonitor.getAverageTime('/api/round')).toBe(101);
    });

    it('filters by method when method is provided', () => {
      record({ endpoint: '/api/users', method: 'GET', duration: 100 });
      record({ endpoint: '/api/users', method: 'POST', duration: 300 });
      expect(performanceMonitor.getAverageTime('/api/users', 'GET')).toBe(100);
      expect(performanceMonitor.getAverageTime('/api/users', 'POST')).toBe(300);
    });

    it('excludes metrics from other endpoints', () => {
      record({ endpoint: '/api/users', duration: 100 });
      record({ endpoint: '/api/orders', duration: 500 });
      expect(performanceMonitor.getAverageTime('/api/users')).toBe(100);
    });
  });

  describe('getSlowestRequests', () => {
    beforeEach(() => {
      record({ endpoint: '/api/fast', duration: 50 });
      record({ endpoint: '/api/medium', duration: 500 });
      record({ endpoint: '/api/slow', duration: 2000 });
      record({ endpoint: '/api/slowest', duration: 5000 });
    });

    it('returns requests sorted by duration descending', () => {
      const slowest = performanceMonitor.getSlowestRequests();
      expect(slowest[0].duration).toBe(5000);
      expect(slowest[1].duration).toBe(2000);
    });

    it('returns at most the default limit of 10', () => {
      for (let i = 0; i < 20; i++) {
        record({ duration: i * 10 });
      }
      expect(performanceMonitor.getSlowestRequests()).toHaveLength(10);
    });

    it('respects a custom limit', () => {
      expect(performanceMonitor.getSlowestRequests(2)).toHaveLength(2);
    });

    it('returns all metrics when limit exceeds total count', () => {
      expect(performanceMonitor.getSlowestRequests(100)).toHaveLength(4);
    });

    it('does not mutate the internal metrics order', () => {
      performanceMonitor.getSlowestRequests();
      const metrics = performanceMonitor.getMetrics();
      expect(metrics[0].endpoint).toBe('/api/fast');
    });
  });

  describe('getFailedRequests', () => {
    it('returns only failed requests', () => {
      record({ duration: 100, success: true });
      record({ duration: 200, success: false, status: 500 });
      record({ duration: 300, success: false, status: 404 });
      const failed = performanceMonitor.getFailedRequests();
      expect(failed).toHaveLength(2);
      failed.forEach(m => expect(m.success).toBe(false));
    });

    it('returns an empty array when all requests are successful', () => {
      record({ duration: 100, success: true });
      expect(performanceMonitor.getFailedRequests()).toEqual([]);
    });

    it('returns an empty array when no metrics exist', () => {
      expect(performanceMonitor.getFailedRequests()).toEqual([]);
    });
  });

  describe('getSummary', () => {
    it('returns N/A success rate when no metrics exist', () => {
      expect(performanceMonitor.getSummary().successRate).toBe('N/A');
    });

    it('returns zero avgDuration when no metrics exist', () => {
      expect(performanceMonitor.getSummary().avgDuration).toBe('0ms');
    });

    it('returns correct total, successful, and failed counts', () => {
      record({ duration: 100, success: true });
      record({ duration: 200, success: true });
      record({ duration: 300, success: false });
      const summary = performanceMonitor.getSummary();
      expect(summary.total).toBe(3);
      expect(summary.successful).toBe(2);
      expect(summary.failed).toBe(1);
    });

    it('calculates success rate as a percentage string', () => {
      record({ duration: 100, success: true });
      record({ duration: 200, success: false });
      expect(performanceMonitor.getSummary().successRate).toBe('50.00%');
    });

    it('returns 100% success rate when all requests succeed', () => {
      record({ duration: 100, success: true });
      record({ duration: 200, success: true });
      expect(performanceMonitor.getSummary().successRate).toBe('100.00%');
    });

    it('calculates average duration correctly', () => {
      record({ duration: 100 });
      record({ duration: 300 });
      expect(performanceMonitor.getSummary().avgDuration).toBe('200ms');
    });

    it('counts slow requests exceeding 3000ms threshold', () => {
      record({ duration: 1000 });
      record({ duration: 3001 });
      record({ duration: 5000 });
      expect(performanceMonitor.getSummary().slowRequests).toBe(2);
    });

    it('does not count requests at exactly 3000ms as slow', () => {
      record({ duration: 3000 });
      expect(performanceMonitor.getSummary().slowRequests).toBe(0);
    });
  });

  describe('clear', () => {
    it('removes all recorded metrics', () => {
      record({ duration: 100 });
      record({ duration: 200 });
      performanceMonitor.clear();
      expect(performanceMonitor.getMetrics()).toHaveLength(0);
    });

    it('allows recording metrics again after clearing', () => {
      record({ duration: 100 });
      performanceMonitor.clear();
      record({ duration: 200 });
      expect(performanceMonitor.getMetrics()).toHaveLength(1);
      expect(performanceMonitor.getMetrics()[0].duration).toBe(200);
    });
  });

  describe('exportMetrics', () => {
    it('returns a valid JSON string', () => {
      record({ duration: 100 });
      expect(() => JSON.parse(performanceMonitor.exportMetrics())).not.toThrow();
    });

    it('includes a metrics array in the export', () => {
      record({ duration: 100 });
      record({ duration: 200 });
      const exported = JSON.parse(performanceMonitor.exportMetrics());
      expect(exported.metrics).toHaveLength(2);
    });

    it('includes a summary object in the export', () => {
      record({ duration: 100, success: true });
      const exported = JSON.parse(performanceMonitor.exportMetrics());
      expect(exported.summary).toMatchObject({
        total: 1,
        successful: 1,
        failed: 0,
        successRate: '100.00%',
      });
    });

    it('exports an empty metrics array when no metrics exist', () => {
      const exported = JSON.parse(performanceMonitor.exportMetrics());
      expect(exported.metrics).toEqual([]);
    });

    it('includes expected fields in each exported metric entry', () => {
      record({ endpoint: '/api/export', method: 'PUT', duration: 150, status: 200, success: true });
      const exported = JSON.parse(performanceMonitor.exportMetrics());
      expect(exported.metrics[0]).toMatchObject({
        endpoint: '/api/export',
        method: 'PUT',
        duration: 150,
        status: 200,
        success: true,
      });
    });
  });
});
