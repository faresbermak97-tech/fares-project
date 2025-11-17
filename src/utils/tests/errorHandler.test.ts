import { errorHandler, ErrorContext } from '../errorHandler';

describe('ErrorHandler', () => {
  beforeEach(() => {
    errorHandler.clearErrors();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('handleError', () => {
    it('should store error with context', () => {
      const error = new Error('Test error');
      const context: ErrorContext = {
        component: 'TestComponent',
        action: 'TestAction',
      };

      errorHandler.handleError(error, context);
      const errors = errorHandler.getErrors();

      expect(errors).toHaveLength(1);
      expect(errors[0].error).toBe(error);
      expect(errors[0].context).toEqual(context);
    });

    it('should log error to console', () => {
      const error = new Error('Test error');
      errorHandler.handleError(error);

      expect(console.error).toHaveBeenCalledWith('Error caught:', expect.objectContaining({
        message: error.message,
        stack: error.stack,
      }));
    });

    it('should limit stored errors', () => {
      const errors = Array.from({ length: 105 }, (_, i) => new Error(`Error ${i}`));
      errors.forEach(error => errorHandler.handleError(error));

      const storedErrors = errorHandler.getErrors();
      expect(storedErrors).toHaveLength(100);
      expect(storedErrors[0].error.message).toBe('Error 5');
    });
  });

  describe('wrapFunction', () => {
    it('should return function result when no error', () => {
      const fn = jest.fn().mockReturnValue('success');
      const wrapped = errorHandler.wrapFunction(fn, { component: 'Test' });

      const result = wrapped();
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalled();
    });

    it('should handle function errors', () => {
      const error = new Error('Test error');
      const fn = jest.fn().mockImplementation(() => {
        throw error;
      });
      const wrapped = errorHandler.wrapFunction(fn, { component: 'Test' });

      const result = wrapped();
      expect(result).toBeUndefined();
      expect(errorHandler.getErrors()).toHaveLength(1);
    });
  });

  describe('clearErrors', () => {
    it('should remove all stored errors', () => {
      errorHandler.handleError(new Error('Test 1'));
      errorHandler.handleError(new Error('Test 2'));
      expect(errorHandler.getErrors()).toHaveLength(2);

      errorHandler.clearErrors();
      expect(errorHandler.getErrors()).toHaveLength(0);
    });
  });
});
