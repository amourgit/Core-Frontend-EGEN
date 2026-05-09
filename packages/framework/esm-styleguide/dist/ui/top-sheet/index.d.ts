import React from "react";
interface TopSheetRootProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    className?: string;
}
interface TopSheetPortalProps {
    children: React.ReactNode;
    container?: HTMLElement;
    className?: string;
}
declare const TopSheetPortal: ({ children, container, className, }: TopSheetPortalProps) => React.ReactPortal;
interface TopSheetOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}
declare const TopSheetOverlay: React.ForwardRefExoticComponent<TopSheetOverlayProps & React.RefAttributes<HTMLDivElement>>;
interface TopSheetTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
    className?: string;
}
declare const TopSheetTrigger: ({ asChild, children, className, }: TopSheetTriggerProps) => import("react/jsx-runtime").JSX.Element;
interface TopSheetContentProps {
    children?: React.ReactNode;
    height?: string;
    className?: string;
    closeThreshold?: number;
}
declare const TopSheetContent: ({ children, height, className, closeThreshold, }: TopSheetContentProps) => import("react/jsx-runtime").JSX.Element;
interface TopSheetHeaderProps {
    children: React.ReactNode;
    className?: string;
}
declare const TopSheetHeader: ({ children, className }: TopSheetHeaderProps) => import("react/jsx-runtime").JSX.Element;
interface TopSheetTitleProps {
    children: React.ReactNode;
    className?: string;
}
declare const TopSheetTitle: ({ children, className }: TopSheetTitleProps) => import("react/jsx-runtime").JSX.Element;
interface TopSheetDescriptionProps {
    children: React.ReactNode;
    className?: string;
}
declare const TopSheetDescription: ({ children, className, }: TopSheetDescriptionProps) => import("react/jsx-runtime").JSX.Element;
interface TopSheetFooterProps {
    children: React.ReactNode;
    className?: string;
}
declare const TopSheetFooter: ({ children, className }: TopSheetFooterProps) => import("react/jsx-runtime").JSX.Element;
interface TopSheetCloseProps {
    asChild?: boolean;
    children: React.ReactNode;
    className?: string;
}
declare const TopSheetClose: ({ asChild, children, className, }: TopSheetCloseProps) => import("react/jsx-runtime").JSX.Element;
declare const TopSheet: ({ children, open, onOpenChange, defaultOpen, className, }: TopSheetRootProps) => import("react/jsx-runtime").JSX.Element;
export { TopSheet, TopSheetPortal, TopSheetOverlay, TopSheetTrigger, TopSheetClose, TopSheetContent, TopSheetHeader, TopSheetFooter, TopSheetTitle, TopSheetDescription, };
//# sourceMappingURL=index.d.ts.map