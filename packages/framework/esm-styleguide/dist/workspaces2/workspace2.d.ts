import { type OpenedWindow, type WorkspaceStoreState2 } from '@egen/esm-extensions';
import { type Workspace2DefinitionProps } from './workspace2.component';
/**
 * Attempts to launch the specified workspace group with the given group props. Note that only one workspace group
 * may be opened at any given time. If a workspace group is already opened, calling `launchWorkspaceGroup2` with
 * either a different group name, or same group name but different incompatible props**, will result in prompting to
 * confirm closing workspaces. If the user confirms, the opened group, along with its windows (and their workspaces), is closed, and
 * the requested group is immediately opened.
 *
 * ** 2 sets of props are compatible if either one is nullish, or if they are shallow equal.
 * @experimental
 * @param groupName
 * @param groupProps
 * @returns a Promise that resolves to true if the specified workspace group with the specified group props
 *  is successfully opened, or that it already is opened.
 */
export declare function launchWorkspaceGroup2<GroupProps extends object>(groupName: string, groupProps: GroupProps | null): Promise<boolean>;
/**
 * Closes the workspace group that is currently opened. Note that only one workspace group
 * may be opened at any given time
 * @experimental
 * @param discardUnsavedChanges If true, then the workspace group is forced closed, with no prompt
 * for confirmation for unsaved changes in any opened workspace. This should be used sparingly
 * for clean-up purpose, ex: when exiting an app.
 * @returns a Promise that resolves to true if there is no opened group to begin with or we successfully closed
 * the opened group; false otherwise.
 */
export declare function closeWorkspaceGroup2(discardUnsavedChanges?: boolean): Promise<boolean>;
/**
 * Attempts to launch the specified workspace with the given workspace props. This also implicitly opens
 * the workspace window to which the workspace belongs (if it's not opened already),
 * and the workspace group to which the window belongs (if it's not opened already).
 *
 * When calling `launchWorkspace2`, we need to also pass in the workspace props. While not required,
 * we can also pass in the window props (shared by other workspaces in the window) and the group props
 * (shared by all windows and their workspaces). Omitting the window props or the group props[^1] means the caller
 * explicitly does not care what the current window props and group props are, and that they may be set
 * by other actions (like calling `launchWorkspace2` on a different workspace with those props passed in)
 * at a later time.
 *
 * If there is already an opened workspace group, and it's not the group the workspace belongs to
 * or has incompatible[^2] group props, then we prompt the user to close the group (and its windows and their workspaces).
 * On user confirm, the existing opened group is closed and the new workspace, along with its window and its group,
 * is opened.
 *
 * If the window is already opened, but with incompatible window props, we prompt the user to close
 * the window (and all its opened workspaces), and reopen the window with (only) the newly requested workspace.
 *
 * If the workspace is already opened, but with incompatible workspace props, we also prompt the user to close
 * the **window** (and all its opened workspaces), and reopen the window with (only) the newly requested workspace.
 * This is true regardless of whether the already opened workspace has any child workspaces.
 *
 * Note that calling this function *never* results in creating a child workspace in the affected window.
 * To do so, we need to call `launchChildWorkspace` instead.
 *
 * [^1] Omitting window or group props is useful for workspaces that don't have ties to the window or group "context" (props).
 * For example, in the patient chart, the visit notes / clinical forms / order basket action menu button all share
 * a "group context" of the current visit. However, the "patient list" action menu button does not need to share that group
 * context, so opening that workspace should not need to cause other workspaces / windows / groups to potentially close.
 * The "patient search" workspace in the queues and ward apps is another example.
 *
 * [^2] 2 sets of props are compatible if either one is nullish, or if they are shallow equal.
 * @experimental
 */
export declare function launchWorkspace2<WorkspaceProps extends object, WindowProps extends object, GroupProp extends object>(workspaceName: string, workspaceProps?: WorkspaceProps | null, windowProps?: WindowProps | null, groupProps?: GroupProp | null): Promise<boolean>;
type PromptReason = {
    reason: 'CLOSE_WORKSPACE_GROUP';
    explicit: boolean;
} | {
    reason: 'CLOSE_WINDOW';
    explicit: boolean;
    windowName: string;
} | {
    reason: 'CLOSE_WORKSPACE';
    explicit: boolean;
    windowName: string;
    workspaceName: string;
} | {
    reason: 'CLOSE_OTHER_WINDOWS';
    explicit: false;
    windowNameToSpare: string;
};
/**
 * A user can perform actions that explicitly result in closing workspaces
 * (such that clicking the 'X' button for the workspace or workspace group), or
 * implicitly (by opening a workspace with different props than the one that is already opened).
 * Calls to closeWorkspace2() or closeWorkspaceGroup2() are considered explicit, while calls
 * to launchWorkspace2() or launchWorkspaceGroup2() are considered implicit.
 *
 * This function prompts the user for confirmation to close workspaces with a modal dialog.
 * When the closing is explicit, it prompts for confirmation for affected workspaces with unsaved changes.
 * When the closing is implicit, it prompts for confirmation for all affected workspaces, regardless of
 * whether they have unsaved changes.
 * @experimental
 * @param promptReason
 * @returns a Promise that resolves to true if the user confirmed closing the workspaces; false otherwise.
 */
