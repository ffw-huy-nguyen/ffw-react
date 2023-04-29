import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
    const getMatches = (query: string): boolean => {
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState<boolean>(getMatches(query));

    function handleChange() {
        setMatches(getMatches(query));
    }

    useEffect(() => {
        const matchMedia = window.matchMedia(query);

        // Triggered at the first client-side load and if query changes
        handleChange();

        // Listen matchMedia
        matchMedia.addEventListener('change', handleChange);

        return () => {
            matchMedia.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
};
