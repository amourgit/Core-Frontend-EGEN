import React from 'react';
interface WorkspaceUnsavedChangesModal {
    onConfirm: () => void;
    onCancel: () => void;
    affectedWorkspaceTitles: string[];
}
/**
 * This modal is used for prompting user to confirm closing currently opened workspace.
 */
declare const Workspace2ClosePromptModal: React.FC<WorkspaceUnsavedChangesModal>;
export default Workspace2ClosePromptModal;
//# sourceMappingURL=workspace2-close-prompt.modal.d.ts.map