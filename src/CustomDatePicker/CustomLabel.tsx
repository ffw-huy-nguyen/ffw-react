import { Icon } from 'src/components_v2/common/Icon';
import { getSingleDateValue } from './helpers/CustomDatePicker.helpers';
import styles from './customDatePicker.module.scss';
import classnames from 'classnames';
interface CustomLabelProps {
    dateValue: string;
    isDateRange: boolean;
    isLegacy?: boolean;
    isTailIconDisplayed?: boolean;
    defaultValue?: string;
    isHighlightedOnHovering?: boolean;
    customHeight?: number;
    customTextLineHeight?: number;
    customIconLineHeight?: number;
}

export const CustomLabel = (props: CustomLabelProps) => {
    return (
        <>
            {props.isDateRange ? (
                <div className={props.isLegacy ? styles['custom-label__legacy'] : styles['custom-label__default']}>
                    <div className={props.isLegacy ? styles['default__icon'] : styles['default__text']}>
                        {props.isLegacy ? <Icon icon="calendar" /> : props.dateValue}
                    </div>
                    <div className={props.isLegacy ? styles['legacy__text'] : styles['default__icon']}>
                        {props.isLegacy ? props.dateValue : <Icon icon="calendar" />}
                    </div>
                </div>
            ) : (
                <div
                    className={classnames(
                        styles['custom-label__single-date'],
                        props.isHighlightedOnHovering && 'hover:tw-border-red',
                        props.customHeight && `tw-h-${props.customHeight}`
                    )}
                    style={{ lineHeight: `${props.customTextLineHeight ? props.customTextLineHeight : '27px'}` }}
                >
                    {getSingleDateValue(props.dateValue).length
                        ? getSingleDateValue(props.dateValue)
                        : props.defaultValue ?? null}
                    {props.isTailIconDisplayed && (
                        <span
                            className={classnames(
                                'tw-justify-self-end',
                                'tw-text-grey-3',
                                props.customIconLineHeight && `tw-pt-${props.customIconLineHeight}`
                            )}
                        >
                            <Icon icon="calendar" className="tw-text-2xl" />
                        </span>
                    )}
                </div>
            )}
        </>
    );
};
