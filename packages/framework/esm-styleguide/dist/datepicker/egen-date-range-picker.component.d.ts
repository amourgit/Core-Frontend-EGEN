import React from 'react';
import { type DateRangePickerProps, type DateRange } from 'react-aria-components';
import { type CalendarDate } from '@internationalized/date';
import { type DateInputValue, type DatePickerBaseProps } from './types';
/** Properties for the EgenDateRangePicker */
export interface EgenDateRangePickerProps extends Omit<DateRangePickerProps<CalendarDate>, 'className' | 'onChange' | 'defaultValue' | 'value'>, DatePickerBaseProps {
    /** The default value (uncontrolled) */
    defaultValue?: [DateInputValue, DateInputValue];
    /** Handler that is called when the value changes. */
    onChange?: (value: [Date | null | undefined, Date | null | undefined]) => void;
    /** Handler that is called when the value changes. Note that this provides types from @internationalized/date. */
    onChangeRaw?: (value: DateRange | null) => void;
    /** The value (controlled) */
    value?: [DateInputValue, DateInputValue];
}
/**
 * A date range picker to enter or select a date and time range. Based on React Aria, but styled to look like Carbon.
 */
export declare const EgenDateRangePicker: React.ForwardRefExoticComponent<EgenDateRangePickerProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=egen-date-range-picker.component.d.ts.map