import { useSelector } from 'react-redux';

export enum FeatureFlag {
    OvertimeFlag = 'overtimeFlag',
}

export const useFeatureFlag = (flagName: FeatureFlag) => {
    const flagValues: { [key in FeatureFlag]: boolean } = {
        [FeatureFlag.OvertimeFlag]: useSelector(
            (state: { featureFlags: { overtimeFlag: boolean } }) =>
                state.featureFlags.overtimeFlag
        ),
    };
    
    return flagValues[flagName] ;
};
