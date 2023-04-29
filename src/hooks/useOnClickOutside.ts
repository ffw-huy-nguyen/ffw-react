import { RefObject } from 'react';

import { useEventListener } from './useEventListener';

type Handler = (event: MouseEvent) => void;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: Handler,
    outsideRef?: RefObject<T>,
    mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void => {
    useEventListener(mouseEvent, event => {
        const el = ref?.current;
        const outsideEl = outsideRef?.current;

        // Do nothing if clicking ref's element, descendent elements or in a specific outside element
        if (!el || el.contains(event.target as Node) || (outsideEl && event.target !== outsideEl)) {
            return;
        }

        handler(event as MouseEvent);
    });
};
