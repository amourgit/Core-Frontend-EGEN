/** @module @category Workspace */
import { type ReactNode } from 'react';
import type { StoreApi } from 'zustand/vanilla';
import { type WorkspaceRegistration } from '@egen/esm-extensions';
import { type WorkspaceWindowState } from '@egen/esm-globals';
export interface CloseWorkspaceOptions {
    /**
     * Whether to close the workspace ignoring all the changes present in the workspace.
     *
     * If ignoreChanges is true, the user will not be prompted to save changes before closing
     * even if the `testFcn` passed to `promptBeforeClosing` returns `true`.
     */
    ignoreChanges?: boolean;
    /**
     * If you want to take an action after the workspace is closed, you can pass your function as
     * `onWorkspaceClose`. This function will be called only after the workspace is closed, given
     * that the user might be shown a prompt.
     * @returns void
     */
    onWorkspaceClose?: () => void;
    /**
     * Controls whether the workspace group should be closed and store to be
     * cleared when this workspace is closed.
     * Defaults to true except when opening a new workspace of the same group.
     *
     * @default true
     */
    closeWorkspaceGroup?: boolean;
}
/** The default parameters received by all workspaces */
export interface DefaultWorkspaceProps {
    /**
     * Call this function to close the workspace. This function will prompt the user
     * if there are any unsaved changes to workspace.
     *
     * You can pass `onWorkspaceClose` function to be called when the workspace is finally
     * closed, given the user forcefully closes the workspace.
     */
    closeWorkspace(closeWorkspaceOptions?: CloseWorkspaceOptions): void;
    /**
     * Call this with a no-args function that returns true if the user should be prompted before
     * this workspace is closed; e.g. if there is unsaved data.
     */
    promptBeforeClosing(testFcn: () => boolean): void;
    /**
     * Call this function to close the workspace after the form is saved. This function
     * will directly close the workspace without any prompt
     */
    closeWorkspaceWithSavedChanges(closeWorkspaceOptions?: CloseWorkspaceOptions): void;
    /**
     * Use this to set the workspace title if it needs to be set dynamically.
     *
     * Workspace titles generally are set in the workspace declaration in the routes.json file. They can also
     * be set by the workspace launcher by passing `workspaceTitle` in the `additionalProps`
     * parameter of the `launchWorkspace` function. This function is useful when the workspace
     * title needs to be set dynamically.
     *
     * @param title The title to set. If using titleNode, set this to a human-readable string
     *        which will identify the workspace in notifications and other places.
     * @param titleNode A React object to put in the workspace header in place of the title. This
     *        is useful for displaying custom elements in the header. Note that custom header
     *        elements can also be attached to the workspace header extension slots.
     */
    setTitle(title: string, titleNode?: ReactNode): void;
}
export interface WorkspaceWindowSize {
    size: WorkspaceWindowState;
}
export interface WorkspaceWindowSizeProviderProps {
    children?: React.ReactNode;
}
export interface WorkspaceWindowSizeContext {
    windowSize: WorkspaceWindowSize;
    updateWindowSize?(value: WorkspaceWindowState): any;
    active: boolean;
}
export interface Prompt {
    title: string;
    body: string;
    /** Defaults to "Confirm" */
    confirmText?: string;
    onConfirm(): void;
    /** Defaults to "Cancel" */
    cancelText?: string;
}
export interface WorkspaceStoreState {
    context: string | null;
    openWorkspaces: Array<OpenWorkspace>;
    prompt: Prompt | null;
    workspaceWindowState: WorkspaceWindowState;
    workspaceGroup?: {
        name: string;
        members: Array<string>;
        cleanup?(): void;
    };
}
export interface OpenWorkspace extends WorkspaceRegistration, DefaultWorkspaceProps {
    additionalProps: object;
    currentWorkspaceGroup?: string;
}
/**
 *
 * @param name Name of the workspace
 * @param ignoreChanges If set to true, the "unsaved changes" modal will never be shown, even if the `promptBeforeClosing` function returns true. The user will not be prompted before closing.
 * @returns true if the workspace can be closed.
 */
export declare function canCloseWorkspaceWithoutPrompting(name: string, ignoreChanges?: boolean): boolean;
interface LaunchWorkspaceGroupArg {
    state: Record<string | symbol | number, any>;
    onWorkspaceGroupLaunch?(): void;
    workspaceGroupCleanup?(): void;
    workspaceToLaunch?: {
        name: string;
        additionalProps?: Record<string | symbol | number, any>;
    };
}
/**
 * Launches a workspace group with the specified name and configuration.
 * If there are any open workspaces, it will first close them before launching the new workspace group.
 *
 * @param groupName - The name of the workspace group to launch
 * @param args - Configuration object for launching the workspace group
 * @param args.state - The initial state for the workspace group
 * @param args.onWorkspaceGroupLaunch - Optional callback function to be executed after the workspace group is launched
 * @param args.workspaceGroupCleanup - Optional cleanup function to be executed when the workspace group is closed
 *
 * @example
 * launchWorkspaceGroup("myGroup", {
 *   state: initialState,
 *   onWorkspaceGroupLaunch: () => console.log("Workspace group launched"),
 *   workspaceGroupCleanup: () => console.log("Cleaning up workspace group")
 * });
 *
 * @deprecated migrate to workspace v2 and use launchWorkspaceGroup2 instead. See:
 * https://github.com/amourgit/wiki/spaces/docs/pages/615677981/Workspace+v2+Migration+Guide
 */
