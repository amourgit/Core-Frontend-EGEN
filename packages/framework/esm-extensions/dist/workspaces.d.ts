import { type ReactNode } from 'react';
import { type LifeCycles } from 'single-spa';
import { type WorkspaceGroupDefinition, type WorkspaceWindowState } from '@egen/esm-globals';
/** See [[WorkspaceDefinition]] for more information about these properties */
export interface WorkspaceRegistration {
    name: string;
    title: string;
    titleNode?: ReactNode;
    type: string;
    canHide: boolean;
    canMaximize: boolean;
    width: 'narrow' | 'wider' | 'extra-wide';
    preferredWindowSize: WorkspaceWindowState;
    load(): Promise<LifeCycles>;
    moduleName: string;
    groups: Array<string>;
}
export type WorkspaceGroupRegistration = WorkspaceGroupDefinition & {
    members: Array<string>;
};
/** See [[WorkspaceDefinition]] for more information about these properties */
export interface RegisterWorkspaceOptions {
    name: string;
    title: string;
    type?: string;
    canHide?: boolean;
    canMaximize?: boolean;
    width?: 'narrow' | 'wider' | 'extra-wide';
    preferredWindowSize?: WorkspaceWindowState;
    component: string;
    moduleName: string;
    groups?: Array<string>;
    load(): Promise<LifeCycles>;
}
/**
 * Tells the workspace system about a workspace. This is used by the app shell
 * to register workspaces defined in the `routes.json` file.
 * @internal
 */
export declare function registerWorkspace(workspace: RegisterWorkspaceOptions): void;
/**
 * Tells the workspace system about a workspace group. This is used by the app shell
 * to register workspace groups defined in the `routes.json` file.
 * @internal
 */
export declare function registerWorkspaceGroup(workspaceGroup: WorkspaceGroupRegistration): void;
/**
 * This exists for compatibility with the old way of registering
 * workspaces (as extensions).
 *
 * @param name of the workspace
 */
export declare function getWorkspaceRegistration(name: string): WorkspaceRegistration;
/**
 * This provides the workspace group registration and is also compatible with the
 * old way of registering workspace groups (as extensions), but isn't recommended.
 *
 * @param name of the workspace
 */
export declare function getWorkspaceGroupRegistration(name: string): WorkspaceGroupRegistration;
//# sourceMappingURL=workspaces.d.ts.map