/** @module @category Workspace */
import React from 'react';
export interface ActionMenuButtonProps2 {
    icon: (props: object) => JSX.Element;
    label: string;
    tagContent?: string | React.ReactNode;
    workspaceToLaunch: {
        workspaceName: string;
        workspaceProps?: Record<string, any>;
        windowProps?: Record<string, any>;
    };
    /**
     * An optional callback function to run before launching the workspace.
     * If provided, the workspace will only be launched if this function returns true.
     * This can be used to perform checks or prompt the user before launching the workspace.
     * Note that this function does not run if the action button's window is already opened;
     * it will just restore (unhide) the window.
     *
     */
    onBeforeWorkspaceLaunch?: () => Promise<boolean>;
}
/**
 * The ActionMenuButton2 component is used to render a button in the action menu of a workspace group.
 * The button is associated with a specific workspace window, defined in routes.json of the app with the button.
 * When one or more workspaces within the window are opened, the button will be highlighted:
 * bold blue when the window is focused (un-minimized and in front), green when unfocused.
 * If any workspace in the window has unsaved changes, an exclamation mark will be displayed
 * on top of the icon.
 *
 * On clicked, The button either:
 * 1. hides the workspace window if it is opened and focused; or
 * 2. restores the workspace window if it is opened and unfocused; or
 * 3. launches a workspace from within that window, if the window is not opened.
 *
 * @experimental
 */
export declare const ActionMenuButton2: React.FC<ActionMenuButtonProps2>;
//# sourceMappingURL=action-menu-button2.component.d.ts.map