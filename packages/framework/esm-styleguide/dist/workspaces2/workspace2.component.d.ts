import React, { type ReactNode } from 'react';
interface Workspace2Props {
    title: string;
    children: ReactNode;
    hasUnsavedChanges?: boolean;
}
/**
 * @experimental
 */
export interface Workspace2DefinitionProps<WorkspaceProps extends object = object, WindowProps extends object = object, GroupProps extends object = object> {
    /**
     * This function launches a child workspace. Unlike `launchWorkspace()`, this function is meant
     * to be called from the a workspace, and it does not allow passing (or changing)
     * the window props or group props
     * @param workspaceName
     * @param workspaceProps
     */
    launchChildWorkspace<Props extends object>(workspaceName: string, workspaceProps?: Props): Promise<void>;
    /**
     * closes the current workspace, along with its children.
     * @param options Optional configuration for closing the workspace.
     * @param options.closeWindow If true, the workspace's window, along with all workspaces within it, will be closed as well.
     * @param options.discardUnsavedChanges If true, the "unsaved changes" modal will be suppressed, and the value of `hasUnsavedChanges` will be ignored. Use this when closing the workspace immediately after changes are saved.
     * @returns a Promise that resolves to true if the workspace is closed, false otherwise.
     */
    closeWorkspace(options?: {
        closeWindow?: boolean;
        discardUnsavedChanges?: boolean;
    }): Promise<boolean>;
    workspaceProps: WorkspaceProps | null;
    windowProps: WindowProps | null;
    groupProps: GroupProps | null;
    workspaceName: string;
    windowName: string;
    isRootWorkspace: boolean;
    showActionMenu: boolean;
}
/**
 * @experimental
 */
export type Workspace2Definition<WorkspaceProps extends object, WindowProps extends object, GroupProps extends object> = React.FC<Workspace2DefinitionProps<WorkspaceProps, WindowProps, GroupProps>>;
/**
 * The Workspace2 component is used as a top-level container to render
 * its children as content within a workspace. When creating a workspace
 * component, `<Workspace2>` should be the top-level component returned,
 * wrapping all of the workspace content.
 * @experimental
 */
export declare const Workspace2: React.FC<Workspace2Props>;
export {};
//# sourceMappingURL=workspace2.component.d.ts.map