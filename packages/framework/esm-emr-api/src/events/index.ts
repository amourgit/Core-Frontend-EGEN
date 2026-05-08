import {
  type EventsWithPayload,
  type EigenEvent,
  type EventsWithoutPayload,
  type EventTypes,
  type PageChanged,
} from './types';
export { type EigenEvent, type EventTypes as EigenEventTypes } from './types';

export function fireEigenEvent<T extends EventsWithoutPayload>(event: T, payload?: never): boolean;
export function fireEigenEvent<T extends EventsWithPayload>(event: T, payload: EventTypes[T]): boolean;
/**
 * Fires an EIGEN custom event
 *
 * @param event The custom event to fire
 * @param payload The payload associated with this type of event
 * @returns true if the event was not cancelled and false, i.e., the result of `dispatchEvent()`
 */
export function fireEigenEvent<T extends EigenEvent>(event: T, payload?: EventTypes[T]): boolean {
  const evt = new CustomEvent(`eigen:${event}`, { detail: payload ?? undefined, cancelable: true, bubbles: true });
  return window.dispatchEvent(evt);
}

/**
 * Subscribes to a custom EIGEN event
 *
 * @param event The name of the event to listen to
 * @param handler The callback to be called when the event fires
 */
export function subscribeEigenEvent(event: 'started', handler: (payload: undefined) => void);
export function subscribeEigenEvent(event: 'before-page-changed', handler: (payload: PageChanged) => void);
export function subscribeEigenEvent<T extends EigenEvent>(
  event: T,
  handler: (payload?: EventTypes[T]) => void,
): () => void {
  const internalHandler = (event: Event) => {
    const detail = 'detail' in event && event.detail !== null ? event.detail : undefined;
    handler(detail as EventTypes[T]);
  };

  window.addEventListener(`eigen:${event}`, internalHandler);
  return () => {
    window.removeEventListener(`eigen:${event}`, internalHandler);
  };
}
