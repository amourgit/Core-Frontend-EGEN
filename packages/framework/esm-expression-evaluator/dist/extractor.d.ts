import { jsep } from './evaluator';
/**
 * `extractVariableNames()` is a companion function for `evaluate()` and `evaluateAsync()` which extracts the
 * names of all unbound identifiers used in the expression. The idea is to be able to extract all of the names
 * of variables that will need to be supplied in order to correctly process the expression.
 *
 * @example
 * ```ts
 * // variables will be ['isEmpty', 'array']
 * const variables = extractVariableNames('!isEmpty(array)')
 * ```
 *
 * An identifier is considered "unbound" if it is not a reference to the property of an object, is not defined
 * as a parameter to an inline arrow function, and is not a global value. E.g.,
 *
 * @example
 * ```ts
 * // variables will be ['obj']
 * const variables = extractVariableNames('obj.prop()')
 * ```
 *
 * @example
 * ```ts
 * // variables will be ['arr', 'needle']
 * const variables = extractVariableNames('arr.filter(v => v === needle)')
 * ```
 *
 * @example
 * ```ts
 * // variables will be ['myVar']
 * const  variables = extractVariableNames('new String(myVar)')
 * ```
 *
 * Note that because this expression evaluator uses a restricted definition of "global" there are some Javascript
 * globals that will be reported as a unbound expression. This is expected because the evaluator will still fail
 * on these expressions.
 *
 * @param expression The expression to analyze, either as a string or pre-parsed expression.
 * @returns An array of variable names that are unbound in the expression.
 */
export declare function extractVariableNames(expression: string | jsep.Expression): string[];
//# sourceMappingURL=extractor.d.ts.map