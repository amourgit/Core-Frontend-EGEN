import { type Calendar, type DateValue } from '@internationalized/date';
import { type DateInputValue } from './types';
/**
 * Function to convert relatively arbitrary date values into a React Aria `DateValue`,
 * normally a `CalendarDate`, which represents a date without time or timezone.
 */
export declare function dateToInternationalizedDate(date: DateInputValue, calendar: Calendar | undefined, allowNull: true): DateValue | null | undefined;
export declare function dateToInternationalizedDate(date: DateInputValue, calendar: Calendar | undefined, allowNull: false): DateValue | undefined;
export declare function dateToInternationalizedDate(date: DateInputValue, calendar: Calendar | undefined): DateValue | undefined;
/**
 * Function to convert a `DateValue` (from React Aria) into a standard JS `Date`.
 */
export declare function internationalizedDateToDate(date: DateValue): Date | undefined;
/** Removes any data attributes from an object */
export declare function removeDataAttributes<T>(props: T): T;
//# sourceMappingURL=utils.d.ts.map