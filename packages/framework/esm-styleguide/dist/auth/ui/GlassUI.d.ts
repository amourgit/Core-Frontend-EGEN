import React from 'react';
export declare const glass: {
    card: string;
    cardBorder: string;
    cardStrong: string;
    cardStrongBorder: string;
    input: string;
    hover: string;
    blue: string;
    blueBorder: string;
    green: string;
    greenBorder: string;
    red: string;
    redBorder: string;
    amber: string;
    amberBorder: string;
    purple: string;
    purpleBorder: string;
};
export declare function GlassPageWrapper({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function PageContainer({ children, maxWidth, className, }: {
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function GlassCard({ children, className, strong, animate, delay, noPadding, style, }: {
    children: React.ReactNode;
    className?: string;
    strong?: boolean;
    animate?: boolean;
    delay?: number;
    noPadding?: boolean;
    style?: React.CSSProperties;
}): import("react/jsx-runtime").JSX.Element;
export declare function SectionHeader({ icon: Icon, title, subtitle, action, iconColor, iconBg, }: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    iconColor?: string;
    iconBg?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function BackLink({ href, label }: {
    href: string;
    label?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function GlassPageHeader({ icon: Icon, title, subtitle, iconBg, iconColor, badge, }: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    iconBg?: string;
    iconColor?: string;
    badge?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function EmptyState({ icon: Icon, title, subtitle, action, }: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function ErrorBanner({ message, onRetry }: {
    message: string;
    onRetry?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function SuccessBanner({ message }: {
    message: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function CenteredLoader({ label }: {
    label?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function StatusBadge({ status, labels, colors, }: {
    status: string;
    labels: Record<string, string>;
    colors: Record<string, {
        text: string;
        bg: string;
        border: string;
    }>;
}): import("react/jsx-runtime").JSX.Element;
export declare function SectionDivider({ label }: {
    label: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function MetaPill({ icon: Icon, label }: {
    icon: React.ElementType;
    label: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function ActionRow({ href, icon: Icon, label, description, variant, onClick, }: {
    href?: string;
    icon: React.ElementType;
    label: string;
    description?: string;
    variant?: 'default' | 'danger';
    onClick?: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GlassUI.d.ts.map