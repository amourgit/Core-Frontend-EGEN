import { type EgenAppRoutes } from '@egen/esm-globals';
/**
 * This is the main entry-point for registering an app with the app shell.
 * Each app has a name and should have a `routes.json` file that defines it's
 * associated routes.
 *
 * @param appName The name of the application, e.g. `@egen/esm-my-app`
 * @param routes A Javascript object that corresponds to the app's  routes.json`
 * definition.
 */
export declare function registerApp(appName: string, routes: EgenAppRoutes): void;
/**
 * This is called by the app shell once all route entries have been processed.
 * This registers the pages with the application, and creates the root div
 * for each page in the DOM element specified by the page's containerDomId.
 */
export declare function finishRegisteringAllApps(): void;
//# sourceMappingURL=pages.d.ts.map