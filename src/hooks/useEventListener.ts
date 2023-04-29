import { RefObject, useEffect, useRef } from 'react';

export const useEventListener = <
    KW extends keyof WindowEventMap,
    KH extends keyof HTMLElementEventMap,
    T extends HTMLElement | void = void
>(
        eventName: KW | KH,
        handler: (
        event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event
    ) => void,
        element?: RefObject<T>
    ) => {
    // Create a ref that stores handler
    const savedHandler = useRef(handler);
    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);
    useEffect(
        () => {
            const targetElement: T | Window = element?.current || window;
            if (!(targetElement && targetElement.addEventListener)) {
                return;
            }

            // Create event listener that calls handler function stored in ref
            const eventListener: typeof handler = event => savedHandler.current(event);

            // Add event listener
            targetElement.addEventListener(eventName, eventListener);
            // Remove event listener on cleanup
            return () => {
                targetElement.removeEventListener(eventName, eventListener);
            };
        },
        [eventName, element] // Re-run if eventName or element changes
    );
};
