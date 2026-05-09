import { create } from 'zustand';
export const useRegistryStore = create((set) => ({
    manifests: [],
    navItems: [],
    navGroups: [],
    activeModule: null,
    setManifests: (manifests) => set({ manifests }),
    setNavigation: (navItems, navGroups) => set({ navItems, navGroups }),
    setActiveModule: (activeModule) => set({ activeModule }),
}));
//# sourceMappingURL=registry.store.js.map