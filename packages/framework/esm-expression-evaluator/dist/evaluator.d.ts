/** @category Utility */
import jsep from 'jsep';
export { jsep };
/** An object containing the variable to use when evaluating this expression */
export type VariablesMap = {
    [key: string]: string | number | boolean | Function | RegExp | object | null | VariablesMap | Array<VariablesMap>;
};
/** The valid return types for `evaluate()` and `evaluateAsync()` */
export type DefaultEvaluateReturnType = string | number | boolean | Date | null | undefined;
/**
 * `evaluate()` implements a relatively safe version of `eval()` that is limited to evaluating synchronous
 * Javascript expressions. This allows us to safely add features that depend on user-supplied code without
 * polluting the global namespace or needing to support `eval()` and the like.
 *
 * By default it supports any expression that evalutes to a string, number, boolean, Date, null, or undefined.
 * Other values will result in an error.
 *
 * @example
 * ```ts
 * // shouldDisplayOptionalData will be false
 * const shouldDisplayOptionalData = evaluate('!isEmpty(array)', {
 *  array: [],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * })
 * ```
 *
 * Since this only implements the expression lanaguage part of Javascript, there is no support for assigning
 * values, creating functions, or creating objects, so the following will throw an error:
 *
 * @example
 * ```ts
 * evaluate('var a = 1; a');
 * ```
 *
 * In addition to string expressions, `evaluate()` can use an existing `jsep.Expression`, such as that returned
 * from the `compile()` function. The goal here is to support cases where the same expression will be evaluated
 * multiple times, possibly with different variables, e.g.,
 *
 * @example
 * ```ts
 * const expr = compile('isEmpty(array)');
 *
 * // then we use it like
 * evaluate(expr, {
 *  array: [],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * ));
 *
 * evaluate(expr, {
 *  array: ['value'],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * ));
 * ```
 *
 * This saves the overhead of parsing the expression everytime and simply allows us to evaluate it.
 *
 * The `variables` parameter should be used to supply any variables or functions that should be in-scope for
 * the evaluation. A very limited number of global objects, like NaN and Infinity are always available, but
 * any non-global values will need to be passed as a variable. Note that expressions do not have any access to
 * the variables in the scope in which they were defined unless they are supplied here.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export declare function evaluate(expression: string | jsep.Expression, variables?: VariablesMap): DefaultEvaluateReturnType;
/**
 * `evaluateAsync()` implements a relatively safe version of `eval()` that can evaluate Javascript expressions
 * that use Promises. This allows us to safely add features that depend on user-supplied code without
 * polluting the global namespace or needing to support `eval()` and the like.
 *
 * By default it supports any expression that evalutes to a string, number, boolean, Date, null, or undefined.
 * Other values will result in an error.
 *
 * @example
 * ```ts
 * // shouldDisplayOptionalData will be false
 * const shouldDisplayOptionalData = await evaluateAsync('Promise.resolve(!isEmpty(array))', {
 *  array: [],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * })
 * ```
 *
 * Since this only implements the expression lanaguage part of Javascript, there is no support for assigning
 * values, creating functions, or creating objects, so the following will throw an error:
 *
 * @example
 * ```ts
 * evaluateAsync('var a = 1; a');
 * ```
 *
 * In addition to string expressions, `evaluate()` can use an existing `jsep.Expression`, such as that returned
 * from the `compile()` function. The goal here is to support cases where the same expression will be evaluated
 * multiple times, possibly with different variables, e.g.,
 *
 * @example
 * ```ts
 * const expr = compile('Promise.resolve(isEmpty(array))');
 *
 * // then we use it like
 * evaluateAsync(expr, {
 *  array: [],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * ));
 *
 * evaluateAsync(expr, {
 *  array: ['value'],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * ));
 * ```
 *
 * This saves the overhead of parsing the expression everytime and simply allows us to evaluate it.
 *
 * The `variables` parameter should be used to supply any variables or functions that should be in-scope for
 * the evaluation. A very limited number of global objects, like NaN and Infinity are always available, but
 * any non-global values will need to be passed as a variable. Note that expressions do not have any access to
 * the variables in the scope in which they were defined unless they are supplied here.
 *
 * **Note:** `evaluateAsync()` currently only supports Promise-based asynchronous flows and does not support
 * the `await` keyword.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export declare function evaluateAsync(expression: string | jsep.Expression, variables?: VariablesMap): Promise<DefaultEvaluateReturnType>;
/**
 * `evaluateAsBoolean()` is a variant of {@link evaluate()} which only supports boolean results. Useful
 * if valid expression must return boolean values.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export declare function evaluateAsBoolean(expression: string | jsep.Expression, variables?: VariablesMap): boolean;
/**
 * `evaluateAsBooleanAsync()` is a variant of {@link evaluateAsync()} which only supports boolean results. Useful
 * if valid expression must return boolean values.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export declare function evaluateAsBooleanAsync(expression: string | jsep.Expression, variables?: VariablesMap): Promise<boolean>;
/**
 * `evaluateAsNumber()` is a variant of {@link evaluate()} which only supports number results. Useful
 * if valid expression must return numeric values.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export declare function evaluateAsNumber(expression: string | jsep.Expression, variables?: VariablesMap): number;
/**
 * `evaluateAsNumberAsync()` is a variant of {@link evaluateAsync()} which only supports number results. Useful
 * if valid expression must return numeric values.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export declare function evaluateAsNumberAsync(expression: string | jsep.Expression, variables?: VariablesMap): Promise<number>;
/**
 * `evaluateAsType()` is a type-safe version of {@link evaluate()} which returns a result if the result
 * passes a custom type predicate. The main use-case for this is to narrow the return types allowed based on
 * context, e.g., if the expected result should be a number or boolean, you can supply a custom type-guard
 * to ensure that only number or boolean results are returned.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @param typePredicate A [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
 *  which asserts that the result value matches one of the expected results.
 * @returns The result of evaluating the expression
 */
export declare function evaluateAsType<T>(expression: string | jsep.Expression, variables: VariablesMap, typePredicate: (result: unknown) => result is T): T;
/**
 * `evaluateAsTypeAsync()` is a type-safe version of {@link evaluateAsync()} which returns a result if the result
 * passes a custom type predicate. The main use-case for this is to narrow the return types allowed based on
 * context, e.g., if the expected result should be a number or boolean, you can supply a custom type-guard
 * to ensure that only number or boolean results are returned.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @param typePredicate A [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
 *  which asserts that the result value matches one of the expected results.
 * @returns The result of evaluating the expression
 */
export declare function evaluateAsTypeAsync<T>(expression: string | jsep.Expression, variables: VariablesMap, typePredicate: (result: unknown) => result is T): Promise<T>;
/**
 * `compile()` is a companion function for use with {@link evaluate()} and the various `evaluateAs*()` functions.
 * It processes an expression string into the resulting AST that is executed by those functions. This is useful if
 * you have an expression that will need to be evaluated mulitple times, potentially with different values, as the
 * lexing and parsing steps can be skipped by using the AST object returned from this.
 *
 * The returned AST is intended to be opaque to client applications, but, of course, it is possible to manipulate
 * the AST before passing it back to {@link evaluate()}, if desired. This might be useful if, for example, certain
 * values are known to be constant.
 *
 * @param expression The expression to be parsed
 * @returns An executable AST representation of the expression
 */
export declare function compile(expression: string): jsep.Expression;
//# sourceMappingURL=evaluator.d.ts.map