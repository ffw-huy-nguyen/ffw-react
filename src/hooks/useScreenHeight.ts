import { useMediaQuery } from './useMediaQuery';

export const useScreenHeight = () => {
    const isMediumHeight = useMediaQuery('(max-height: 900px)');
    return {
        isMediumHeight,
    };
};
