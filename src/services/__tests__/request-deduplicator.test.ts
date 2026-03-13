import { RequestDeduplicator, requestDeduplicator } from '../request-deduplicator';

// Use a fresh instance per test to avoid singleton state leakage
let deduplicator: RequestDeduplicator;

beforeEach(() => {
  deduplicator = new RequestDeduplicator();
});

// Helper to create a controllable promise
const createControllableRequest = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('RequestDeduplicator', () => {
  describe('execute', () => {
    it('executes the request and returns the result', async () => {
      const result = await deduplicator.execute('key-1', () => Promise.resolve('data'));
      expect(result).toBe('data');
    });

    it('returns the same in-flight promise for duplicate keys', async () => {
      const { promise, resolve } = createControllableRequest<string>();
      const request = vi.fn(() => promise);

      const p1 = deduplicator.execute('key-1', request);
      const p2 = deduplicator.execute('key-1', request);

      resolve('done');

      const [r1, r2] = await Promise.all([p1, p2]);
      expect(r1).toBe('done');
      expect(r2).toBe('done');
      // request function should only be called once
      expect(request).toHaveBeenCalledTimes(1);
    });

    it('executes separate requests for different keys', async () => {
      const requestA = vi.fn(() => Promise.resolve('result-a'));
      const requestB = vi.fn(() => Promise.resolve('result-b'));

      const [a, b] = await Promise.all([
        deduplicator.execute('key-a', requestA),
        deduplicator.execute('key-b', requestB),
      ]);

      expect(a).toBe('result-a');
      expect(b).toBe('result-b');
      expect(requestA).toHaveBeenCalledTimes(1);
      expect(requestB).toHaveBeenCalledTimes(1);
    });

    it('removes the key from pending after successful resolution', async () => {
      await deduplicator.execute('key-1', () => Promise.resolve('done'));
      expect(deduplicator.isPending('key-1')).toBe(false);
    });

    it('removes the key from pending after rejection', async () => {
      await expect(
        deduplicator.execute('key-1', () => Promise.reject(new Error('failed')))
      ).rejects.toThrow('failed');
      expect(deduplicator.isPending('key-1')).toBe(false);
    });

    it('propagates the rejection error to the caller', async () => {
      const error = new Error('network error');
      await expect(
        deduplicator.execute('key-1', () => Promise.reject(error))
      ).rejects.toThrow('network error');
    });

    it('propagates rejection to all callers sharing the same in-flight request', async () => {
      const { promise, reject } = createControllableRequest<string>();
      const request = vi.fn(() => promise);

      const p1 = deduplicator.execute('key-1', request);
      const p2 = deduplicator.execute('key-1', request);

      reject(new Error('shared failure'));

      await expect(p1).rejects.toThrow('shared failure');
      await expect(p2).rejects.toThrow('shared failure');
      expect(request).toHaveBeenCalledTimes(1);
    });

    it('allows a new request for the same key after the previous one resolves', async () => {
      const firstRequest = vi.fn(() => Promise.resolve('first'));
      const secondRequest = vi.fn(() => Promise.resolve('second'));

      const first = await deduplicator.execute('key-1', firstRequest);
      const second = await deduplicator.execute('key-1', secondRequest);

      expect(first).toBe('first');
      expect(second).toBe('second');
      expect(firstRequest).toHaveBeenCalledTimes(1);
      expect(secondRequest).toHaveBeenCalledTimes(1);
    });

    it('allows a new request for the same key after the previous one rejects', async () => {
      const failingRequest = vi.fn(() => Promise.reject(new Error('fail')));
      const successRequest = vi.fn(() => Promise.resolve('recovered'));

      await expect(deduplicator.execute('key-1', failingRequest)).rejects.toThrow('fail');
      const result = await deduplicator.execute('key-1', successRequest);

      expect(result).toBe('recovered');
      expect(successRequest).toHaveBeenCalledTimes(1);
    });

    it('marks the key as pending while the request is in-flight', () => {
      const { promise, resolve } = createControllableRequest<string>();

      deduplicator.execute('key-1', () => promise);
      expect(deduplicator.isPending('key-1')).toBe(true);

      resolve('done');
    });
  });

  describe('generateKey', () => {
    it('generates a key with method and endpoint', () => {
      expect(deduplicator.generateKey('GET', '/api/users')).toBe('GET:/api/users:');
    });

    it('includes serialized data in the key when provided', () => {
      const key = deduplicator.generateKey('POST', '/api/users', { name: 'John' });
      expect(key).toBe('POST:/api/users:{"name":"John"}');
    });

    it('generates the same key for identical inputs', () => {
      const key1 = deduplicator.generateKey('GET', '/api/items', { page: 1 });
      const key2 = deduplicator.generateKey('GET', '/api/items', { page: 1 });
      expect(key1).toBe(key2);
    });

    it('generates different keys for different methods', () => {
      const get = deduplicator.generateKey('GET', '/api/users');
      const post = deduplicator.generateKey('POST', '/api/users');
      expect(get).not.toBe(post);
    });

    it('generates different keys for different endpoints', () => {
      const users = deduplicator.generateKey('GET', '/api/users');
      const orders = deduplicator.generateKey('GET', '/api/orders');
      expect(users).not.toBe(orders);
    });

    it('generates different keys for different data payloads', () => {
      const key1 = deduplicator.generateKey('POST', '/api/users', { id: 1 });
      const key2 = deduplicator.generateKey('POST', '/api/users', { id: 2 });
      expect(key1).not.toBe(key2);
    });

    it('omits data hash when data is not provided', () => {
      const key = deduplicator.generateKey('DELETE', '/api/users/1');
      expect(key).toBe('DELETE:/api/users/1:');
    });
  });

  describe('isPending', () => {
    it('returns false when no requests are in-flight', () => {
      expect(deduplicator.isPending('key-1')).toBe(false);
    });

    it('returns true when a request with that key is in-flight', () => {
      const { promise, resolve } = createControllableRequest<string>();
      deduplicator.execute('key-1', () => promise);
      expect(deduplicator.isPending('key-1')).toBe(true);
      resolve('done');
    });

    it('returns false for a different key while another is pending', () => {
      const { promise, resolve } = createControllableRequest<string>();
      deduplicator.execute('key-1', () => promise);
      expect(deduplicator.isPending('key-2')).toBe(false);
      resolve('done');
    });

    it('returns false after the pending request resolves', async () => {
      await deduplicator.execute('key-1', () => Promise.resolve('done'));
      expect(deduplicator.isPending('key-1')).toBe(false);
    });
  });

  describe('getPendingCount', () => {
    it('returns 0 when no requests are pending', () => {
      expect(deduplicator.getPendingCount()).toBe(0);
    });

    it('increments count as requests are added', () => {
      const { promise: p1, resolve: r1 } = createControllableRequest<string>();
      const { promise: p2, resolve: r2 } = createControllableRequest<string>();

      deduplicator.execute('key-1', () => p1);
      expect(deduplicator.getPendingCount()).toBe(1);

      deduplicator.execute('key-2', () => p2);
      expect(deduplicator.getPendingCount()).toBe(2);

      r1('done');
      r2('done');
    });

    it('decrements count after a request resolves', async () => {
      const { promise, resolve } = createControllableRequest<string>();
      const execution = deduplicator.execute('key-1', () => promise);

      expect(deduplicator.getPendingCount()).toBe(1);
      resolve('done');
      await execution;
      expect(deduplicator.getPendingCount()).toBe(0);
    });

    it('does not increment count for duplicate in-flight keys', () => {
      const { promise, resolve } = createControllableRequest<string>();
      const request = vi.fn(() => promise);

      deduplicator.execute('key-1', request);
      deduplicator.execute('key-1', request);

      expect(deduplicator.getPendingCount()).toBe(1);
      resolve('done');
    });
  });

  describe('clearPending', () => {
    it('removes all pending requests', () => {
      const { promise: p1 } = createControllableRequest<string>();
      const { promise: p2 } = createControllableRequest<string>();

      deduplicator.execute('key-1', () => p1);
      deduplicator.execute('key-2', () => p2);

      deduplicator.clearPending();
      expect(deduplicator.getPendingCount()).toBe(0);
    });

    it('returns false for isPending after clearing', () => {
      const { promise } = createControllableRequest<string>();
      deduplicator.execute('key-1', () => promise);
      deduplicator.clearPending();
      expect(deduplicator.isPending('key-1')).toBe(false);
    });

    it('allows new requests for cleared keys after clearing', async () => {
      const { promise } = createControllableRequest<string>();
      deduplicator.execute('key-1', () => promise);
      deduplicator.clearPending();

      const result = await deduplicator.execute('key-1', () => Promise.resolve('fresh'));
      expect(result).toBe('fresh');
    });
  });

  describe('singleton export', () => {
    it('exports a shared requestDeduplicator instance', () => {
      expect(requestDeduplicator).toBeInstanceOf(RequestDeduplicator);
    });

    it('is the same instance across imports', async () => {
      const { requestDeduplicator: second } = await import('../request-deduplicator');
      expect(requestDeduplicator).toBe(second);
    });
  });
});
