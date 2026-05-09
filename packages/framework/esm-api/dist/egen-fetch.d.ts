/** @module @category API */
import { Observable } from 'rxjs';
import type { FetchResponse } from './types';
/** The base URL for the EGEN REST API (e.g., '/ws/rest/v1'). */
export declare const restBaseUrl = "/ws/rest/v1";
/** The base URL for the EGEN FHIR R4 API (e.g., '/ws/fhir2/R4'). */
export declare const fhirBaseUrl = "/ws/fhir2/R4";
/** The endpoint for session management operations. */
export declare const sessionEndpoint = "/ws/rest/v1/session";
/**
 * Append `path` to the EGEN SPA base.
 *
 * @param path The path to append to the EGEN base URL.
 * @returns The full URL with the EGEN base prepended. If the path is already
 *   an absolute URL (starting with 'http'), it is returned unchanged.
 *
 * @example
 *
 * ```ts
 * makeUrl('/foo/bar');
 * // => '/egen/foo/bar'
 * ```
 */
export declare function makeUrl(path: string): string;
/**
 * The egenFetch function is a wrapper around the
 * [browser's built-in fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch),
 * with extra handling for EGEN-specific API behaviors, such as
 * request headers, authentication, authorization, and the API urls.
 *
 * @param path A string url to make the request to. Note that the
 *   egen base url (by default `/egen`) will be automatically
 *   prepended to the URL, so there is no need to include it.
 * @param fetchInit A [fetch init object](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax).
 *   Note that the `body` property does not need to be `JSON.stringify()`ed
 *   because egenFetch will do that for you.
 * @returns A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
 *   that resolves with a [Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response).
 *   Note that the egen version of the Response object has already
 *   downloaded the HTTP response body as json, and has an additional
 *   `data` property with the HTTP response json as a javascript object.
 *
 * @example
 * ```js
 * import { egenFetch } from '@egen/esm-api'
 * const abortController = new AbortController();
 * egenFetch(`${restBaseUrl}/session', {signal: abortController.signal})
 *   .then(response => {
 *     console.log(response.data.authenticated)
 *   })
 *   .catch(err => {
 *     console.error(err.status);
 *   })
 * abortController.abort();
 * egenFetch(`${restBaseUrl}/session', {
 *   method: 'POST',
 *   body: {
 *     username: 'hi',
 *     password: 'there',
 *   }
 * })
 * ```
 *
 * #### Cancellation
 *
 * To cancel a network request, use an
 * [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
 * It is best practice to cancel your network requests when the user
 * navigates away from a page while the request is pending request, to
 * free up memory and network resources and to prevent race conditions.
 *
 * @category API
 */
export declare function egenFetch<T = any>(path: string, fetchInit?: FetchConfig): Promise<FetchResponse<T>>;
/**
 * The egenObservableFetch function is a wrapper around egenFetch
 * that returns an [Observable](https://rxjs-dev.firebaseapp.com/guide/observable)
 * instead of a promise. It exists in case using an Observable is
 * preferred or more convenient than a promise.
 *
 * @param url See [[egenFetch]]
 * @param fetchInit See [[egenFetch]]
 * @returns An Observable that produces exactly one Response object.
 * The response object is exactly the same as for [[egenFetch]].
 *
 * @example
 *
 * ```js
 * import { egenObservableFetch } from '@egen/esm-api'
 * const subscription = egenObservableFetch(`${restBaseUrl}/session').subscribe(
 *   response => console.log(response.data),
 *   err => {throw err},
 *   () => console.log('finished')
 * )
 * subscription.unsubscribe()
 * ```
 *
 * #### Cancellation
 *
 * To cancel the network request, simply call `subscription.unsubscribe();`
 *
 * @category API
 */
export declare function egenObservableFetch<T>(url: string, fetchInit?: FetchConfig): Observable<FetchResponse<T>>;
export declare class EgenFetchError extends Error implements FetchError {
    constructor(url: string, response: Response, responseBody: ResponseBody | null, requestStacktrace: Error);
    response: Response;
    responseBody: string | FetchResponseJson | null;
}
export interface FetchConfig extends Omit<RequestInit, 'body' | 'headers'> {
    headers?: FetchHeaders;
    body?: FetchBody | string;
}
type ResponseBody = string | FetchResponseJson;
export interface FetchHeaders {
    [key: string]: string | null;
}
interface FetchBody {
    [key: string]: any;
}
export interface FetchResponseJson {
    [key: string]: any;
}
export interface FetchError {
    response: Response;
    responseBody: ResponseBody | null;
}
export {};
//# sourceMappingURL=egen-fetch.d.ts.map