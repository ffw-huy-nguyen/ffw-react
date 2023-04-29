import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { SuspenseLoading } from 'src/components_v2/common/SuspenseLoading/SuspenseLoading';
import {
    getFormattedDate,
    getFormattedDayMonthYear,
    getFormattedMidnight,
    getFormattedZeroHour,
    getStartDateOfWeekDiff,
} from 'src/helpers/date';
import { useOnClickOutside } from 'src/hooks/useOnClickOutside';
import { usePayrollLocking } from 'src/hooks/usePayrollLocking';
import { useToggle } from 'src/hooks/useToggle';
import { CustomDatePickerProps } from './CustomDatePicker.interface';
import styles from './customDatePicker.module.scss';
import { CustomLabel } from './CustomLabel';
import {
    checkStartDate,
    getCustomRangeBtmDateValue,
    stateProps,
    useGetLocalSavedStartDate,
} from './helpers/CustomDatePicker.helpers';
import { DropdownList } from './helpers/DropdownList';

export const CustomDatePicker = (props: CustomDatePickerProps) => {
    const { setPayrollLocking } = usePayrollLocking();
    const currentRef = useRef(null);
    const currentRunStartDate = getStartDateOfWeekDiff(props.payrollStartingDay ?? 1);
    const previousRunStartDate = getStartDateOfWeekDiff(props.payrollStartingDay ?? 1, 1);
    const customRangeBtmDateValue = getCustomRangeBtmDateValue(props.startDate, props.endDate);
    const [dateValue, setDateValue] = useState('');
    const [labelName, setLabelName] = useState('');
    const [showDropdownPanel, setShowDropdownPanel] = useToggle(false);
    const [isApplyPayRun, setIsApplyPayRun] = useState<boolean | undefined>(undefined);
    const getLocalSavedStartDate = useGetLocalSavedStartDate();
    useEffect(() => {
        (async () => {
            const { dateValue, labelName } = await getLocalSavedStartDate({
                currentRunStartDate,
                previousRunStartDate,
                isInitialValueNull: props.isInitialValueNull,
                isDateRange: props.isDateRange,
                startDate: props.startDate ? getFormattedDate(props.startDate) : undefined,
                endDate: getFormattedDate(props.endDate),
                optionNames: props.handleDropDownOptions?.optionNames,
                startingDay: props.payrollStartingDay ?? 1,
                isApplyPayRun,
            });
            setDateValue(dateValue);
            setLabelName(labelName);
        })();
    }, [props.startDate, props.payrollStartingDay]);

    useOnClickOutside(currentRef, () => {
        showDropdownPanel && setShowDropdownPanel(false);
    });

    const onCustomRangeSelection = (state: stateProps) => {
        const startDate = checkStartDate(state.startDate, state.endDate);
        const endDate = getFormattedDayMonthYear(state.endDate);
        setShowDropdownPanel(!showDropdownPanel);
        setDateValue(`${startDate} - ${endDate}`);

        setPayrollLocking({
            isActive: !!state.isSelectPayrun,
            startDate: state.startDate,
            endDate: state.endDate,
        });

        handleApplyDate(
            getFormattedZeroHour(state.startDate),
            getFormattedMidnight(state.endDate),
            state.isSelectPayrun
        );
    };

    const onCustomSingleDateSelection = (date: Date) => {
        setShowDropdownPanel(!showDropdownPanel);
        setDateValue(`${getFormattedDayMonthYear(date)}`);
        handleApplyDate(date);
    };

    const handleApplyDate = async (startDate: Date, endDate?: Date, isGetLockedPayRuns?: boolean) => {
        setIsApplyPayRun(!!isGetLockedPayRuns);
        props.handleApply(startDate, endDate);
    };

    return (
        <div ref={currentRef}>
            <div className="tw-cursor-text" onClick={() => setShowDropdownPanel(!showDropdownPanel)}>
                <CustomLabel
                    dateValue={dateValue}
                    isLegacy={props.isLegacy}
                    isDateRange={props.isDateRange}
                    isTailIconDisplayed={props.isTailIconDisplayed}
                    defaultValue={props.defaultValue}
                    isHighlightedOnHovering={props.isHighlightedOnHovering}
                    customHeight={props.customHeight}
                    customTextLineHeight={props.customTextLineHeight}
                    customIconLineHeight={props.customIconLineHeight}
                />
            </div>
            {showDropdownPanel && (
                <SuspenseLoading>
                    <DropdownList
                        payrollStartingDay={props.payrollStartingDay}
                        currentRunStartDate={currentRunStartDate}
                        previousRunStartDate={previousRunStartDate}
                        handleApply={(start, end, isGetLockedPayRuns) => {
                            handleApplyDate(start, end, isGetLockedPayRuns);
                            setShowDropdownPanel();
                        }}
                        onDateValueChanged={(selectedName, labelName) => {
                            setDateValue(selectedName);
                            setLabelName(labelName ?? selectedName);
                        }}
                        handleDropDownOptions={props.handleDropDownOptions}
                        dateValue={dateValue}
                        labelName={labelName}
                        customRangeBtmDateValue={customRangeBtmDateValue}
                        closeDropdownListPanel={setShowDropdownPanel}
                        onCustomRangeSelection={(state: stateProps) =>
                            props.isDateRange && onCustomRangeSelection(state)
                        }
                        trackBackYears={props.trackBackYears}
                        displayMonthAmount={props.displayMonthAmount}
                        isDateRange={props.isDateRange}
                        onCustomSingleDateSelection={(state: Date) =>
                            !props.isDateRange && onCustomSingleDateSelection(state)
                        }
                        maxDate={props.maxDate}
                        minDate={props.minDate}
                        hasClearButton={props.hasClearButton}
                        clearValue={() => setDateValue('')}
                        lockableStartDate={props.lockableStartDate}
                    />
                </SuspenseLoading>
            )}
            {showDropdownPanel && <div className={styles['custom-daterange-picker__triangle']}></div>}
        </div>
    );
};
