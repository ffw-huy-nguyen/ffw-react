import { useSelector } from 'react-redux';
import { Metadata } from 'src/DataContracts/Metadata';

export const useMetadata = <T>(name: keyof Metadata) => {
    return useSelector((state: { metadata: { metadata: Metadata } }) => state.metadata.metadata[name] as unknown as T);
};
