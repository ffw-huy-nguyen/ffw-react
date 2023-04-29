import classnames from 'classnames';
import defaultLocale from 'date-fns/locale/en-US';
import { useCallback, useRef, useState } from 'react';
import { Calendar, CalendarProps, DefinedRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useLocation } from 'react-router-dom';
import {
    getFirstDayOfEarlistYear,
    getFormattedDate,
    getFormattedDayMonthYear,
    getFormattedMidnight,
    getFormattedZeroHour,
    getFutureDay,
    getLastDayOfYear,
    getStartDateOfWeekDiff,
} from 'src/helpers/date';
import { StorageKey, getLocalStorageItem } from 'src/helpers/storage';
import { useOnClickOutside } from 'src/hooks/useOnClickOutside';
import { usePayrollLocking } from 'src/hooks/usePayrollLocking';
import { LockingPayrollState } from 'src/store/PayRollLocking';
import styles from '../../customDatePicker.module.scss';
import {
    DateRangeDropdownLabels,
    checkStartDate,
    getCalendarInitialValue,
    getCustomRangeBtmDateValue,
    stateProps,
} from '../CustomDatePicker.helpers';
import { CustomDateRangeCalendar } from '../CustomDateRangeCalendar';
import { DropdownListProps } from './DropdownList.interface';

const monthNames = [...Array(12).keys()].map(i => defaultLocale.localize!.month(i));

