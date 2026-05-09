/**
 * Reports an error to the global error handler. The error will be displayed
 * to the user as a toast notification. This function ensures the error is
 * converted to an Error object if it isn't already one.
 *
 * The error is thrown asynchronously (via setTimeout) to ensure it's caught
 * by the global window.onerror handler.
 *
 * @param err The error to report. Can be an Error object, string, or any other value.
 *
 * @example
 * ```ts
 * import { reportError } from '@egen/esm-framework';
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   reportError(error);
 * }
 * ```
 */
export declare function reportError(err: unknown): void;
/**
 * Creates an error handler function that captures the current stack trace at
 * the time of creation. When the returned handler is invoked with an error,
 * it appends the captured stack trace to provide better debugging information
 * for asynchronous operations.
 *
 * This is particularly useful for handling errors in Promise chains or
 * callback-based APIs where the original call site would otherwise be lost.
 *
 * @returns A function that accepts an error and reports it with an enhanced stack trace.
 *
 * @example
 * ```ts
 * import { createErrorHandler } from '@egen/esm-framework';
 * const handleError = createErrorHandler();
 * someAsyncOperation()
 *   .then(processResult)
 *   .catch(handleError);
 * ```
 */
export declare function createErrorHandler(): (incomingErr: unknown) => void;
//# sourceMappingURL=index.d.ts.map