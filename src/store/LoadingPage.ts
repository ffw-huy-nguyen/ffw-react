export const setIsLoadingPage = (isLoadingPage: boolean) => ({
    type: 'SET_ISLOADINGPAGE',
    payload: isLoadingPage,
});

const unloadedState = {
    loadingPage: false,
};

export const reducer = (state = unloadedState, action: { type: string; payload: boolean }) => {
    switch (action.type) {
        case 'SET_ISLOADINGPAGE':
            return {
                ...state,
                loadingPage: action.payload,
            };
        default:
            return state;
    }
};
