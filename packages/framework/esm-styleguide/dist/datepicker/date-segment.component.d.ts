import React from 'react';
import { type DateSegmentProps } from 'react-aria-components';
/**
 * This component represents a part of the displayed date in the date picker.
 *
 * This is lightly-modified from the react-aria-components DateSegment component. It prevents click events
 * from propagating to the parent `DatePickerInput` so that the calendar doesn't open when editing a date
 * segment.
 */
export declare const DateSegment: React.ForwardRefExoticComponent<DateSegmentProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=date-segment.component.d.ts.map