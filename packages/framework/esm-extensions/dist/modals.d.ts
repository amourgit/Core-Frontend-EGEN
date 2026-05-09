import { type LifeCycles } from 'single-spa';
/** @internal */
export interface ModalRegistration {
    name: string;
    load(): Promise<LifeCycles>;
    moduleName: string;
}
/** @internal */
export declare function registerModal(modalRegistration: ModalRegistration): void;
/** @internal */
export declare function getModalRegistration(modalName: string): ModalRegistration | undefined;
//# sourceMappingURL=modals.d.ts.map