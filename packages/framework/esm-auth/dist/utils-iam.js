import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const success = (data) => {
    return { success: true, data, id: crypto.randomUUID() };
};
export const error = (message) => {
    return { success: false, message, id: crypto.randomUUID() };
};
//# sourceMappingURL=utils-iam.js.map