import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls when called multiple times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn('arg1', 'arg2');
    jest.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should maintain correct context', () => {
    const obj = {
      value: 42,
      method: jest.fn(function(this: any) {
        return this.value;
      }),
    };
    const debouncedMethod = debounce(obj.method, 1000);

    debouncedMethod.call(obj);
    jest.advanceTimersByTime(1000);

    expect(obj.method).toHaveBeenCalled();
  });

  it('should handle zero delay', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    jest.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
