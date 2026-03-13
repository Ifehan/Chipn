/**
 * Web Vitals Monitor
 * Tracks Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
 */

export interface WebVital {
  name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: string;
  url: string;
}

export interface VitalThresholds {
  good: number;
  needsImprovement: number;
}

export class WebVitalsMonitor {
  private vitals: WebVital[] = [];
  private thresholds: Record<string, VitalThresholds> = {
    LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
    FID: { good: 100, needsImprovement: 300 }, // First Input Delay
    CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
    FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
    TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  };

  constructor() {
    this.initializeWebVitalsObserver();
  }

  private getRating(
    name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB',
    value: number
  ): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = this.thresholds[name];
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  private initializeWebVitalsObserver(): void {
    // Track LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const lastEntry = list.getEntries().pop() as
            | (PerformanceEntry & { renderTime?: number; loadTime?: number })
            | undefined;
          if (lastEntry) {
            this.recordVital('LCP', lastEntry.renderTime || lastEntry.loadTime || 0);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (_e) {
        // LCP not supported
      }

      // Track FCP (First Contentful Paint)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const lastEntry = list.getEntries().pop();
          if (lastEntry) {
            this.recordVital('FCP', lastEntry.startTime);
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (_e) {
        // FCP not supported
      }

      // Track CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((entry as any).hadRecentInput) continue;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clsValue += (entry as any).value;
          }
          this.recordVital('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (_e) {
        // CLS not supported
      }
    }

    // Track TTFB (Time to First Byte)
    if ('PerformanceNavigationTiming' in window) {
      window.addEventListener('load', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation?.responseStart) {
          this.recordVital('TTFB', navigation.responseStart);
        }
      });
    }
  }

  private recordVital(
    name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB',
    value: number
  ): void {
    // Avoid duplicate entries
    const exists = this.vitals.some(v => v.name === name && v.value === value);
    if (exists) return;

    const vital: WebVital = {
      name,
      value,
      rating: this.getRating(name, value),
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    this.vitals.push(vital);

    // Log non-good vitals
    if (vital.rating !== 'good') {
      console.warn(`⚠️ Web Vital Issue: ${name} = ${value}ms (${vital.rating})`);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `📊 Web Vital: ${name} = ${value}ms (${vital.rating})`
      );
    }
  }

  /**
   * Get all recorded vitals
   */
  getVitals(): WebVital[] {
    return [...this.vitals];
  }

  /**
   * Get latest reading for each vital
   */
  getLatestReadings(): Partial<Record<'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB', WebVital>> {
    const latest: Partial<Record<'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB', WebVital>> = {};

    for (const vital of this.vitals) {
      latest[vital.name] = vital;
    }

    return latest;
  }

  /**
   * Get summary of all vitals
   */
  getSummary() {
    const readings = this.getLatestReadings();
    return {
      LCP: readings.LCP ? `${readings.LCP.value}ms (${readings.LCP.rating})` : 'N/A',
      FID: readings.FID ? `${readings.FID.value}ms (${readings.FID.rating})` : 'N/A',
      CLS: readings.CLS ? `${readings.CLS.value} (${readings.CLS.rating})` : 'N/A',
      FCP: readings.FCP ? `${readings.FCP.value}ms (${readings.FCP.rating})` : 'N/A',
      TTFB: readings.TTFB ? `${readings.TTFB.value}ms (${readings.TTFB.rating})` : 'N/A',
    };
  }

  /**
   * Export vitals as JSON
   */
  exportVitals(): string {
    return JSON.stringify({
      vitals: this.vitals,
      summary: this.getSummary(),
    }, null, 2);
  }

  /**
   * Clear all vitals
   */
  clear(): void {
    this.vitals = [];
  }
}

// Export singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();
