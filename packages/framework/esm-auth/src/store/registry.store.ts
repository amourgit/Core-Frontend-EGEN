import { create } from 'zustand';
import type { MicroserviceManifest, MicroNavItem, MicroNavGroup } from '../types';

interface RegistryState {
  manifests:   MicroserviceManifest[];
  navItems:    MicroNavItem[];
  navGroups:   MicroNavGroup[];
  activeModule: string | null;

  setManifests:    (m: MicroserviceManifest[]) => void;
  setNavigation:   (items: MicroNavItem[], groups: MicroNavGroup[]) => void;
  setActiveModule: (id: string | null) => void;
}

export const useRegistryStore = create<RegistryState>((set) => ({
  manifests:    [],
  navItems:     [],
  navGroups:    [],
  activeModule: null,

  setManifests:    (manifests) => set({ manifests }),
  setNavigation:   (navItems, navGroups) => set({ navItems, navGroups }),
  setActiveModule: (activeModule) => set({ activeModule }),
}));
