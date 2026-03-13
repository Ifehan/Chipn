/**
 * Request Deduplication Service
 * Prevents duplicate in-flight requests for the same endpoint
 * Useful for avoiding redundant API calls when rapid requests are made
 */

export class RequestDeduplicator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pendingRequests: Map<string, Promise<any>> = new Map()

  /**
   * Execute a request with automatic deduplication
   * If the same request is already in-flight, returns the existing promise
   * @param key - Unique identifier for this request (e.g., endpoint + method + body hash)
   * @param request - Async function to execute
   * @returns Promise that resolves with the request result
   */
  async execute<T>(key: string, request: () => Promise<T>): Promise<T> {
    // If request is already in-flight, return existing promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>
    }

    // Execute the request and store the promise
    const promise = request()
      .then(result => {
        // Remove from pending when done
        this.pendingRequests.delete(key)
        return result
      })
      .catch(error => {
        // Remove from pending even on error
        this.pendingRequests.delete(key)
        throw error
      })

    this.pendingRequests.set(key, promise)
    return promise
  }

  /**
   * Generate a cache key from request parameters
   * @param method - HTTP method
   * @param endpoint - API endpoint
   * @param data - Request body (optional)
   * @returns Unique cache key
   */
  generateKey(method: string, endpoint: string, data?: unknown): string {
    const dataHash = data ? JSON.stringify(data) : ''
    return `${method}:${endpoint}:${dataHash}`
  }

  /**
   * Clear all pending requests
   * Useful for cleanup or when need to force new requests
   */
  clearPending(): void {
    this.pendingRequests.clear()
  }

  /**
   * Check if a request is currently pending
   */
  isPending(key: string): boolean {
    return this.pendingRequests.has(key)
  }

  /**
   * Get count of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size
  }
}

// Export singleton instance
export const requestDeduplicator = new RequestDeduplicator()
