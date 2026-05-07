import { createContext } from 'react';
import { type ComponentConfig } from '@egen/esm-extensions';

/**
 * Available to all components. Provided by `openmrsComponentDecorator`.
 */
export const ComponentContext = createContext<ComponentConfig>({
  moduleName: '',
  featureName: '',
});
