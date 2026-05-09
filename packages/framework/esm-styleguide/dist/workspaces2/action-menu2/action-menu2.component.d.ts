import { type WorkspaceGroupDefinition2 } from '@egen/esm-globals';
export interface ActionMenuProps {
    workspaceGroup: WorkspaceGroupDefinition2 & {
        moduleName: string;
    };
    groupProps: Record<string, any> | null;
}
/**
 * This component renders the action menu (right nav on desktop, bottom on mobile)
 * for a workspace group. The action menu is only rendered when at least one
 * window in the workspace group has an icon defined.
 */
export declare function ActionMenu({ workspaceGroup, groupProps }: ActionMenuProps): import("react/jsx-runtime").JSX.Element;
export default ActionMenu;
//# sourceMappingURL=action-menu2.component.d.ts.map