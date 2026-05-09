import type { MicroserviceManifest, MicroNavItem, MicroNavGroup } from '../types';
interface RegistryState {
    manifests: MicroserviceManifest[];
    navItems: MicroNavItem[];
    navGroups: MicroNavGroup[];
    activeModule: string | null;
    setManifests: (m: MicroserviceManifest[]) => void;
    setNavigation: (items: MicroNavItem[], groups: MicroNavGroup[]) => void;
    setActiveModule: (id: string | null) => void;
}
export declare const useRegistryStore: import("zustand").UseBoundStore<import("zustand").StoreApi<RegistryState>>;
export {};
//# sourceMappingURL=registry.store.d.ts.map