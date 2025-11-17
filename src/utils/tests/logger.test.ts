import { logger, LogLevel } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    logger.clearLogs();
    logger.setLogLevel(LogLevel.DEBUG);
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('log levels', () => {
    it('should respect log level settings', () => {
      logger.setLogLevel(LogLevel.WARN);

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('logging methods', () => {
    it('should log debug messages', () => {
      logger.debug('test debug', { key: 'value' });
      const logs = logger.getLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({
        level: LogLevel.DEBUG,
        message: 'test debug',
        context: { key: 'value' },
      });
      expect(console.debug).toHaveBeenCalledWith(
        '[DEBUG] test debug',
        '
Context:',
        { key: 'value' }
      );
    });

    it('should log info messages', () => {
      logger.info('test info');
      const logs = logger.getLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LogLevel.INFO);
      expect(console.info).toHaveBeenCalledWith('[INFO] test info', '', '');
    });

    it('should log warning messages', () => {
      logger.warn('test warning');
      const logs = logger.getLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LogLevel.WARN);
      expect(console.warn).toHaveBeenCalledWith('[WARN] test warning', '', '');
    });

    it('should log error messages', () => {
      logger.error('test error');
      const logs = logger.getLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(console.error).toHaveBeenCalledWith('[ERROR] test error', '', '');
    });
  });

  describe('log management', () => {
    it('should limit stored logs', () => {
      const messages = Array.from({ length: 1005 }, (_, i) => `Log ${i}`);
      messages.forEach(msg => logger.info(msg));

      const logs = logger.getLogs();
      expect(logs).toHaveLength(1000);
      expect(logs[0].message).toBe('Log 5');
    });

    it('should clear all logs', () => {
      logger.info('test 1');
      logger.info('test 2');
      expect(logger.getLogs()).toHaveLength(2);

      logger.clearLogs();
      expect(logger.getLogs()).toHaveLength(0);
    });
  });
});
