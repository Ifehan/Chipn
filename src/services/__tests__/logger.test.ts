import { logger } from '../logger';
import type { LogLevel } from '../logger';

const originalConsoleDebug = console.debug;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  logger.clear();
  console.debug = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.debug = originalConsoleDebug;
  console.info = originalConsoleInfo;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

describe('Logger Service', () => {
  describe('debug', () => {
    it('adds a debug entry to logs', () => {
      logger.debug('debug message');
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('debug');
      expect(logs[0].message).toBe('debug message');
    });

    it('calls console.debug in development mode', () => {
      logger.debug('debug message');
      expect(console.debug).toHaveBeenCalled();
    });

    it('calls console.debug with context prefix when context is provided', () => {
      logger.debug('debug message', undefined, 'MyContext');
      expect(console.debug).toHaveBeenCalledWith('[MyContext] debug message', undefined);
    });

    it('calls console.debug without context prefix when no context provided', () => {
      logger.debug('debug message', { key: 'value' });
      expect(console.debug).toHaveBeenCalledWith('debug message', { key: 'value' });
    });

    it('stores data and context in the log entry', () => {
      logger.debug('debug message', { key: 'value' }, 'TestContext');
      const logs = logger.getLogs();
      expect(logs[0].data).toEqual({ key: 'value' });
      expect(logs[0].context).toBe('TestContext');
    });

    it('stores a timestamp in ISO format', () => {
      logger.debug('debug message');
      const logs = logger.getLogs();
      expect(logs[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('info', () => {
    it('adds an info entry to logs', () => {
      logger.info('info message');
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('info');
      expect(logs[0].message).toBe('info message');
    });

    it('calls console.info in development mode', () => {
      logger.info('info message');
      expect(console.info).toHaveBeenCalled();
    });

    it('calls console.info with context prefix when context is provided', () => {
      logger.info('info message', undefined, 'MyContext');
      expect(console.info).toHaveBeenCalledWith('[MyContext] info message', undefined);
    });

    it('calls console.info without context prefix when no context provided', () => {
      logger.info('info message', { userId: 1 });
      expect(console.info).toHaveBeenCalledWith('info message', { userId: 1 });
    });

    it('stores data and context in the log entry', () => {
      logger.info('info message', { userId: 1 }, 'AuthContext');
      const logs = logger.getLogs();
      expect(logs[0].data).toEqual({ userId: 1 });
      expect(logs[0].context).toBe('AuthContext');
    });
  });

  describe('warn', () => {
    it('adds a warn entry to logs', () => {
      logger.warn('warn message');
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('warn');
      expect(logs[0].message).toBe('warn message');
    });

    it('always calls console.warn regardless of environment', () => {
      logger.warn('warn message');
      expect(console.warn).toHaveBeenCalled();
    });

    it('calls console.warn with context prefix when context is provided', () => {
      logger.warn('warn message', undefined, 'MyContext');
      expect(console.warn).toHaveBeenCalledWith('[MyContext] warn message', undefined);
    });

    it('calls console.warn without context prefix when no context provided', () => {
      logger.warn('warn message', { retries: 3 });
      expect(console.warn).toHaveBeenCalledWith('warn message', { retries: 3 });
    });

    it('stores data and context in the log entry', () => {
      logger.warn('warn message', { retries: 3 }, 'RetryContext');
      const logs = logger.getLogs();
      expect(logs[0].data).toEqual({ retries: 3 });
      expect(logs[0].context).toBe('RetryContext');
    });
  });

  describe('error', () => {
    it('adds an error entry to logs', () => {
      logger.error('error message');
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('error');
      expect(logs[0].message).toBe('error message');
    });

    it('always calls console.error regardless of environment', () => {
      logger.error('error message');
      expect(console.error).toHaveBeenCalled();
    });

    it('calls console.error with context prefix when context is provided', () => {
      const err = new Error('boom');
      logger.error('error message', err, 'MyContext');
      expect(console.error).toHaveBeenCalledWith('[MyContext] error message', err);
    });

    it('calls console.error without context prefix when no context provided', () => {
      const err = new Error('boom');
      logger.error('error message', err);
      expect(console.error).toHaveBeenCalledWith('error message', err);
    });

    it('extracts message from Error instance into data field', () => {
      logger.error('something failed', new Error('original error'));
      const logs = logger.getLogs();
      expect(logs[0].data).toBe('original error');
    });

    it('stores stack trace from Error instance', () => {
      const err = new Error('with stack');
      logger.error('something failed', err);
      const logs = logger.getLogs();
      expect(logs[0].stack).toBe(err.stack);
    });

    it('stores non-Error data directly in data field', () => {
      logger.error('something failed', { code: 500 });
      const logs = logger.getLogs();
      expect(logs[0].data).toEqual({ code: 500 });
    });

    it('stores undefined stack when error is not an Error instance', () => {
      logger.error('something failed', 'string error');
      const logs = logger.getLogs();
      expect(logs[0].stack).toBeUndefined();
    });
  });

  describe('getLogs', () => {
    it('returns all accumulated logs across levels', () => {
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      expect(logger.getLogs()).toHaveLength(4);
    });

    it('returns a copy and not the internal array reference', () => {
      logger.info('info message');
      const logs = logger.getLogs();
      logs.push({ timestamp: '', level: 'debug', message: 'injected' });
      expect(logger.getLogs()).toHaveLength(1);
    });
  });

  describe('getLogsByLevel', () => {
    beforeEach(() => {
      logger.debug('debug one');
      logger.info('info one');
      logger.info('info two');
      logger.warn('warn one');
      logger.error('error one');
    });

    it.each<[LogLevel, number]>([
      ['debug', 1],
      ['info', 2],
      ['warn', 1],
      ['error', 1],
    ])('returns correct logs for level "%s"', (level, expectedCount) => {
      expect(logger.getLogsByLevel(level)).toHaveLength(expectedCount);
    });

    it('returns only entries matching the requested level', () => {
      const infoLogs = logger.getLogsByLevel('info');
      infoLogs.forEach(log => expect(log.level).toBe('info'));
    });

    it('returns empty array when no logs match the level', () => {
      logger.clear();
      expect(logger.getLogsByLevel('error')).toEqual([]);
    });
  });

  describe('clear', () => {
    it('removes all logs', () => {
      logger.info('one');
      logger.warn('two');
      logger.clear();
      expect(logger.getLogs()).toHaveLength(0);
    });

    it('allows logging again after clearing', () => {
      logger.info('before clear');
      logger.clear();
      logger.info('after clear');
      expect(logger.getLogs()).toHaveLength(1);
      expect(logger.getLogs()[0].message).toBe('after clear');
    });
  });

  describe('exportLogs', () => {
    it('returns a valid JSON string', () => {
      logger.info('export test');
      const exported = logger.exportLogs();
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it('includes all current log entries in the export', () => {
      logger.info('first');
      logger.error('second');
      const exported = JSON.parse(logger.exportLogs());
      expect(exported).toHaveLength(2);
    });

    it('returns an empty array JSON string when no logs exist', () => {
      const exported = JSON.parse(logger.exportLogs());
      expect(exported).toEqual([]);
    });

    it('includes expected fields in each exported entry', () => {
      logger.info('check fields', { key: 'val' }, 'ExportContext');
      const exported = JSON.parse(logger.exportLogs());
      expect(exported[0]).toMatchObject({
        level: 'info',
        message: 'check fields',
        context: 'ExportContext',
        data: { key: 'val' },
      });
    });
  });

  describe('maxLogs cap', () => {
    it('retains only the most recent 500 logs when limit is exceeded', () => {
      for (let i = 0; i < 510; i++) {
        logger.info(`message ${i}`);
      }
      const logs = logger.getLogs();
      expect(logs).toHaveLength(500);
      expect(logs[0].message).toBe('message 10');
      expect(logs[499].message).toBe('message 509');
    });
  });
});
