import { useEffect, useState } from 'react';
import type { ResolvedDependenciesModule } from './eigen-backend-dependencies';
import { checkModules } from './eigen-backend-dependencies';

export function useBackendDependencies() {
  const [modulesWithMissingBackendModules, setModulesWithMissingBackendModules] = useState<
    Array<ResolvedDependenciesModule>
  >([]);

  useEffect(() => {
    // loading missing modules
    checkModules().then(setModulesWithMissingBackendModules);
  }, []);

  return modulesWithMissingBackendModules;
}
