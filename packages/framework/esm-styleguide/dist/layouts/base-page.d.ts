import * as React from "react";
interface LayoutProps {
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    main?: React.ReactNode;
    middle?: React.ReactNode;
    rightPanel?: React.ReactNode;
    background?: React.ReactNode;
    sidebarWidth?: number;
    rightPanelWidth?: number;
    sidebarMinWidth?: number;
    sidebarMaxWidth?: number;
    rightPanelMinWidth?: number;
    rightPanelMaxWidth?: number;
    mainMinWidth?: number;
    onSidebarToggle?: (isOpen: boolean) => void;
    onResize?: (leftSize: number, middleSize: number, rightSize: number) => void;
    className?: string;
    isSombre?: boolean;
}
export default function BasePage({ header, sidebar, main, middle, rightPanel, background, sidebarWidth, rightPanelWidth, sidebarMinWidth, sidebarMaxWidth, rightPanelMinWidth, rightPanelMaxWidth, mainMinWidth, onSidebarToggle, onResize, className, isSombre, }: LayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=base-page.d.ts.map