const DropdownList = (props: DropdownListProps) => {
    const localtion = useLocation();
    const isPaypollPage = localtion.pathname === '/payroll';
    const currentRef = useRef<HTMLDivElement>(null);
    const defaultShowCalendar = (labelName: DateRangeDropdownLabels) => {
        if (labelName === DateRangeDropdownLabels.CustomRange) {
            return DateRangeDropdownLabels.CustomRange;
        } else if (labelName === DateRangeDropdownLabels.SelectPayRun) {
            return DateRangeDropdownLabels.SelectPayRun;
        }
        return '';
    };

    const { setPayrollLocking } = usePayrollLocking();

    const previousRunStartDate = getStartDateOfWeekDiff(props.payrollStartingDay ?? 1, 1);

    const previousRunWithYear = {
        startDate: previousRunStartDate,
        endDate: getFutureDay(6, previousRunStartDate),
    };

    const [showCalendar, setShowCalendar] = useState(defaultShowCalendar(props.labelName as DateRangeDropdownLabels));
    const initalStartDate = getCalendarInitialValue(props.dateValue).startDate;
    const initalEndDate = getCalendarInitialValue(props.dateValue).endDate;
    const [isSelectPayrun, setIsSelectPayrun] = useState(
        getLocalStorageItem<LockingPayrollState>(StorageKey.PayrollLocking)?.isActive
    );
    const [state, setState] = useState<stateProps>({
        startDate: initalStartDate,
        endDate: initalEndDate,
        key: 'selection',
    });
    const [singleDateState, setSingleDateState] = useState(getFormattedDate(props.dateValue));
    const [customRangeBtmValue, setCustomRangeBtmValue] = useState(props.customRangeBtmDateValue);

    const handleSelection = useCallback((selection: stateProps) => {
        setState(selection);
        setCustomRangeBtmValue(getCustomRangeBtmDateValue(selection.startDate, selection.endDate));
    }, []);

    const handleDropdownListSelection = (selection: any, optionName: DateRangeDropdownLabels) => {
        const startDate = checkStartDate(selection.startDate, selection.endDate);
        const endDate = getFormattedDayMonthYear(selection.endDate);
        setState(selection);
        setShowCalendar('');
        const isPreviousPayRunSelected = optionName === DateRangeDropdownLabels.PreviousPayRun;
        setPayrollLocking({ isPreviousPayRunSelected, isActive: false, isLockedPayRunSelected: false });

        if ([DateRangeDropdownLabels.Today, DateRangeDropdownLabels.Yesterday].includes(optionName)) {
            state && props.onDateValueChanged(optionName);
        } else {
            props.onDateValueChanged(`${startDate} - ${endDate}`, optionName);
        }
        props.handleApply(
            getFormattedZeroHour(selection.startDate),
            getFormattedMidnight(selection.endDate),
            isPreviousPayRunSelected
        );
    };

    const [isDisplayMonths, setIsDisplayMonths] = useState(false);
    const [isDisplayYears, setIsDisplayYears] = useState(false);

    const selectMonthRef = useRef(null);
    const selectYearRef = useRef(null);

    useOnClickOutside(selectMonthRef, () => {
        isDisplayMonths && setIsDisplayMonths(false);
    });

    useOnClickOutside(selectYearRef, () => {
        isDisplayYears && setIsDisplayYears(false);
    });

    const renderMonthAndYear = (
        focusedDate: Date,
        changeShownDate: (
            value: number | string,
            mode: 'set' | 'setYear' | 'setMonth' | 'monthOffset' | undefined
        ) => void,
        props: CalendarProps
    ) => {
        const { showMonthArrow, minDate, maxDate, showMonthAndYearPickers } = props;
        const upperYearLimit = maxDate!.getFullYear();
        const lowerYearLimit = minDate!.getFullYear();
        return (
            <div onMouseUp={e => e.stopPropagation()} className="rdrMonthAndYearWrapper">
                {showMonthArrow ? (
                    <button
                        type="button"
                        className="rdrNextPrevButton rdrPprevButton"
                        onClick={() => changeShownDate(-1, 'monthOffset')}
                    >
                        <i />
                    </button>
                ) : null}
                {showMonthAndYearPickers ? (
                    <span className="rdrMonthAndYearPickers">
                        <span className="rdrMonthPicker" ref={selectMonthRef}>
                            <div className="select-selected" onClick={() => setIsDisplayMonths(!isDisplayMonths)}>
                                {monthNames[focusedDate.getMonth()]}
                            </div>
                            <div className={classnames('select-items', !isDisplayMonths && 'select-hide')}>
                                {monthNames.map((monthName, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            changeShownDate(i, 'setMonth');
                                            setIsDisplayMonths(false);
                                        }}
                                    >
                                        {monthName}
                                    </div>
                                ))}
                            </div>
                        </span>
                        <span className="rdrMonthAndYearDivider" />
                        <span className="rdrYearPicker" ref={selectYearRef}>
                            <div className="select-selected" onClick={() => setIsDisplayYears(!isDisplayYears)}>
                                {focusedDate.getFullYear()}
                            </div>
                            <div className={classnames('select-items', !isDisplayYears && 'select-hide')}>
                                {new Array(upperYearLimit - lowerYearLimit + 1).fill(upperYearLimit).map((val, i) => {
                                    const year = val - i;
                                    return (
                                        <div
                                            key={year}
                                            onClick={() => {
                                                changeShownDate(year, 'setYear');
                                                setIsDisplayYears(false);
                                            }}
                                        >
                                            {year}
                                        </div>
                                    );
                                })}
                            </div>
                        </span>
                    </span>
                ) : (
                    <span className="rdrMonthAndYearPickers">
                        {monthNames[focusedDate.getMonth()]} {focusedDate.getFullYear()}
                    </span>
                )}
                {showMonthArrow ? (
                    <button
                        type="button"
                        className="rdrNextPrevButton rdrNextButton"
                        onClick={() => changeShownDate(+1, 'monthOffset')}
                    >
                        <i />
                    </button>
                ) : null}
            </div>
        );
    };

    return (
        <div className={styles['dropdown-list']}>
            {props.handleDropDownOptions && (
                <div
                    className={classnames(
                        styles['dropdown-list__options'],
                        showCalendar && styles['dropdown-list__options--no-radius'],
                        showCalendar && 'lg:tw-border-r-0',
                        'tw-border'
                    )}
                >
                    {props.handleDropDownOptions.optionNames.map((rc: DateRangeDropdownLabels, index) => {
                        return rc !== DateRangeDropdownLabels.CustomRange &&
                            rc !== DateRangeDropdownLabels.SelectPayRun ? (
                            <div data-cy={rc} key={`dropDownList_${index}`}>
                                <DefinedRange
                                    className={classnames(
                                        styles['list__item'],
                                        rc === props.labelName ? styles['item--selected'] : styles['item--not-selected']
                                    )}
                                    onChange={(item: any) => {
                                        setIsSelectPayrun(false);
                                        handleDropdownListSelection(item.selection, rc);
                                    }}
                                    ranges={[state]}
                                    inputRanges={[]}
                                    staticRanges={[
                                        {
                                            label: rc,
                                            hasCustomRendering: false,
                                            range: () => {
                                                return (
                                                    props.handleDropDownOptions?.handleDateRange(
                                                        rc,
                                                        props.currentRunStartDate,
                                                        props.previousRunStartDate
                                                    ) ?? { startDate: getFormattedDate(), endDate: getFormattedDate() }
                                                );
                                            },
                                            isSelected: () => {
                                                return true;
                                            },
                                        },
                                    ]}
                                />
                            </div>
                        ) : rc !== DateRangeDropdownLabels.CustomRange ? (
                            <div
                                data-cy={DateRangeDropdownLabels.SelectPayRun}
                                key={`customRange_${index}`}
                                className={classnames(
                                    styles['list__item'],
                                    rc === props.labelName ? styles['item--selected'] : styles['item--not-selected']
                                )}
                                onClick={() => {
                                    setShowCalendar(DateRangeDropdownLabels.SelectPayRun);
                                    setIsSelectPayrun(true);
                                    handleSelection({ ...previousRunWithYear, key: 'selection' });
                                }}
                            >
                                {DateRangeDropdownLabels.SelectPayRun}
                            </div>
                        ) : (
                            <div
                                data-cy={DateRangeDropdownLabels.CustomRange}
                                key={`customRange_${index}`}
                                className={classnames(
                                    styles['list__item'],
                                    rc === props.labelName ? styles['item--selected'] : styles['item--not-selected']
                                )}
                                onClick={() => {
                                    setShowCalendar(DateRangeDropdownLabels.CustomRange);
                                    setIsSelectPayrun(false);
                                    setPayrollLocking({ isPreviousPayRunSelected: false });
                                }}
                            >
                                {DateRangeDropdownLabels.CustomRange}
                            </div>
                        );
                    })}
                </div>
            )}
            {showCalendar && (
                <div className={styles['dropdown-list__calendar']} ref={currentRef} data-cy="calendar">
                    {props.isDateRange ? (
                        <CustomDateRangeCalendar
                            handleSelection={handleSelection}
                            state={state}
                            trackBackYears={props.trackBackYears}
                            displayMonthAmount={props.displayMonthAmount}
                            payrollStartingDay={props.payrollStartingDay}
                            lockableStartDate={props.lockableStartDate}
                            isSelectPayrun={isSelectPayrun && isPaypollPage}
                        />
                    ) : (
                        <Calendar
                            className={classnames(props.displayMonthAmount === 1 && styles['calendar__show-one-month'])}
                            date={singleDateState}
                            onChange={item => setSingleDateState(item)}
                            months={props.displayMonthAmount ?? 2}
                            direction="horizontal"
                            showDateDisplay={false}
                            weekdayDisplayFormat="EEEEE"
                            maxDate={props.maxDate ?? getLastDayOfYear()}
                            minDate={props.minDate ?? getFirstDayOfEarlistYear(props.trackBackYears)}
                            navigatorRenderer={renderMonthAndYear}
                        />
                    )}
                </div>
            )}
            {showCalendar && (
                <div className={styles['dropdown-list__footer']}>
                    <span>{props.isDateRange && customRangeBtmValue}</span>
                    {props.hasClearButton && (
                        <button
                            data-cy="btn-calendar-cancel"
                            className={styles['footer__btn']}
                            onClick={props.clearValue}
                        >
                            Clear
                        </button>
                    )}

                    <button className={styles['footer__btn']} onClick={props.closeDropdownListPanel}>
                        Cancel
                    </button>
                    <button
                        data-cy="btn-calendar-submit"
                        className={classnames(styles['footer__btn'], styles['footer__btn--apply'])}
                        onClick={() => {
                            props.isDateRange && props.onCustomRangeSelection({ ...state, isSelectPayrun });
                            !props.isDateRange &&
                                props.onCustomSingleDateSelection &&
                                props.onCustomSingleDateSelection(singleDateState ?? getFormattedDate(props.dateValue));
                        }}
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
};

export default DropdownList;
