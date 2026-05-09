import React from 'react';
import { type CalendarDate, type DateValue } from '@internationalized/date';
type CalendarPopoverProps = {
    /** The current date */
    today_: CalendarDate;
} & ({
    /** Either 'single' (for a Calendar) or 'range' (for a RangeCalendar) */
    variant: 'single';
    /** The minimum selectable date (only used for RangeCalendar) */
    minDate?: never;
    /** The maximum selectable date (only used for RangeCalendar) */
    maxDate?: never;
} | {
    /** Either 'single' (for a Calendar) or 'range' (for a range) */
    variant: 'range';
    /** The minimum selectable date (only used for RangeCalendar) */
    minDate?: DateValue | null;
    /** The maximum selectable date (only used for RangeCalendar) */
    maxDate?: DateValue | null;
});
/**
 * The calendar dropdown content shared between the single and range date pickers.
 * Renders the popover, auto-close dialog, navigation header, and calendar grid.
 * The `variant` prop selects between Calendar (single) and RangeCalendar (range).
 */
export declare const CalendarPopover: React.ForwardRefExoticComponent<CalendarPopoverProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=calendar-popover.component.d.ts.map