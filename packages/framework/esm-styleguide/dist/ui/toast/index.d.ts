type Variant = 'default' | 'success' | 'error' | 'warning';
type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
interface ActionButton {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'ghost' | 'link' | 'iconButton';
}
interface ToasterProps {
    title?: string;
    message: string;
    variant?: Variant;
    duration?: number;
    position?: Position;
    actions?: ActionButton;
    onDismiss?: () => void;
    highlightTitle?: boolean;
}
export interface ToasterRef {
    show: (props: ToasterProps) => void;
}
declare const Toaster: import("react").ForwardRefExoticComponent<{
    defaultPosition?: Position;
} & import("react").RefAttributes<ToasterRef>>;
export declare const useToast: () => {
    toast: {
        (options: {
            variant?: "default" | "success" | "destructive" | "warning" | "info";
            title?: string;
            description?: string;
            duration?: number;
            action?: {
                label: string;
                onClick: () => void;
            };
            cancel?: {
                label: string;
                onClick: () => void;
            };
        }): any;
        success(message: string, options?: any): string | number;
        error(message: string, options?: any): string | number;
        warning(message: string, options?: any): string | number;
        info(message: string, options?: any): string | number;
        dismiss(id?: string): string | number;
    };
};
export declare const toast: {
    (options: {
        variant?: "default" | "success" | "destructive" | "warning" | "info";
        title?: string;
        description?: string;
        duration?: number;
        action?: {
            label: string;
            onClick: () => void;
        };
        cancel?: {
            label: string;
            onClick: () => void;
        };
    }): any;
    success(message: string, options?: any): string | number;
    error(message: string, options?: any): string | number;
    warning(message: string, options?: any): string | number;
    info(message: string, options?: any): string | number;
    dismiss(id?: string): string | number;
};
export default Toaster;
//# sourceMappingURL=index.d.ts.map