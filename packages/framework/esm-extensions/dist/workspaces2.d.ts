import { type WorkspaceDefinition2, type WorkspaceGroupDefinition2, type WorkspaceWindowDefinition2 } from '@egen/esm-globals';
export interface OpenedWorkspace {
    workspaceName: string;
    props: Record<string, any> | null;
    hasUnsavedChanges: boolean;
    /** Unique identifier for the workspace instance, used to track unique instances of the same workspace */
    uuid: string;
}
export interface OpenedWindow {
    windowName: string;
    /** Root workspace at index 0, child workspaces follow */
    openedWorkspaces: Array<OpenedWorkspace>;
    props: Record<string, any> | null;
    maximized: boolean;
}
export interface OpenedGroup {
    groupName: string;
    props: Record<string, any> | null;
}
export interface WorkspaceStoreState2 {
    registeredGroupsByName: Record<string, WorkspaceGroupDefinition2 & {
        moduleName: string;
    }>;
    registeredWindowsByName: Record<string, WorkspaceWindowDefinition2 & {
        moduleName: string;
    }>;
    registeredWorkspacesByName: Record<string, WorkspaceDefinition2 & {
        moduleName: string;
    }>;
    openedGroup: OpenedGroup | null;
    /** Most recently opened window at the end of array. Each element has a unique windowName */
    openedWindows: Array<OpenedWindow>;
    /**
     * While there can be multiple openedWindows, only the most recently opened window can be
     * toggled shown or hidden, the rest are implicitly hidden.
     **/
    isMostRecentlyOpenedWindowHidden: boolean;
    workspaceTitleByWorkspaceName: Record<string, string>;
}
export declare const workspace2Store: import("zustand").StoreApi<WorkspaceStoreState2>;
/**
 * Given a workspace name, return the window that the workspace belongs to
 * @param workspaceName
 * @returns
 */
export declare function getWindowByWorkspaceName(workspaceName: string): WorkspaceWindowDefinition2 & {
    moduleName: string;
};
/**
 * Given a window name, return the group that the window belongs to
 * @param windowName
 * @returns
 */
export declare function getGroupByWindowName(windowName: string): WorkspaceGroupDefinition2 & {
    moduleName: string;
};
export declare function getOpenedWindowIndexByWorkspace(workspaceName: string): number;
export declare function registerWorkspaceGroups2(appName: string, workspaceGroupDefs: Array<WorkspaceGroupDefinition2>): void;
export declare function registerWorkspaceWindows2(appName: string, workspaceWindowDefs: Array<WorkspaceWindowDefinition2>): void;
export declare function registerWorkspaces2(moduleName: string, workspaceDefs: Array<WorkspaceDefinition2>): void;
//# sourceMappingURL=workspaces2.d.ts.map