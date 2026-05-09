import React from 'react';
import { type DateValue } from 'react-aria';
import { type DatePickerProps } from 'react-aria-components';
import { type CalendarDate } from '@internationalized/date';
import { type DateInputValue, type DatePickerBaseProps } from './types';
/**
 * Properties for the EgenDatePicker
 */
export interface EgenDatePickerProps extends Omit<DatePickerProps<CalendarDate>, 'className' | 'onChange' | 'defaultValue' | 'value'>, DatePickerBaseProps {
    /** The default value (uncontrolled) */
    defaultValue?: DateInputValue;
    /** Handler that is called when the value changes. */
    onChange?: (value: Date | null | undefined) => void;
    /** Handler that is called when the value changes. Note that this provides types from @internationalized/date. */
    onChangeRaw?: (value: DateValue | null) => void;
    /** Specifies the size of the input. Currently supports either `sm`, `md`, or `lg` as an option */
    size?: 'sm' | 'md' | 'lg';
    /** 'true' to use the short version. */
    short?: boolean;
    /** The value (controlled) */
    value?: DateInputValue;
}
/**
 * A date picker component to select a single date. Based on React Aria, but styled to look like Carbon.
 */
export declare const EgenDatePicker: React.ForwardRefExoticComponent<Omit<EgenDatePickerProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=egen-date-picker.component.d.ts.map