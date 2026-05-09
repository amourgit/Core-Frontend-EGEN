/** @module @category Workspace */
import React from 'react';
export interface ActionMenuButtonProps {
    getIcon: (props: object) => JSX.Element;
    label: string;
    iconDescription: string;
    handler: () => void;
    type: string;
    tagContent?: string | React.ReactNode;
}
/**
 * @depcreated migrate to workspace v2 and use ActionMenuButton2. See:
 * https://github.com/amourgit/wiki/spaces/docs/pages/615677981/Workspace+v2+Migration+Guide
 */
export declare const ActionMenuButton: React.FC<ActionMenuButtonProps>;
//# sourceMappingURL=action-menu-button.component.d.ts.map