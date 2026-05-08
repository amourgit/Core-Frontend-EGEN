/** @module @category Navigation */
import { navigateToUrl } from 'single-spa';
import { interpolateUrl } from './interpolate-string';
import type {} from '@egen/esm-globals';

function trimTrailingSlash(str: string) {
  return str.replace(/\/$/, '');
}

export type TemplateParams = { [key: string]: string };

export interface NavigateOptions {
  to: string;
  templateParams?: TemplateParams;
}

/**
 * Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths
 *
 * #### Example usage:
 * ```js
 * @example
 * const config = useConfig();
 * const submitHandler = () => {
 *   navigate({ to: config.links.submitSuccess });
 * };
 * ```
 *
 * #### Example behavior::
 * ```js
 * @example
 * navigate({ to: "/some/path" }); // => window.location.assign("/some/path")
 * navigate({ to: "https://single-spa.js.org/" }); // => window.location.assign("https://single-spa.js.org/")
 * navigate({ to: "${eigenBase}/some/path" }); // => window.location.assign("/eigen/some/path")
 * navigate({ to: "/eigen/spa/foo/page" }); // => navigateToUrl("/eigen/spa/foo/page")
 * navigate({ to: "${eigenSpaBase}/bar/page" }); // => navigateToUrl("/eigen/spa/bar/page")
 * navigate({ to: "/${eigenSpaBase}/baz/page" }) // => navigateToUrl("/eigen/spa/baz/page")
 * navigate({ to: "https://iam-central.ga/${eigenSpaBase}/qux/page" }); // => navigateToUrl("/eigen/spa/qux/page")
 *   if `window.location.origin` == "https://iam-central.ga", else will use window.location.assign
 * ```
 *
 * @param to The target path or URL. Supports templating with 'eigenBase', 'eigenSpaBase',
 * and any additional template parameters defined in `templateParams`.
 * For example, `${eigenSpaBase}/home` will resolve to `/eigen/spa/home`
 * for implementations using the standard EIGEN and SPA base paths.
 * If `templateParams` contains `{ foo: "bar" }`, then the URL `${eigenBase}/${foo}`
 * will become `/eigen/bar`.
 */
export function navigate({ to, templateParams }: NavigateOptions): void {
  const eigenSpaBase = trimTrailingSlash(window.getEigenSpaBase());
  const target = interpolateUrl(to, templateParams).replace(window.location.origin, '');
  const isSpaPath = target.startsWith(eigenSpaBase);

  if (isSpaPath) {
    navigateToUrl(target);
  } else {
    window.location.assign(target);
  }
}
