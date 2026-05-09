import { type ExtensionDefinition, type FeatureFlagDefinition, type ModalDefinition, type WorkspaceDefinition, type WorkspaceDefinition2, type WorkspaceGroupDefinition, type WorkspaceGroupDefinition2, type WorkspaceWindowDefinition2 } from '@egen/esm-globals';
/**
 * This function registers an extension definition with the framework and will
 * attach the extension to any configured slots.
 *
 * @param appName The name of the app containing this extension
 * @param extension An object that describes the extension, derived from `routes.json`
 */
export declare function tryRegisterExtension(appName: string, extension: ExtensionDefinition): void;
/**
 * This function registers a modal definition with the framework so that it can be launched.
 *
 * @param appName The name of the app defining this modal
 * @param modal An object that describes the modal, derived from `routes.json`
 */
export declare function tryRegisterModal(appName: string, modal: ModalDefinition): void;
/**
 * This function registers a workspace definition with the framework so that it can be launched.
 *
 * @param appName The name of the app defining this workspace
 * @param workspace An object that describes the workspace, derived from `routes.json`
 */
export declare function tryRegisterWorkspace(appName: string, workspace: WorkspaceDefinition): void;
/**
 * This function registers a workspace group definition with the framework so that it can be launched.
 *
 * @param appName The name of the app defining this workspace
 * @param workspace An object that describes the workspace, derived from `routes.json`
 */
export declare function tryRegisterWorkspaceGroup(appName: string, workspaceGroup: WorkspaceGroupDefinition): void;
export declare function tryRegisterWorkspaceGroups2(appName: string, workspaceGroupDefs: Array<WorkspaceGroupDefinition2>): void;
export declare function tryRegisterWorkspace2(appName: string, workspaceDefs: Array<WorkspaceDefinition2>): void;
export declare function tryRegisterWorkspaceWindows2(appName: string, workspaceWindowDefs: Array<WorkspaceWindowDefinition2>): void;
/**
 * This function registers a feature flag definition with the framework.
 *
 * @param appName The name of the app defining this feature flag
 * @param featureFlag An object that describes the feature flag, derived from `routes.json`
 */
export declare function tryRegisterFeatureFlag(appName: string, featureFlag: FeatureFlagDefinition): void;
//# sourceMappingURL=components.d.ts.map