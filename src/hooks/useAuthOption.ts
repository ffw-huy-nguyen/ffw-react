import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';
import { Metadata } from 'src/DataContracts/Metadata';
import { setAuthOption } from 'src/store/Auth';
import { QueryKey } from './apis/QueryKey';
import { useGetApi } from './apis/useGetApi';

export const useAuthOption = () => {
    const dispatch = useDispatch();
    const api = useGetApi<{}, { response: Metadata }>({
        endpoint: ApiEndpoint.Metadata,
        queryKey: QueryKey.GetMetaData,
    });
    useEffect(() => {
        if (api.data?.response) {
            const { options } = api.data?.response;
            dispatch(
                setAuthOption({
                    hasSpray: options.hasSpray,
                    hasLots: options.hasLots,
                    hasSectors: options.hasSectors,
                    seeInsights: options.seeInsights,
                    orchardLocationVersion2: options.orchardLocationVersion2,
                    enableOvertimeFeature: options.enableOvertimeFeature,
                })
            );
        }
    }, [api.data]);

    return api.refetch;
};
