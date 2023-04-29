export const isContainSpecialCharacter = (str: string) => {
    const specialChars = /[`!@%^*\\[\];|\/?~]/;

    return specialChars.test(str);
};

export const isEqual = (str: string, str2: string, ignoreCase: boolean = true) => {
    return (
        String(str)
            .trim()
            .localeCompare(String(str2).trim(), undefined, { sensitivity: ignoreCase ? 'base' : 'case' }) == 0
    );
};

export const cutMiddleString = (name: string, maxLength: number, concat = '...') => {
    if (name.length < maxLength) {
        return name;
    } else {
        const number = Math.floor((maxLength - concat.length) / 2);
        return `${name.substring(0, number)}...${name.substring(name.length - number)}`;
    }
};

export const removeAll = (text: string, characterToRemove: string) => text.replaceAll(characterToRemove, '');

export const removeDiacritics = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
