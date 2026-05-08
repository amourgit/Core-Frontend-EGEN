import { describe, expect, it, vi } from 'vitest';
import { fireEigenEvent, subscribeEigenEvent } from './index';

describe('Event system', () => {
  describe('fireEigenEvent', () => {
    it('dispatches an event on window by default', () => {
      const handler = vi.fn();
      window.addEventListener('eigen:started', handler);

      fireEigenEvent('started');

      expect(handler).toHaveBeenCalledOnce();
      window.removeEventListener('eigen:started', handler);
    });

    it('dispatches an event with payload', () => {
      const handler = vi.fn();
      window.addEventListener('eigen:before-page-changed', handler);

      const payload = {
        cancelNavigation: vi.fn(),
        newPage: '/home',
        oldUrl: 'http://localhost/old',
        newUrl: 'http://localhost/new',
      };
      fireEigenEvent('before-page-changed', payload);

      expect(handler).toHaveBeenCalledOnce();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual(payload);
      window.removeEventListener('eigen:before-page-changed', handler);
    });

    it('returns true when event is not cancelled', () => {
      const result = fireEigenEvent('started');
      expect(result).toBe(true);
    });

    it('returns false when event is cancelled', () => {
      const handler = (e: Event) => e.preventDefault();
      window.addEventListener('eigen:started', handler);

      const result = fireEigenEvent('started');

      expect(result).toBe(false);
      window.removeEventListener('eigen:started', handler);
    });
  });

  describe('subscribeEigenEvent', () => {
    it('subscribes to an event on window by default', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeEigenEvent('started', handler);

      fireEigenEvent('started');

      expect(handler).toHaveBeenCalledOnce();
      unsubscribe();
    });

    it('receives the event payload', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeEigenEvent('before-page-changed', handler);

      const payload = {
        cancelNavigation: vi.fn(),
        newPage: '/home',
        oldUrl: 'http://localhost/old',
        newUrl: 'http://localhost/new',
      };
      fireEigenEvent('before-page-changed', payload);

      expect(handler).toHaveBeenCalledWith(payload);
      unsubscribe();
    });

    it('receives undefined for events without payload', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeEigenEvent('started', handler);

      fireEigenEvent('started');

      expect(handler).toHaveBeenCalledWith(undefined);
      unsubscribe();
    });

    it('unsubscribes correctly', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeEigenEvent('started', handler);

      fireEigenEvent('started');
      expect(handler).toHaveBeenCalledOnce();

      unsubscribe();

      fireEigenEvent('started');
      expect(handler).toHaveBeenCalledOnce();
    });

    it('allows multiple subscribers to the same event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const unsubscribe1 = subscribeEigenEvent('started', handler1);
      const unsubscribe2 = subscribeEigenEvent('started', handler2);

      fireEigenEvent('started');

      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).toHaveBeenCalledOnce();
      unsubscribe1();
      unsubscribe2();
    });

    it('calling unsubscribe multiple times is safe', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeEigenEvent('started', handler);

      unsubscribe();
      expect(() => unsubscribe()).not.toThrow();
    });

    it('unsubscribing one handler does not affect others', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const unsubscribe1 = subscribeEigenEvent('started', handler1);
      const unsubscribe2 = subscribeEigenEvent('started', handler2);

      unsubscribe1();
      fireEigenEvent('started');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledOnce();
      unsubscribe2();
    });
  });
});
