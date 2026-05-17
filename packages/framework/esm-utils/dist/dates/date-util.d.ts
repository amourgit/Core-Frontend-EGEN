/**
 * @module
 * @category Date and Time
 */
import { type CalendarDate, type CalendarDateTime, type CalendarIdentifier, type ZonedDateTime } from '@internationalized/date';
import type { DurationFormatOptions, DurationInput } from '@formatjs/intl-durationformat/src/types';
export type DateInput = string | number | Date;
/**
 * This function checks whether a date string is the EGEN ISO format.
 * The format should be YYYY-MM-DDTHH:mm:ss.SSSZZ
 */
export declare function isEgenDateStrict(egenPayloadString: string): boolean;
/**
 * Checks if the provided date is today.
 *
 * @param date The date to check.
 * @returns `true` if the date is today, `false` otherwise.
 */
export declare function isEgenDateToday(date: DateInput): boolean;
/**
 * Converts the object to a date object if it is an EGEN ISO date time string.
 * Otherwise returns null.
 */
export declare function toDateObjectStrict(egenDateString: string): Date | null;
/**
 * Formats the input to EGEN ISO format: "YYYY-MM-DDTHH:mm:ss.SSSZZ".
 */
export declare function toEgenIsoString(date: DateInput, toUTC?: boolean): string;
/**
 * Utility function to parse an arbitrary string into a date.
 * Uses `dayjs(dateString)`.
 */
export declare function parseDate(dateString: string): Date;
/**
 * Provides the name of the calendar to associate, as a default, with the given base locale.
 *
 * @example
 * ```
 * registerDefaultCalendar('en', 'buddhist') // sets the default calendar for the 'en' locale to Buddhist.
 * ```
 *
 * @param locale the locale to register this calendar for
 * @param calendar the calendar to use for this registration
 */
export declare function registerDefaultCalendar(locale: string, calendar: CalendarIdentifier): void;
/**
 * Retrieves the default calendar for the specified locale if any.
 *
 * @param locale the locale to look-up
 */
export declare function getDefaultCalendar(locale: Intl.Locale | string | undefined): CalendarIdentifier;
export type FormatDateMode = 'standard' | 'wide';
export type FormatDateOptions = {
    /**
     * The calendar to use when formatting this date.
     */
    calendar?: string;
    /**
     * The locale to use when formatting this date
     */
    locale?: string;
    /**
     * - `standard`: "03 Feb 2022"
     * - `wide`:     "03 — Feb — 2022"
     */
    mode: FormatDateMode;
    /**
     * Whether the time should be included in the output always (`true`),
     * never (`false`), or only when the input date is today (`for today`).
     */
    time: true | false | 'for today';
    /** Whether to include the day number */
    day: boolean;
    /** Whether to include the month number */
    month: boolean;
    /** Whether to include the year */
    year: boolean;
    /** The unicode numbering system to use */
    numberingSystem?: string;
    /**
     * Disables the special handling of dates that are today. If false
     * (the default), then dates that are today will be formatted as "Today"
     * in the locale language. If true, then dates that are today will be
     * formatted the same as all other dates.
     */
    noToday: boolean;
};
/**
 * Formats the string representing a date, including partial representations of dates, according to the current
 * locale and the given options.
 *
 * Default options:
 *  - mode: "standard",
 *  - time: "for today",
 *  - day: true,
 *  - month: true,
 *  - year: true
 *  - noToday: false
 *
 * If the date is today then "Today" is produced (in the locale language).
 * This behavior can be disabled with `noToday: true`.
 *
 * When time is included, it is appended with a comma and a space. This
 * agrees with the output of `Date.prototype.toLocaleString` for *most*
 * locales.
 *
 * @param dateString The date string to parse and format.
 * @param options Optional formatting options.
 * @returns The formatted date string, or `null` if the input cannot be parsed.
 */
export declare function formatPartialDate(dateString: string, options?: Partial<FormatDateOptions>): string;
/**
 * Formats the input date according to the current locale and the
 * given options.
 *
 * Default options:
 *  - mode: "standard",
 *  - time: "for today",
 *  - day: true,
 *  - month: true,
 *  - year: true
 *  - noToday: false
 *
 * If the date is today then "Today" is produced (in the locale language).
 * This behavior can be disabled with `noToday: true`.
 *
 * When time is included, it is appended with a comma and a space. This
 * agrees with the output of `Date.prototype.toLocaleString` for *most*
 * locales.
 *
 * @param date The date to format.
 * @param options Optional formatting options.
 * @returns The formatted date string.
 */
export declare function formatDate(date: Date, options?: Partial<FormatDateOptions>): string;
/**
 * Formats the input as a time, according to the current locale.
 * 12-hour or 24-hour clock depends on locale.
 *
 * @param date The date whose time portion should be formatted.
 * @returns The formatted time string (e.g., "2:30 PM" or "14:30").
 */
export declare function formatTime(date: Date): string;
/**
 * Formats the input into a string showing the date and time, according
 * to the current locale. The `mode` parameter is as described for
 * `formatDate`.
 *
 * This is created by concatenating the results of `formatDate`
 * and `formatTime` with a comma and space. This agrees with the
 * output of `Date.prototype.toLocaleString` for *most* locales.
 *
 * @param date The date to format.
 * @param options Optional formatting options (same as formatDate, except time is always included).
 * @returns The formatted date and time string.
 */
export declare function formatDatetime(date: Date, options?: Partial<Omit<FormatDateOptions, 'time'>>): string;
/**
 * Converts a calendar date to the equivalent locale calendar date.
 * @returns CalendarDate
 */
export declare function convertToLocaleCalendar(date: CalendarDate | CalendarDateTime | ZonedDateTime, locale: string | Intl.Locale): CalendarDate | CalendarDateTime | ZonedDateTime;
/**
 * Formats the input duration according to the current locale.
 *
 * @param duration The duration to format (DurationInput object).
 * @param options Optional options for formatting.
 * @returns The formatted duration string.
 */
export declare function formatDuration(duration: DurationInput, options?: DurationFormatOptions): string;
//# sourceMappingURL=date-util.d.ts.map