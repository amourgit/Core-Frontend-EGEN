/**
 * Verifies that the value is between the provided minimum and maximum
 *
 * @param min Minimum acceptable value
 * @param max Maximum acceptable value
 * @returns A validator function that checks if a value is within the specified range.
 */
export declare const inRange: (min: number, max: number) => import("..").Validator;
/**
 * Verifies that a string contains only the default URL template
 * parameters, plus any specified in `allowedTemplateParameters`.
 *
 * @param allowedTemplateParameters To be added to `egenBase` and `egenSpaBase`
 * @returns A validator function that checks if a URL contains only allowed template parameters.
 * @category Navigation
 */
export declare const isUrlWithTemplateParameters: (allowedTemplateParameters: Array<string> | readonly string[]) => import("..").Validator;
/**
 * Verifies that a string contains only the default URL template parameters.
 *
 * @category Navigation
 */
export declare const isUrl: import("..").Validator;
/**
 * Verifies that the value is one of the allowed options.
 *
 * @param allowedValues The list of allowable values
 * @returns A validator function that checks if a value is in the allowed list.
 */
export declare const oneOf: (allowedValues: Array<any> | readonly any[]) => import("..").Validator;
export declare const validators: {
    inRange: (min: number, max: number) => import("..").Validator;
    isUrl: import("..").Validator;
    isUrlWithTemplateParameters: (allowedTemplateParameters: Array<string> | readonly string[]) => import("..").Validator;
    oneOf: (allowedValues: Array<any> | readonly any[]) => import("..").Validator;
};
//# sourceMappingURL=validators.d.ts.map