export declare function launchWorkspaceGroup(groupName: string, args: LaunchWorkspaceGroupArg): void;
/**
 * This launches a workspace by its name. The workspace must have been registered.
 * Workspaces should be registered in the `routes.json` file.
 *
 * For the workspace to appear, there must be either a `<WorkspaceOverlay />` or
 * a `<WorkspaceWindow />` component rendered.
 *
 * The behavior of this function is as follows:
 *
 * - If no workspaces are open, or if no other workspaces with the same type are open,
 *   it will be opened and focused.
 * - If a workspace with the same name is already open, it will be displayed/focused,
 *   if it was not already.
 * - If a workspace is launched and a workspace which cannot be hidden is already open,
 *  a confirmation modal will pop up warning about closing the currently open workspace.
 * - If another workspace with the same type is open, the workspace will be brought to
 *   the front and then a confirmation modal will pop up warning about closing the opened
 *   workspace
 *
 * Note that this function just manipulates the workspace store. The UI logic is handled
 * by the components that display workspaces.
 *
 * Additional props can be passed to the workspace component being launched. Passing a
 * prop named `workspaceTitle` will override the title of the workspace.
 *
 * @param name The name of the workspace to launch
 * @param additionalProps Props to pass to the workspace component being launched. Passing
 *          a prop named `workspaceTitle` will override the title of the workspace.
 *
 * @deprecated migrate to workspace v2 and use launchWorkspace2 instead. See:
 * https://github.com/amourgit/wiki/spaces/docs/pages/615677981/Workspace+v2+Migration+Guide
 */
export declare function launchWorkspace<T extends DefaultWorkspaceProps | object = DefaultWorkspaceProps & {
    [key: string]: any;
}>(name: string, additionalProps?: Omit<T, keyof DefaultWorkspaceProps> & {
    workspaceTitle?: string;
}): void;
/**
 * Use this function to navigate to a new page and launch a workspace on that page.
 *
 * @param options The options for navigating and launching the workspace.
 * @param options.targetUrl The URL to navigate to. Will be passed to [[navigate]].
 * @param options.contextKey The context key used by the target page.
 * @param options.workspaceName The name of the workspace to launch.
 * @param options.additionalProps Additional props to pass to the workspace component being launched.
 *
 * @deprecated migrate to workspace v2 and call launchWorkspace2 instead. See:
 * https://github.com/amourgit/wiki/spaces/docs/pages/615677981/Workspace+v2+Migration+Guide
 */
export declare function navigateAndLaunchWorkspace({ targetUrl, contextKey, workspaceName, additionalProps, }: {
    targetUrl: string;
    contextKey: string;
    workspaceName: string;
    additionalProps?: object;
}): void;
export declare function promptBeforeClosing(workspaceName: string, testFcn: () => boolean): void;
export declare function getPromptBeforeClosingFcn(workspaceName: string): any;
export declare function cancelPrompt(): void;
/**
 * Function to close an opened workspace
 * @param name Workspace registration name
 * @param options Options to close workspace
 *
 * @deprecated migrate to workspace v2 and call closeWorkspace from Workspace2DefinitionProps instead. See:
 * https://github.com/amourgit/wiki/spaces/docs/pages/615677981/Workspace+v2+Migration+Guide
 */
export declare function closeWorkspace(name: string, options?: CloseWorkspaceOptions): boolean;
/**
 * The set of workspaces is specific to a particular page. This function
 * should be used when transitioning to a new page. If the current
 * workspace data is for a different page, the workspace state is cleared.
 *
 * This is called by the workspace components when they mount.
 * @internal
 *
 * @param contextKey An arbitrary key to identify the current page
 */
export declare function changeWorkspaceContext(contextKey: string | null): void;
export declare const workspaceStore: StoreApi<WorkspaceStoreState>;
export declare function getWorkspaceStore(): StoreApi<WorkspaceStoreState>;
export declare function updateWorkspaceWindowState(value: WorkspaceWindowState): void;
export declare function closeAllWorkspaces(onClosingWorkspaces?: () => void, filter?: (workspace: OpenWorkspace) => boolean): void;
export interface WorkspacesInfo {
    active: boolean;
    prompt: Prompt | null;
    workspaceWindowState: WorkspaceWindowState;
    workspaces: Array<OpenWorkspace>;
    workspaceGroup?: WorkspaceStoreState['workspaceGroup'];
}
/**
 * @deprecated migrate to workspace v2. See:
 * https://github.com/amourgit/wiki/spaces/docs/pages/615677981/Workspace+v2+Migration+Guide
 */
export declare function useWorkspaces(): WorkspacesInfo;
type PromptType = 'closing-workspace' | 'closing-all-workspaces' | 'closing-workspace-launching-new-workspace';
/**
 * Sets the current prompt according to the prompt type.
 * @param promptType Determines the text and behavior of the prompt
 * @param onConfirmation Function to be called after the user confirms to close the workspace
 * @param workspaceTitle Workspace title to be shown in the prompt
 * @returns
 */
export declare function showWorkspacePrompts(promptType: PromptType, onConfirmation?: () => void, workspaceTitle?: string): void;
export declare function resetWorkspaceStore(): void;
/**
 * The workspace group store is a store that is specific to the workspace group.
 * If the workspace has its own sidebar, the store will be created.
 * This store can be used to store data that is specific to the workspace group.
 * The store will be same for all the workspaces with same group name.
 *
 * For workspaces launched without a group, the store will be undefined.
 *
 * The store will be cleared when all the workspaces with the store's group name are closed.
 */
export declare function getWorkspaceGroupStore(workspaceGroupName: string | undefined, additionalProps?: object): StoreApi<object> | undefined;
export {};
//# sourceMappingURL=workspaces.d.ts.map