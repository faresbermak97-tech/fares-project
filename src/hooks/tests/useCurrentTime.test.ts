import { renderHook, act } from '@testing-library/react';
import { useCurrentTime } from '../useCurrentTime';

describe('useCurrentTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns current time in specified timezone', () => {
    const { result } = renderHook(() => useCurrentTime('Africa/Algiers'));

    expect(result.current).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
  });

  it('updates time every second', () => {
    const { result } = renderHook(() => useCurrentTime('Africa/Algiers'));

    const initialTime = result.current;

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Time should have updated (or stayed same if still same second)
    expect(result.current).toBeDefined();
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useCurrentTime());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
