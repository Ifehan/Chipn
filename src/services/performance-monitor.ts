/**
 * Performance Monitor Service
 * Tracks API response times and other performance metrics
 */

export interface PerformanceMetric {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  duration: number; // milliseconds
  status: number;
  timestamp: string;
  success: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;
  private slowRequestThreshold = 3000; // 3 seconds
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Record an API request metric
   */
  recordRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    duration: number,
    status: number,
    success: boolean
  ): void {
    const metric: PerformanceMetric = {
      endpoint,
      method,
      duration,
      status,
      timestamp: new Date().toISOString(),
      success,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow requests
    if (duration > this.slowRequestThreshold) {
      console.warn(
        `⚠️ Slow API Request: ${method} ${endpoint} took ${duration}ms`
      );
    }

    // Log in development
    if (this.isDevelopment && duration > 1000) {
      console.log(
        `📊 API: ${method} ${endpoint} - ${duration}ms (${status})`
      );
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get avg response time for an endpoint
   */
  getAverageTime(endpoint: string, method?: string): number {
    const filtered = this.metrics.filter(m =>
      m.endpoint === endpoint && (!method || m.method === method)
    );

    if (filtered.length === 0) return 0;

    const total = filtered.reduce((sum, m) => sum + m.duration, 0);
    return Math.round(total / filtered.length);
  }

  /**
   * Get slowest requests
   */
  getSlowestRequests(limit = 10): PerformanceMetric[] {
    return [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get failed requests
   */
  getFailedRequests(): PerformanceMetric[] {
    return this.metrics.filter(m => !m.success);
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    const total = this.metrics.length;
    const successful = this.metrics.filter(m => m.success).length;
    const failed = total - successful;
    const avgDuration =
      total > 0 ? Math.round(this.metrics.reduce((sum, m) => sum + m.duration, 0) / total) : 0;
    const slowRequests = this.metrics.filter(m => m.duration > this.slowRequestThreshold).length;

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? ((successful / total) * 100).toFixed(2) + '%' : 'N/A',
      avgDuration: `${avgDuration}ms`,
      slowRequests,
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      summary: this.getSummary(),
    }, null, 2);
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