export declare function promptForClosingWorkspaces(promptReason: PromptReason): Promise<boolean>;
export declare const workspace2StoreActions: {
    setWindowMaximized(state: WorkspaceStoreState2, windowName: string, maximized: boolean): {
        openedWindows: OpenedWindow[];
        registeredGroupsByName: Record<string, import("@egen/esm-globals").WorkspaceGroupDefinition2 & {
            moduleName: string;
        }>;
        registeredWindowsByName: Record<string, import("@egen/esm-globals").WorkspaceWindowDefinition2 & {
            moduleName: string;
        }>;
        registeredWorkspacesByName: Record<string, import("@egen/esm-globals").WorkspaceDefinition2 & {
            moduleName: string;
        }>;
        openedGroup: import("@egen/esm-extensions").OpenedGroup | null;
        isMostRecentlyOpenedWindowHidden: boolean;
        workspaceTitleByWorkspaceName: Record<string, string>;
    };
    hideWindow(state: WorkspaceStoreState2): {
        isMostRecentlyOpenedWindowHidden: true;
        registeredGroupsByName: Record<string, import("@egen/esm-globals").WorkspaceGroupDefinition2 & {
            moduleName: string;
        }>;
        registeredWindowsByName: Record<string, import("@egen/esm-globals").WorkspaceWindowDefinition2 & {
            moduleName: string;
        }>;
        registeredWorkspacesByName: Record<string, import("@egen/esm-globals").WorkspaceDefinition2 & {
            moduleName: string;
        }>;
        openedGroup: import("@egen/esm-extensions").OpenedGroup | null;
        openedWindows: Array<OpenedWindow>;
        workspaceTitleByWorkspaceName: Record<string, string>;
    };
    restoreWindow(state: WorkspaceStoreState2, windowName: string): {
        openedWindows: OpenedWindow[];
        isMostRecentlyOpenedWindowHidden: false;
        registeredGroupsByName: Record<string, import("@egen/esm-globals").WorkspaceGroupDefinition2 & {
            moduleName: string;
        }>;
        registeredWindowsByName: Record<string, import("@egen/esm-globals").WorkspaceWindowDefinition2 & {
            moduleName: string;
        }>;
        registeredWorkspacesByName: Record<string, import("@egen/esm-globals").WorkspaceDefinition2 & {
            moduleName: string;
        }>;
        openedGroup: import("@egen/esm-extensions").OpenedGroup | null;
        workspaceTitleByWorkspaceName: Record<string, string>;
    };
    closeWorkspace(state: WorkspaceStoreState2, workspaceName: string): WorkspaceStoreState2;
    openChildWorkspace(state: WorkspaceStoreState2, parentWorkspaceName: string, childWorkspaceName: string, childWorkspaceProps: Record<string, any>): {
        openedWindows: OpenedWindow[];
    };
    setHasUnsavedChanges(state: WorkspaceStoreState2, workspaceName: string, hasUnsavedChanges: boolean): WorkspaceStoreState2;
    setWorkspaceTitle(state: WorkspaceStoreState2, workspaceName: string, title: string | null): {
        workspaceTitleByWorkspaceName: {
            [x: string]: string;
        };
        registeredGroupsByName: Record<string, import("@egen/esm-globals").WorkspaceGroupDefinition2 & {
            moduleName: string;
        }>;
        registeredWindowsByName: Record<string, import("@egen/esm-globals").WorkspaceWindowDefinition2 & {
            moduleName: string;
        }>;
        registeredWorkspacesByName: Record<string, import("@egen/esm-globals").WorkspaceDefinition2 & {
            moduleName: string;
        }>;
        openedGroup: import("@egen/esm-extensions").OpenedGroup | null;
        openedWindows: Array<OpenedWindow>;
        isMostRecentlyOpenedWindowHidden: boolean;
    };
};
export declare function useWorkspace2Store(): WorkspaceStoreState2 & {
    setWindowMaximized: (windowName: string, maximized: boolean) => void;
    hideWindow: () => void;
    restoreWindow: (windowName: string) => void;
    closeWorkspace: (workspaceName: string) => void;
    openChildWorkspace: (parentWorkspaceName: string, childWorkspaceName: string, childWorkspaceProps: Record<string, any>) => void;
    setHasUnsavedChanges: (workspaceName: string, hasUnsavedChanges: boolean) => void;
    setWorkspaceTitle: (workspaceName: string, title: string) => void;
};
/**
 * Returns the react Context containing props passed into a workspace.
 * This hook MUST be called inside a child of <Workspace2>
 */
export declare const useWorkspace2Context: () => Workspace2DefinitionProps<object, object, object>;
/**
 * @returns a list of registered workspaces.
 */
export declare const getRegisteredWorkspace2Names: () => string[];
export {};
//# sourceMappingURL=workspace2.d.ts.map