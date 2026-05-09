import type React from "react";
import { LucideIcon } from "lucide-react";
export interface ValidationRule {
    regex: RegExp;
    message: string;
    type: "warning" | "error" | "success";
}
export interface ValidationConfig {
    rules: ValidationRule[];
    realTimeValidation?: boolean;
    triggerVibration?: boolean;
    showIcons?: boolean;
    showMessages?: boolean;
}
export interface SizeConfig {
    height?: string;
    fontSize?: string;
    iconSize?: string;
    messageFontSize?: string;
    borderRadius?: string;
    padding?: string;
}
export interface ColorConfig {
    warning?: {
        border?: string;
        focusBorder?: string;
        text?: string;
        icon?: string;
    };
    error?: {
        border?: string;
        focusBorder?: string;
        text?: string;
        icon?: string;
    };
    success?: {
        border?: string;
        focusBorder?: string;
        text?: string;
        icon?: string;
    };
    default?: {
        border?: string;
        focusBorder?: string;
        background?: string;
        text?: string;
        placeholder?: string;
    };
}
export interface AnimationConfig {
    enabled?: boolean;
    duration?: number;
    vibration?: {
        error?: number[];
        warning?: number[];
        success?: number[];
    };
    transitions?: {
        icon?: string;
        message?: string;
        border?: string;
    };
}
export interface IconConfig {
    warning?: LucideIcon | React.ComponentType<any>;
    error?: LucideIcon | React.ComponentType<any>;
    success?: LucideIcon | React.ComponentType<any>;
    position?: "left" | "right";
    offset?: string;
}
export interface DynamicFieldProps {
    label?: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "tel" | "url" | "number" | "search";
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    showLabel?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    validation?: ValidationConfig;
    size?: SizeConfig;
    colors?: ColorConfig;
    animations?: AnimationConfig;
    icons?: IconConfig;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onValidationChange?: (validation: ValidationRule | null) => void;
    leftAddon?: React.ReactNode;
    rightAddon?: React.ReactNode;
    customIcon?: React.ReactNode;
    inputClassName?: string;
    labelClassName?: string;
    messageClassName?: string;
    containerClassName?: string;
}
export declare const DynamicField: React.FC<DynamicFieldProps>;
//# sourceMappingURL=dynamic-field.d.ts.map