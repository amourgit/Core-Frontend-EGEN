/** @module @category Navigation */

function trimTrailingSlash(str: string) {
  return str.replace(/\/$/, '');
}

/**
 * Interpolates a string with eigenBase and eigenSpaBase.
 *
 * Useful for accepting `${eigenBase}` or `${eigenSpaBase}`plus additional template
 * parameters in configurable URLs.
 *
 * Example usage:
 * ```js
 * interpolateUrl("test ${eigenBase} ${eigenSpaBase} ok");
 *    // will return "test /eigen /eigen/spa ok"
 *
 * interpolateUrl("${eigenSpaBase}/patient/${patientUuid}", {
 *    patientUuid: "4fcb7185-c6c9-450f-8828-ccae9436bd82",
 * }); // will return "/eigen/spa/patient/4fcb7185-c6c9-450f-8828-ccae9436bd82"
 * ```
 *
 * This can be used in conjunction with the `navigate` function like so
 * ```js
 * navigate({
 *  to: interpolateUrl(
 *    "${eigenSpaBase}/patient/${patientUuid}",
 *    { patientUuid: patient.uuid }
 *  )
 * }); // will navigate to "/eigen/spa/patient/4fcb7185-c6c9-450f-8828-ccae9436bd82"
 * ```
 *
 * @param template A string to interpolate
 * @param additionalParams Additional values to interpolate into the string template
 * @returns The interpolated string with all template parameters replaced.
 */
export function interpolateUrl(template: string, additionalParams?: { [key: string]: string }): string {
  const eigenSpaBase = trimTrailingSlash(window.getEigenSpaBase());
  return interpolateString(template, {
    eigenBase: window.eigenBase,
    eigenSpaBase: eigenSpaBase,
    ...additionalParams,
  }).replace(/^\/\//, '/'); // remove extra initial slash if present
}

/**
 * Interpolates values of `params` into the `template` string.
 *
 * Example usage:
 * ```js
 * interpolateString("test ${one} ${two} 3", {
 *    one: "1",
 *    two: "2",
 * }); // will return "test 1 2 3"
 * interpolateString("test ok", { one: "1", two: "2" }) // will return "test ok"
 * ```
 *
 * @param template With optional params wrapped in `${ }`
 * @param params Values to interpolate into the string template
 * @returns The template string with all parameter placeholders replaced by their values.
 */
export function interpolateString(template: string, params: { [key: string]: string }): string {
  const names = Object.keys(params);
  return names.reduce((prev, curr) => prev.split('${' + curr + '}').join(params[curr]), template);
}
