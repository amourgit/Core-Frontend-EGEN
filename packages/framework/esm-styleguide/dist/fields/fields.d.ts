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
export interface FieldIcon {
    icon: LucideIcon;
    position?: "left" | "label";
}
export interface BaseFieldProps {
    label?: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "tel" | "url" | "number" | "search";
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    fieldIcon?: FieldIcon;
    validation?: ValidationConfig;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onValidationChange?: (validation: ValidationRule | null) => void;
}
export declare const FilledField: React.FC<BaseFieldProps>;
export declare const OutlinedField: React.FC<BaseFieldProps>;
export declare const StandardField: React.FC<BaseFieldProps>;
//# sourceMappingURL=fields.d.ts.map