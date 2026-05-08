import {
  cleanupObsoleteFeatureFlags,
  getCurrentUser,
  subscribeEigenEvent,
} from '@egen/esm-framework/src/internal';
import { setupOptionalDependencies } from './optionaldeps';

subscribeEigenEvent('started', () => cleanupObsoleteFeatureFlags());
subscribeEigenEvent('started', () => {
  const subscription = getCurrentUser().subscribe((session) => {
    if (session.authenticated) {
      subscription?.unsubscribe();
      setupOptionalDependencies();
    }
  });
});
