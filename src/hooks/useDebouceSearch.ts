import debounce from 'lodash/debounce';
import { useEffect, useRef, useState } from 'react';

export const useDebouceSearch = (onSearched: (key: string) => void) => {
    const [keyword, setKeyword] = useState({ value: '' });
    const updateTableSearchText = (keyword: string) => {
        onSearched(keyword);
    };
    const debouncedSearch = useRef(
        debounce((criteria: string) => {
            updateTableSearchText(criteria);
        }, 500)
    ).current;

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearch = () => {
        setKeyword({
            value: '',
        });
        updateTableSearchText('');
    };

    return {
        keyword,
        handleSearch,
        debouncedSearch,
        setKeyword
    };
};
