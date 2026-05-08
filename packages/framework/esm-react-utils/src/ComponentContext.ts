import { createContext } from 'react';
import { type ComponentConfig } from '@egen/esm-extensions';

/**
 * Available to all components. Provided by `eigenComponentDecorator`.
 */
export const ComponentContext = createContext<ComponentConfig>({
  moduleName: '',
  featureName: '',
});
