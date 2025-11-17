import { throttle } from '../throttle';

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should execute function immediately on first call', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not execute function again within delay period', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn();
    jest.advanceTimersByTime(500);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should execute function after delay period', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn();
    jest.advanceTimersByTime(1000);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments correctly', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn('arg1', 'arg2');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should maintain correct context', () => {
    const obj = {
      value: 42,
      method: jest.fn(function(this: any) {
        return this.value;
      }),
    };
    const throttledMethod = throttle(obj.method, 1000);

    throttledMethod.call(obj);
    expect(obj.method).toHaveBeenCalled();
  });

  it('should handle zero delay', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 0);

    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
