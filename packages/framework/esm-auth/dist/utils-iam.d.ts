import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export type ActionSuccessResult<T> = {
    success: true;
    data: T;
    id: string;
};
export type ActionErrorResult = {
    success: false;
    message: string;
    id: string;
};
export type ActionResult<T> = ActionSuccessResult<T> | ActionErrorResult;
export declare const success: <T>(data: T) => ActionSuccessResult<T>;
export declare const error: (message: string) => ActionErrorResult;
//# sourceMappingURL=utils-iam.d.ts.map