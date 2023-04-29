export enum DatePickerTypes {
    MonthPicker = 'rdrMonthPicker',
    YearPicker = 'rdrYearPicker',
}

export enum DatePickerButtonTypes {
    Forward = 'forward',
    Backward = 'backward',
}

export const closeSelectMenu = (currentRef: any, element?: HTMLElement) => {
    var i,
        arrNo = [];
    const selectItemElement = currentRef.current?.getElementsByClassName('select-items');
    const selectedElement = currentRef.current?.getElementsByClassName('select-selected');

    for (i = 0; i < selectedElement.length; i++) {
        element === selectedElement[i] && arrNo.push(i);
    }
    for (i = 0; i < selectItemElement.length; i++) {
        arrNo.indexOf(i) && selectItemElement[i].classList.add('select-hide');
    }
};

const listenCustomDivForSelectOption = (
    className: DatePickerTypes,
    nativeSelectValueSetter: any,
    customDivForSelectOption: HTMLElement,
    minMonthIndex?: number,
    maxMonthIndex?: number
) => {
    customDivForSelectOption.addEventListener('click', function () {
        var thirdPartySelectEleBlock = this.parentNode?.parentNode as HTMLElement;
        const thirdPartySelect = thirdPartySelectEleBlock.getElementsByTagName('select')[0];
        var thirdPartySelectLength = thirdPartySelectEleBlock.getElementsByTagName('select')[0]?.length ?? 0;
        var customEleForSelectedItem = this.parentNode?.previousSibling as HTMLElement;
        for (var i = 0; i < thirdPartySelectLength; i++) {
            if (thirdPartySelect?.options[i]?.innerHTML === this.innerHTML) {
                thirdPartySelect.selectedIndex = i;
                var limitRangeIValue = i;
                if (maxMonthIndex && minMonthIndex) {
                    if (minMonthIndex && minMonthIndex > i + minMonthIndex - 1) {
                        limitRangeIValue = minMonthIndex;
                    }
                    if (maxMonthIndex && maxMonthIndex < i + maxMonthIndex) {
                        limitRangeIValue = maxMonthIndex;
                    }
                }
                var passValue = className === DatePickerTypes.YearPicker ? this.innerHTML : limitRangeIValue;
                nativeSelectValueSetter?.call(thirdPartySelect, `${passValue}`);
                let event = new Event('change', { bubbles: true });
                thirdPartySelect.dispatchEvent(event);
                customEleForSelectedItem.innerHTML = thirdPartySelect?.options[i]?.innerHTML ?? '';
                var customEleForOption = this.parentNode as HTMLElement;
                const sameAsSelectedItem = customEleForOption.getElementsByClassName('same-as-selected');
                for (var k = 0; k < sameAsSelectedItem.length; k++) {
                    sameAsSelectedItem[k]?.removeAttribute('class');
                }
                this.setAttribute('class', 'same-as-selected');
                break;
            }
        }
        customEleForSelectedItem.click();
    });
};

const listenserCustomDivForSelect = (customDivForSelect: HTMLElement, currentRef: any) => {
    customDivForSelect.addEventListener('click', function (e) {
        e.stopPropagation();
        var nextSibling = this.nextSibling as HTMLElement;
        if (!customDivForSelect.innerText) {
            customDivForSelect.innerText = nextSibling.innerText;
        }
        closeSelectMenu(currentRef, customDivForSelect);
        nextSibling.classList.toggle('select-hide');
    });
};

const createCustomSelectOption = (
    className: DatePickerTypes,
    nativeSelectValueSetter: any,
    thridPartySelectLength: number,
    customDivForSelectedItem: HTMLElement,
    minMonthIndex?: number,
    maxMonthIndex?: number,
    thirdPartySelect?: HTMLSelectElement
) => {
    for (var j = 0; j < thridPartySelectLength; j++) {
        var customDivForSelectOption = document.createElement('DIV');
        customDivForSelectOption.innerHTML = thirdPartySelect?.options[j]?.innerHTML ?? '';
        listenCustomDivForSelectOption(
            className,
            nativeSelectValueSetter,
            customDivForSelectOption,
            minMonthIndex,
            maxMonthIndex
        );
        customDivForSelectedItem.appendChild(customDivForSelectOption);
    }
};

