import { useQuery } from 'react-query';
import { getData } from 'src/ApiService';
import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';
import { objectToQueryString } from 'src/helpers/objects';
import { useMockQuery } from './mocks/useMockQuery';

interface GetApiProps<InputData, ResponseData> {
    params?: InputData;
    endpoint: ApiEndpoint;
    queryKey: string | string[];
    isMocking?: boolean;
    onSuccess?: (data: ResponseData) => void;
}
export const useGetApi = <InputData, ResponseData>({
    params,
    endpoint,
    queryKey,
    isMocking,
    onSuccess,
}: GetApiProps<InputData, ResponseData>) => {
    let parsedParams = '';
    const queryKeys: (string | InputData)[] = Array.isArray(queryKey) ? queryKey : [queryKey];
    if (params) {
        parsedParams = '?' + objectToQueryString(params);
        queryKeys.push(params);
    }

    const mockGetApi = useMockQuery<ResponseData>({ endpoint });

    const getApi = useQuery(
        queryKeys,
        async () => {
            return await getData<ResponseData>(endpoint + parsedParams);
        },
        {
            enabled: false,
            onSuccess: onSuccess,
        }
    );

    return isMocking ? mockGetApi : getApi;
};
