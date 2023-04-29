import classnames from 'classnames';
import { memo } from 'react';
import { RangeKeyDict } from 'react-date-range';
import { CustomDateRange } from 'src/components_v2/common/ReactDateRange/components/CustomDateRange';
import { getFirstDayOfEarlistYear, getLastDayOfYear, getPreviousDay, getStartDateOfWeekDiff } from 'src/helpers/date';
import styles from '../../customDatePicker.module.scss';
import { stateProps } from '../CustomDatePicker.helpers';
import { calculateMinDate } from '../getDateRangeValues';
interface CustomDateRangeCalendarProps {
    handleSelection: (selection: any) => void;
    state: stateProps;
    trackBackYears: number | undefined;
    displayMonthAmount?: number;
    payrollStartingDay?: number;
    isSelectPayrun?: boolean;
    lockableStartDate?: Date;
}

export const CustomDateRangeCalendar = memo((props: CustomDateRangeCalendarProps) => {
    const months = props.displayMonthAmount ?? 2;
    const currentRunStartDate = getStartDateOfWeekDiff(props.payrollStartingDay ?? 1);
    const maxDate = props.isSelectPayrun ? getPreviousDay(1, currentRunStartDate) : getLastDayOfYear();
    const minDate =
        props.isSelectPayrun && props.lockableStartDate
            ? calculateMinDate(props.lockableStartDate, props.payrollStartingDay ?? 1)
            : getFirstDayOfEarlistYear(props.trackBackYears);

    return (
        <CustomDateRange
            className={classnames(props.displayMonthAmount === 1 && styles['calendar__show-one-month'])}
            onChange={(item: RangeKeyDict) => {
                props.handleSelection(item['selection']);
            }}
            ranges={[
                {
                    startDate: props.state.startDate,
                    endDate: props.state.endDate,
                    key: 'selection',
                },
            ]}
            dragSelectionEnabled={!props.isSelectPayrun}
            months={months}
            direction="horizontal"
            showDateDisplay={false}
            weekdayDisplayFormat="EEEEE"
            maxDate={maxDate}
            minDate={minDate}
            payrollStartingDay={props.payrollStartingDay}
            isSelectPayrun={props.isSelectPayrun}
        />
    );
});