export const customCalendarSelectMenu = (
    currentRef: any,
    className: DatePickerTypes,
    nativeSelectValueSetter: any,
    minMonthIndex?: number,
    maxMonthIndex?: number
) => {
    var thridPartySelectLength = 0;
    var thirdPartySelectEleBlock = currentRef.current?.getElementsByClassName(className);
    var thirdPartySelectBlockLength = currentRef.current?.getElementsByClassName(className).length;
    for (var i = 0; i < thirdPartySelectBlockLength; i++) {
        var thirdPartySelect = thirdPartySelectEleBlock[i]?.getElementsByTagName('select')[0];
        thridPartySelectLength = thirdPartySelectEleBlock[i]?.getElementsByTagName('select')[0]?.length ?? 0;
        var customDivForSelect = document.createElement('DIV');
        customDivForSelect.setAttribute('class', 'select-selected');
        customDivForSelect.innerHTML = thirdPartySelect?.options[thirdPartySelect.selectedIndex]?.innerHTML ?? '';
        thirdPartySelectEleBlock[i]?.appendChild(customDivForSelect);
        var customDivForSelectedItem = document.createElement('DIV');
        customDivForSelectedItem.setAttribute('class', 'select-items select-hide');
        createCustomSelectOption(
            className,
            nativeSelectValueSetter,
            thridPartySelectLength,
            customDivForSelectedItem,
            minMonthIndex,
            maxMonthIndex,
            thirdPartySelect
        );
        thirdPartySelectEleBlock[i]?.appendChild(customDivForSelectedItem);
        listenserCustomDivForSelect(customDivForSelect, currentRef);
    }
};

export const updateMonthYearPickerValue = (
    currentRef: any,
    previousElement: HTMLSelectElement | undefined,
    className: DatePickerTypes,
    direction: DatePickerButtonTypes,
    minMonthIndex?: number,
    maxMonthIndex?: number,
    referElement?: HTMLSelectElement | undefined
) => {
    const index = className === DatePickerTypes.MonthPicker ? 0 : 1;
    const customMonthElement = currentRef.current?.getElementsByClassName('select-selected')[index];
    var customIndex = 0;
    var previousIndex = previousElement?.selectedIndex ?? -1;
    const previousElementLength = previousElement?.length ?? 0;
    const referElementLength = referElement?.length ?? 0;
    if (minMonthIndex && previousIndex === minMonthIndex && direction === DatePickerButtonTypes.Backward) {
        previousIndex += 1;
    }
    if (maxMonthIndex && previousIndex === maxMonthIndex && direction === DatePickerButtonTypes.Forward) {
        previousIndex -= 1;
    }
    var limitRangeCustomIndex;

    if (minMonthIndex !== undefined && maxMonthIndex !== undefined) {
        const monthDiff = (maxMonthIndex ?? 0) - (minMonthIndex ?? 0);
        limitRangeCustomIndex = handlePriovousForwardBtnForCustomRange(index, direction, monthDiff);
    } else {
        if (direction === DatePickerButtonTypes.Backward && previousIndex >= 0) {
            if (className === DatePickerTypes.MonthPicker) {
                customIndex = previousIndex === 0 ? previousElementLength - 1 : previousIndex - 1;
            }
            if (className === DatePickerTypes.YearPicker) {
                customIndex = referElement?.selectedIndex === 0 ? previousIndex + 1 : previousIndex;
                customIndex = customIndex < 0 ? 0 : customIndex;
            }
        } else {
            if (className === DatePickerTypes.MonthPicker) {
                if (referElement?.selectedIndex === 0 && previousIndex === previousElementLength - 1) {
                    customIndex = previousElementLength - 1;
                } else {
                    customIndex = previousIndex === previousElementLength - 1 ? 0 : previousIndex + 1;
                }
            }
            if (className === DatePickerTypes.YearPicker) {
                customIndex =
                    referElement?.selectedIndex === referElementLength - 1 ? previousIndex - 1 : previousIndex;
                customIndex = customIndex < 0 ? 0 : customIndex;
            }
        }
    }

    const previousMonthValue = previousElement?.options[limitRangeCustomIndex ?? customIndex]?.innerHTML ?? '';
    if (customMonthElement) {
        customMonthElement.innerHTML = previousMonthValue;
    }
};

const handlePriovousForwardBtnForCustomRange = (index: number, direction: DatePickerButtonTypes, monthDiff: number) => {
    if (direction === DatePickerButtonTypes.Backward || index === 1) return 0;
    return monthDiff;
};
