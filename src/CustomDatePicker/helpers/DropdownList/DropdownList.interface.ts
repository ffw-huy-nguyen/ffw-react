import { DateRangeDropdownLabels, stateProps } from '../CustomDatePicker.helpers';
export interface DropdownListProps {
    dateValue: string;
    labelName: string;
    customRangeBtmDateValue: string;
    currentRunStartDate: Date;
    previousRunStartDate: Date;
    handleApply: (start: Date, end: Date, isPreviousPayRunSelected: boolean) => void;
    onDateValueChanged: (selectedName: string, labelName?: string) => void;
    closeDropdownListPanel: VoidFunction;
    onCustomRangeSelection: (state: stateProps) => void;
    handleDropDownOptions?: {
        optionNames: Array<DateRangeDropdownLabels>;
        handleDateRange: (
            optionName: DateRangeDropdownLabels,
            currentRunStartDate: Date,
            previousRunStartDate: Date
        ) => { startDate: Date; endDate: Date };
    };
    trackBackYears: number | undefined;
    displayMonthAmount?: number;
    isDateRange: boolean;
    onCustomSingleDateSelection?: (state: Date) => void;
    maxDate?: Date;
    minDate?: Date;
    clearValue?: VoidFunction;
    hasClearButton?: boolean;
    payrollStartingDay?: number;
    lockableStartDate?: Date;
}
