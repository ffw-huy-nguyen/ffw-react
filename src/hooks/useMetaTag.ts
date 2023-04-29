import { useEffect } from 'react';

export const useMetaTag = ({ title }: { title: string }) => {
    useEffect(() => {
        document.title = title;
    }, []);
};
