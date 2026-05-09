import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const buttonVariants: (props?: {
    variant?: "default" | "link" | "ghost" | "iconButton";
    size?: "default" | "icon" | "sm" | "lg" | "icon-lg" | "icon-xl";
    shine?: boolean;
} & import("class-variance-authority/types").ClassProp) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button, buttonVariants };
//# sourceMappingURL=index.d.ts.map