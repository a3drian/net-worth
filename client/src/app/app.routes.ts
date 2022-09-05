import { Constants } from './shared/Constants';

export interface AppRoute {
	path: string;
	active?: boolean;
}

export const appRoutes = Object.freeze({
	login: <AppRoute>{ path: Constants.appEndpoints.LOGIN_URL },
	dashboard: <AppRoute>{ path: Constants.appEndpoints.DASHBOARD_URL },
	policy: <AppRoute>{ path: Constants.appEndpoints.POLICY_URL }
});
