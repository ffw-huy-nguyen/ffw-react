import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { getLocalStorageItem, setLocalStorageItem } from 'src/helpers/storage';
import { useEventListener } from './useEventListener';

declare global {
    interface WindowEventMap {
        'local-storage': CustomEvent;
    }
}

type SetValue<T> = Dispatch<SetStateAction<T>>;

export const useLocalStorage = <T>(key: string, initialValue: T): [T, SetValue<T>] => {
    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = useCallback((): T => {
        // Prevent build error "window is undefined" but keep keep working
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = getLocalStorageItem(key) as T;
            return item ?? initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValueRef = useRef<SetValue<T>>();

    setValueRef.current = (value) => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window == 'undefined') {
            console.warn(
                `Tried setting localStorage key “${key}” even though environment is not a client`
            );
        }

        try {
            // Allow value to be a function so we have the same API as useState
            const newValue =
                value instanceof Function ? value(storedValue) : value;

            // Save to local storage
            setLocalStorageItem(key, newValue);

            // Save state
            setStoredValue(newValue);

            // We dispatch a custom event so every useLocalStorage hook are notified
            window.dispatchEvent(new Event('local-storage'));
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    };

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue: SetValue<T> = useCallback(
        (value) => setValueRef.current?.(value),
        []
    );

    useEffect(() => {
        setStoredValue(readValue());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStorageChange = useCallback(() => {
        setStoredValue(readValue());
    }, [readValue]);

    // this only works for other documents, not the current one
    useEventListener('storage', handleStorageChange);

    // this is a custom event, triggered in writeValueToLocalStorage
    // See: useLocalStorage()
    useEventListener('local-storage', handleStorageChange);

    return [storedValue, setValue];
};
