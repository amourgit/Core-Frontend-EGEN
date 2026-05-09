import React from 'react';
import { type DateInputProps } from 'react-aria-components';
interface EgenDateInputProps {
    id?: string;
}
/**
 * This is just the standard React Aria Components DatePickerInput with an added `onClick` handler to open
 * the calendar when the group is clicked. This is used to emulate Carbon's behaviour in the DatePicker.
 */
export declare const DatePickerInput: React.ForwardRefExoticComponent<DateInputProps & EgenDateInputProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=date-picker-input.component.d.ts.map