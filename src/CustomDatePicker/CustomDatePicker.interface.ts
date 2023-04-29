import { DateRangeDropdownLabels } from './helpers/CustomDatePicker.helpers';
export interface CustomDatePickerProps {
    payrollStartingDay?: number;
    isDateRange: boolean;
    handleApply: (start: Date, end?: Date) => void;
    startDate?: string | Date;
    endDate?: string | Date;
    handleDropDownOptions?: {
        optionNames: Array<DateRangeDropdownLabels>;
        handleDateRange: (
            optionName: DateRangeDropdownLabels,
            currentRunStartDate: Date,
            previousRunStartDate: Date
        ) => { startDate: Date; endDate: Date };
    };
    trackBackYears?: number;
    displayMonthAmount?: number;
    isInitialValueNull?: boolean;
    maxDate?: Date;
    minDate?: Date;
    isLegacy?: boolean;
    isTailIconDisplayed?: boolean;
    defaultValue?: string;
    hasClearButton?: boolean;
    isHighlightedOnHovering?: boolean;
    customHeight?: number;
    customTextLineHeight?: number;
    customIconLineHeight?: number;
    lockableStartDate?: Date;
}
