import { type LifeCycles } from 'single-spa';
/**
 * This function loads a single-spa Lifecycles from the given app. The Lifecycles should be
 * created using `getAsyncLifecycle()` or `getSyncLifecycle()` and exported in the app's
 * index.ts file.
 * The function is lazy and ensures that the appropriate module is loaded,
 * that the module's `startupApp()` is called before the component is loaded. It
 * then calls the component function, which should return either a single-spa
 * {@link LifeCycles} object or a {@link Promise} that will resolve to such an object.
 *
 * @param routesAppName The app name of the routes.json file defining the component to load
 *
 * @param fullComponentName The name of the component to load. Note that this can optionally
 * include the appName to load the component from (in the format `${appName}#${componentName}`),
 * or omitted to implicitly use routesAppName
 *
 */
export declare function loadLifeCycles(routesAppName: string, fullComponentName: string): Promise<LifeCycles>;
//# sourceMappingURL=load-lifecycles.d.ts.map