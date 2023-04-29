import { useCallback, useEffect, useState } from 'react';
import { getLocalStorageItem } from 'src/helpers/storage';
import { useEventListener } from './useEventListener';

type Value<T> = T | null;

export const useGetLocalStorage = <T>(key: string, isKeepType?: boolean): Value<T> => {
    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = useCallback((): Value<T> => {
        // Prevent build error "window is undefined" but keep keep working
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            return getLocalStorageItem(key, isKeepType);
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return null;
        }
    }, [key]);

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<Value<T>>(readValue);

    // Listen if localStorage changes
    useEffect(() => {
        setStoredValue(readValue());
    }, []);

    const handleStorageChange = useCallback(() => {
        setStoredValue(readValue());
    }, [readValue]);

    // this only works for other documents, not the current one
    useEventListener('storage', handleStorageChange);

    // this is a custom event, triggered in writeValueToLocalStorage
    // See: useLocalStorage()
    useEventListener('local-storage', handleStorageChange);

    return storedValue;
};
