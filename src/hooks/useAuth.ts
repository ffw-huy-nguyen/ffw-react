import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../helpers/auth';
import { Permissions } from '../helpers/getFlagValues';
import { AccessToken, AuthStoreState, setAuth as setAuthStore } from '../store/Auth';
import { useAuthOption } from './useAuthOption';
import { useMetadata } from './useMetaData';

export interface AuthContext extends AuthStoreState {
    isAdmin: boolean;
    isOMSUser: boolean;
    [Permissions.CanSeeSpectre]: boolean;
    [Permissions.CanSeeHarvest]: boolean;
    [Permissions.CanSeePayroll]: boolean;
    [Permissions.CanSeeTimesheets]: boolean;
    [Permissions.CanEditSpray]: boolean;
    [Permissions.CanSeeMaps]: boolean;
    [Permissions.CanSeeInsights]: boolean;
    [Permissions.CanSeeScout]: boolean;
    [Permissions.CanSeeAdminPayroll]: boolean;
    [Permissions.CanEditOMSAdmin]: boolean;
    [Permissions.CanEditOrchardV2]: boolean;
    setAuth: (jwt: string) => Promise<AccessToken>;
}

export const useAuth = (): AuthContext => {
    const authDetail = useSelector((state: { auth: AuthStoreState }) => state.auth);
    const dispatch = useDispatch();
    const getAuthOption = useAuthOption();
    // This is for Hectre Admin who already logged in v2.20.0
    const accountType = useMetadata('accountType');

    const setAuth = async (jwt: string): Promise<AccessToken> => {
        const token = JSON.parse(atob(jwt)) as AccessToken;
        const isManager = !!(['admin', 'owner', 'manager'].indexOf(token.AccountType) >= 0);
        dispatch(
            setAuthStore({
                canLogin: token.User.canLogin,
                canEditAdmin: token.User.canEditAdmin ?? isManager,
                canSeeFinancials: token.User.canSeeFinancials ?? isManager,
                spectreModule: token.User.spectreModule,
                accountType: token.AccountType,
                hasFullDashboardAccess: !!(token.User.canEditAdmin && token.User.canSeeFinancials),
            })
        );
        setToken(jwt);
        await getAuthOption();
        return token;
    };
    // This is for users who already logged in v2.20.0
    const isOldVerion = !authDetail.spectreModule && !authDetail.canLogin;
    return {
        ...authDetail,
        isAdmin: authDetail.accountType === 'admin' || accountType === 'admin',
        isOMSUser: isOldVerion || authDetail.canLogin,
        [Permissions.CanSeeSpectre]: !!authDetail.spectreModule,
        [Permissions.CanSeeHarvest]: isOldVerion || authDetail.canLogin,
        [Permissions.CanSeePayroll]: isOldVerion || (authDetail.canLogin && authDetail.canSeeFinancials),
        [Permissions.CanSeeTimesheets]: isOldVerion || (authDetail.canLogin && authDetail.canEditAdmin),
        [Permissions.CanEditSpray]: isOldVerion || (authDetail.canLogin && authDetail.hasSpray),
        [Permissions.CanSeeMaps]: isOldVerion || authDetail.canLogin,
        [Permissions.CanSeeInsights]: isOldVerion || (authDetail.canLogin && authDetail.canSeeFinancials),
        [Permissions.CanSeeScout]: isOldVerion || authDetail.canLogin,
        [Permissions.CanEditOMSAdmin]: isOldVerion || (authDetail.canLogin && authDetail.canEditAdmin),
        [Permissions.CanEditOrchardV2]:
            isOldVerion || (authDetail.orchardLocationVersion2 && authDetail.canLogin && authDetail.canEditAdmin),
        [Permissions.CanSeeAdminPayroll]:
            isOldVerion || (authDetail.canLogin && authDetail.canEditAdmin && authDetail.enableOvertimeFeature),
        setAuth,
    };
};
